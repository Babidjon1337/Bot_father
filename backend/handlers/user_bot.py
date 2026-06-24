from aiogram import Router, F
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
)
from aiogram.filters import CommandStart
from aiogram.exceptions import TelegramBadRequest

from config import MAIN_BOT_TG_ID
from database.requests import *
from keyboard.user_kb import *
from loggers import logger

# ⚡️ Подключаем наш сервис оплат
from services.payment_link import generate_payment_link

user_bot_router = Router()
user_bot_router.message.filter(F.bot.id != MAIN_BOT_TG_ID)


@user_bot_router.message(CommandStart())
async def start_command_handler(message: Message):
    tg_bot_id = message.bot.id
    lead_id = message.from_user.id

    bot_config = await get_bot_by_tg_id(tg_bot_id)
    funnel = await get_funnel_by_bot_id(tg_bot_id)

    # ⚡️ ПРОВЕРКА:
    if not funnel or not bot_config:
        logger.info(f"Воронка для бота {tg_bot_id} не найдена в БД!")
        return

    if bot_config.status == "archived":
        return
    
    if bot_config.status == "draft" and lead_id != bot_config.owner.telegram_id:
        await message.answer("🛠 Бот находится в режиме разработки.")
        return

    from database.requests.user_rq import get_lead

    lead = await get_lead(bot_config.id, lead_id)

    # Логика наличия ссылок
    offer_url = funnel.global_settings.legal_offer_url
    privacy_url = funnel.global_settings.legal_privacy_url
    has_any_url = bool(offer_url or privacy_url)

    # ПРОВЕРКА СОГЛАСИЯ:
    if (lead and lead.agreed_to_tos) or not has_any_url:
        # Если уже согласился ИЛИ ссылок нет совсем -> ведем сразу в воронку
        if not lead:
            await create_lead(tg_bot_id, lead_id, agreed=True)
            
            # Увеличиваем счетчик юзеров для активного бота
            if bot_config.status == "active" and lead_id != bot_config.owner.telegram_id:
                await increment_bot_users_count(bot_config.id)

        node_start = funnel.nodes.get("node_start")
        text_to_send = node_start.content.text
        button_text = (
            node_start.button.text if node_start.button else "💳 Оплатить доступ"
        )
        has_button = bool(node_start.button)

        await message.answer(
            text_to_send,
            reply_markup=user_payment_button(button_text) if has_button else None,
        )
    else:
        # Если новый или еще не согласился ПРИ НАЛИЧИИ ссылок
        if not lead:
            await create_lead(tg_bot_id, lead_id, agreed=False)
            
            # Увеличиваем счетчик юзеров для активного бота
            if bot_config.status == "active" and lead_id != bot_config.owner.telegram_id:
                await increment_bot_users_count(bot_config.id)

        # Строим сообщение: текст \n ссылки
        links = []
        if offer_url:
            links.append(f"<a href='{offer_url}'>публичной офертой</a>")
        if privacy_url:
            links.append(f"<a href='{privacy_url}'>политикой конфиденциальности</a>")

        agreement_text = funnel.global_settings.agreement_text
        if links:
            agreement_text += "\n\n" + "\n".join(links)

        await message.answer(
            agreement_text,
            reply_markup=user_agreement_keyboard(),
            disable_web_page_preview=True,
        )


@user_bot_router.callback_query(F.data == "agree_tos")
async def process_agreement(callback: CallbackQuery):
    try:
        await callback.answer("Принято!")
    except TelegramBadRequest:
        pass

    tg_bot_id = callback.bot.id
    lead_id = callback.from_user.id

    # 1. Записываем согласие в БД и запускаем первый таймер дожима
    await update_lead_agreement(tg_bot_id, lead_id)

    # 2. Переходим к первому шагу воронки (node_start)
    funnel = await get_funnel_by_bot_id(tg_bot_id)
    if not funnel:
        return

    node_start = funnel.nodes.get("node_start")
    text_to_send = node_start.content.text
    button_text = node_start.button.text if node_start.button else "💳 Оплатить доступ"
    has_button = bool(node_start.button)

    try:
        await callback.message.edit_text(
            text=text_to_send,
            reply_markup=user_payment_button(button_text) if has_button else None,
        )
    except TelegramBadRequest:
        # На случай если сообщение нельзя отредактировать
        await callback.message.answer(
            text=text_to_send,
            reply_markup=user_payment_button(button_text) if has_button else None,
        )


@user_bot_router.callback_query(F.data == "payment")
async def process_payment_button(callback: CallbackQuery):
    # 1. Безопасно отвечаем на колбэк (защита от повторных кликов и устаревших query)
    try:
        await callback.answer()
    except TelegramBadRequest as e:
        if "query is too old" in str(e):
            return  # Если клик уже устарел, просто выходим
        raise

    tg_bot_id = callback.bot.id
    lead_id = callback.from_user.id

    # ПРОВЕРКА: Если человек уже купил, мы не даем ему оплачивать снова
    bot_config = await get_bot_by_tg_id(tg_bot_id)
    if not bot_config:
        return

    from database.requests.user_rq import get_lead

    lead = await get_lead(bot_config.id, lead_id)

    if lead and (lead.has_purchased or lead.current_step_id == "node_success"):
        try:
            await callback.message.edit_reply_markup(reply_markup=None)
            await callback.message.answer(
                "Оплата по этому заказу уже получена. Спасибо!"
            )
        except TelegramBadRequest:
            pass
        return

    # 2. Убираем кнопку у ИСХОДНОГО сообщения (видео/текста)
    try:
        await callback.message.edit_reply_markup(reply_markup=None)
    except TelegramBadRequest as e:
        if "message is not modified" in str(e):
            logger.info("Кнопка уже была скрыта.")
            return  # Прерываем, значит юзер уже нажал кнопку ранее
        else:
            raise

    # 3. ПОЯВЛЯЕТСЯ НОВОЕ СООБЩЕНИЕ (Сохраняем его в переменную loading_message!)
    loading_message = await callback.message.answer(
        text="⏳ <b>Информационная система формирует счет на оплату...</b>\n<i>Пожалуйста, подождите несколько секунд.</i>"
    )

    # 4. ДОСТАЕМ КОНФИГ И ВОРОНКУ ДЛЯ ОПЛАТЫ И ГЕНЕРИРУЕМ ЖИВУЮ ССЫЛКУ
    tg_bot_id = callback.bot.id
    lead_id = callback.from_user.id

    bot_config = await get_bot_by_tg_id(tg_bot_id)
    funnel = await get_funnel_by_bot_id(tg_bot_id)

    node_checkout = funnel.nodes.get("node_checkout")
    message_text = node_checkout.content.text
    button_text = node_checkout.button.text

    payment_url = None
    if bot_config and funnel:
        payment_url = await generate_payment_link(
            bot_config=bot_config,
            amount=funnel.global_settings.payment_amount,
            description="Оплата доступа",
            lead_telegram_id=lead_id,
        )

    # Заглушка на случай, если клиент еще не настроил ключи или API кассы упало
    if not payment_url:
        payment_url = "https://yookassa.ru"
        logger.warning(
            f"Касса для бота {tg_bot_id} не настроена или недоступна, выдана ссылка-заглушка."
        )

    # 5. Формируем клавиатуру со свежей сгенерированной ссылкой для оплаты
    pay_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text=button_text, url=payment_url)]]
    )

    # 6. Редактируем ИМЕННО НОВОЕ СООБЩЕНИЕ, обращаясь к переменной loading_message
    try:
        await loading_message.edit_text(
            text=message_text,
            reply_markup=pay_keyboard,
        )
    except TelegramBadRequest as e:
        if "message is not modified" in str(e):
            pass
        else:
            raise
