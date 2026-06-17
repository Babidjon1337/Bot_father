from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from database.models import User, BotConfig, ScheduledTask, Lead, async_session
from datetime import datetime, timedelta

from schemas.funnel import *
from loggers import logger


# ⚡️ НОВАЯ ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ ОПЛАТ
async def get_bot_by_tg_id(tg_bot_id: int):
    async with async_session() as session:
        bot = await session.scalar(
            select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id)
        )
        return bot


async def get_lead(bot_id: int, telegram_id: int) -> Lead | None:
    """Запрашивает лида по bot_id и telegram_id."""
    async with async_session() as session:
        return await session.scalar(
            select(Lead).where(Lead.bot_id == bot_id, Lead.telegram_id == telegram_id)
        )


async def get_funnel_by_bot_id(tg_bot_id: int):
    async with async_session() as session:
        result = await session.scalar(
            select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id)
        )
        funnel = FunnelSchema.model_validate(result.funnel_schema) if result else None

        return funnel


async def create_lead(tg_bot_id: int, telegram_id: int, agreed: bool = False):
    async with async_session() as session:
        bot = await session.scalar(
            select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id)
        )

        if not bot:
            logger.warning(f"Бот с tg_bot_id {tg_bot_id} не найден в базе!")
            return None

        # 2. Проверяем, существует ли уже такой лид у этого бота
        existing_lead = await session.scalar(
            select(Lead).where(Lead.bot_id == bot.id, Lead.telegram_id == telegram_id)
        )

        # 3. ЗАЩИТА: Если лид уже есть, мы просто возвращаем его.
        if existing_lead:
            return existing_lead

        # 4. Если лида нет — создаем новую запись
        new_lead = Lead(
            bot_id=bot.id,
            telegram_id=telegram_id,
            agreed_to_tos=agreed,
            current_step_id="node_start" if agreed else "awaiting_agreement"
        )

        session.add(new_lead)
        await session.flush()

        await session.commit()
        logger.info(f"🔥 Создан новый лид {telegram_id} для бота {bot.id} (Согласие: {agreed})")

        # ⚡️ Если лид сразу согласился (или мы не требуем согласия), запускаем таймер
        if agreed:
            await create_reminder(bot.id, new_lead.id, step_just_sent="node_start")

        return new_lead


async def update_lead_agreement(tg_bot_id: int, telegram_id: int, agreed: bool = True):
    """Обновляет статус согласия лида и запускает первый таймер воронки."""
    async with async_session() as session:
        bot = await session.scalar(
            select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id)
        )
        if not bot:
            return

        lead = await session.scalar(
            select(Lead).where(Lead.bot_id == bot.id, Lead.telegram_id == telegram_id)
        )

        if lead and not lead.agreed_to_tos and agreed:
            lead.agreed_to_tos = True
            await session.commit()
            logger.info(f"✅ Лид {telegram_id} подтвердил согласие с офертой.")
            
            # После согласия запускаем первый таймер
            await create_reminder(bot.id, lead.id, step_just_sent="node_start")


# ==============================
#      ОБРАБОТКА ПОКУПКИ
# ==============================


async def mark_lead_as_successful(tg_bot_id: int, telegram_id: int):
    """
    Вызывается вебхуком, когда прошла оплата!
    Переводит человека на шаг успеха и стирает все его предстоящие дожимы.
    """
    async with async_session() as session:
        bot = await session.scalar(
            select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id)
        )
        if not bot:
            return

        lead = await session.scalar(
            select(Lead).where(Lead.bot_id == bot.id, Lead.telegram_id == telegram_id)
        )

        if lead:
            lead.current_step_id = "node_success"
            lead.has_purchased = True

            await session.execute(
                delete(ScheduledTask).where(ScheduledTask.lead_id == lead.id)
            )

            await session.commit()
            logger.info(f"🎉 Лид {telegram_id} успешно оплатил! Дожимы отменены.")


# ==============================
#             TASK
# ==============================


async def create_reminder(
    bot_id: int,
    lead_id: int,
    step_just_sent: str,  # ⚡️ То, что мы ТОЛЬКО ЧТО отправили
):

    async with async_session() as session:
        lead = await session.scalar(
            select(Lead).options(selectinload(Lead.bot)).where(Lead.id == lead_id)
        )

        if not lead:
            return

        # ЗАЩИТА: Если человек уже купил, мы больше не ведем его по воронке дожимов!
        if lead.has_purchased or lead.current_step_id == "node_success":
            logger.info(
                f"Лид {lead_id} уже совершил покупку. Игнорируем логику таймеров."
            )
            return

        # 1. ОБНОВЛЯЕМ ЛИДА: записываем шаг, на котором он сейчас реально находится
        lead.current_step_id = step_just_sent
        logger.info(f"Обновил запись лида: теперь он на шаге {step_just_sent}")

        # 2. ИЩЕМ БУДУЩЕЕ: смотрим таймер у того шага, который только что ушел
        bot_funnel = FunnelSchema.model_validate(lead.bot.funnel_schema)
        step_now = bot_funnel.nodes.get(step_just_sent)

        # Если у текущего шага есть таймер на следующий (например, у node_dozhim_2 его НЕТ)
        if step_now and step_now.timer:
            step_to_send = step_now.timer.next_node_id

            # Защита от дублирования задач
            existing_task = await session.scalar(
                select(ScheduledTask).where(
                    ScheduledTask.bot_id == bot_id,
                    ScheduledTask.lead_id == lead_id,
                    ScheduledTask.step_to_send == step_to_send,
                )
            )

            if not existing_task:
                funnel_node = bot_funnel.nodes.get(step_to_send)
                reminder_after: int = step_now.timer.delay_seconds

                execute_at = datetime.now() + timedelta(seconds=reminder_after)

                task = ScheduledTask(
                    bot_id=bot_id,
                    lead_id=lead_id,
                    step_to_send=step_to_send,  # ⚡️ В таску пишем то, что ДОЛЖНО отправиться
                    raw_node_json=funnel_node.model_dump() if funnel_node else None,
                    execute_at=execute_at,
                )

                session.add(task)
                logger.info(f"Новая задача запланирована: {step_to_send}")

        # Сохраняем и лида, и новую задачу одним коммитом
        await session.commit()


async def get_reminder_tasks():
    async with async_session() as session:
        result = await session.scalars(
            select(ScheduledTask)
            .options(selectinload(ScheduledTask.lead).selectinload(Lead.bot))
            .where(ScheduledTask.execute_at <= datetime.now())
        )

        return result.all()


async def delete_list_tasks(task_ids: list):
    async with async_session() as session:
        await session.execute(
            delete(ScheduledTask).where(ScheduledTask.id.in_(task_ids))
        )
        logger.info(f"Удалил записи {task_ids}")
        await session.commit()


async def delete_task(task_id: int):
    async with async_session() as session:
        task = await session.get(ScheduledTask, task_id)

        if task:
            await session.delete(task)
            await session.commit()
