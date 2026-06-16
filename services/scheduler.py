from apscheduler.schedulers.asyncio import AsyncIOScheduler
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram import Bot
from aiogram.exceptions import (
    TelegramForbiddenError,
    TelegramBadRequest,
    TelegramRetryAfter,
    TelegramAPIError,
)  # Импортируем типы ошибок от Telegram
import asyncio

from schemas.funnel import FunnelSchema, NodeConfig
from database.requests import *
from services.security import crypto
from loggers import logger
from keyboard.user_kb import *
from services.funnel_message import send_funnel_node_message

scheduler = AsyncIOScheduler()
shared_scheduler_session = AiohttpSession()


async def check_reminders_job():
    tasks = await get_reminder_tasks()
    if not tasks:
        return

    tasks_by_bot = {}
    for task in tasks:
        if task.bot_id not in tasks_by_bot:
            tasks_by_bot[task.bot_id] = []
        tasks_by_bot[task.bot_id].append(task)

    coroutines = [
        send_bot_reminders(bot_id, bot_tasks)
        for bot_id, bot_tasks in tasks_by_bot.items()
    ]
    grouped_results = await asyncio.gather(*coroutines)

    # ⚡️ ПРАВИЛЬНЫЙ парсинг вложенных списков
    task_ids_to_delete = []
    for bot_results in grouped_results:  # Перебираем списки ботов
        for result_dict in bot_results:  # Перебираем словари результатов
            for task_id, status in result_dict.items():
                if status != "keep_for_retry":
                    task_ids_to_delete.append(task_id)

    # Удаляем задачи пачкой, только если список не пустой
    if task_ids_to_delete:
        await delete_list_tasks(task_ids_to_delete)


async def send_bot_reminders(bot_id: int, tasks: list[ScheduledTask]) -> list[dict]:
    results = []
    bot_config = tasks[0].lead.bot

    token = crypto.decrypt(bot_config.bot_token_enc)
    bot = Bot(
        token=token,
        session=shared_scheduler_session,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )

    for task in tasks:
        step_id = task.step_to_send

        try:
            if task.raw_node_json:
                node = NodeConfig.model_validate(task.raw_node_json)
            else:
                funnel = FunnelSchema.model_validate(bot_config.funnel_schema)
                node = funnel.nodes.get(step_id)

            if node:
                # 1. Физически отправляем сообщение
                await send_funnel_node_message(bot, task.lead.telegram_id, node)

                # 2. ⚡️ Вызываем функцию ВСЕГДА! Она сама обновит статус лида,
                # а затем сама проверит, есть ли таймер дальше.
                await create_reminder(
                    bot_id=bot_id, lead_id=task.lead.id, step_just_sent=step_id
                )

                results.append({task.id: "success"})
            else:
                # Если узел почему-то исчез из воронки - это баг, удаляем таску чтобы не висела вечно
                results.append({task.id: "delete"})

        # --- Обработка ошибок Telegram ---
        except TelegramForbiddenError:
            logger.info(
                f"🚫 Бот {bot_id} заблокирован пользователем {task.lead.telegram_id}. Удаляем задачу."
            )
            results.append({task.id: "delete"})

        except TelegramBadRequest as e:
            logger.warning(
                f"⚠️ Кривая ошибка запроса (чат удален или битый медиафайл): {e}"
            )
            results.append({task.id: "delete"})

        except (TelegramRetryAfter, TelegramAPIError) as e:
            logger.warning(
                f"⏳ Временный сбой/флуд-лимит у бота {bot_id}. Попробуем позже. Ошибка: {e}"
            )
            results.append({task.id: "keep_for_retry"})

        except Exception as e:
            logger.error(f"❌ Непредвиденная ошибка у бота {bot_id}: {e}")
            # Непонятный сбой - НЕ удаляем, пусть крутится на следующем цикле
            results.append({task.id: "keep_for_retry"})

        finally:
            await asyncio.sleep(0.05)

    return results


def start_scheduler():
    """Функция для запуска планировщика из main.py"""
    scheduler.add_job(
        check_reminders_job,
        trigger="interval",
        seconds=60,
        max_instances=1,
        coalesce=True,
    )  # Запускать каждые 30 секунд

    scheduler.start()
    logger.info("⏳ Планировщик успешно запущен и следит за дожимами!")


async def stop_scheduler():
    """Функция для корректной остановки"""
    scheduler.shutdown()
    await shared_scheduler_session.close()  # Обязательно закрываем соединения!
    logger.info("🛑 APScheduler и его сессия успешно остановлены.")
