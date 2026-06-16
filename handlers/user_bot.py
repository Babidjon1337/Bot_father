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
    funnel = await get_funnel_by_bot_id(tg_bot_id)

    # ⚡️ ПРОВЕРКА:
    if not funnel:
        logger.info(f"Воронка для бота {tg_bot_id} не найдена в БД!")
        return

    node_start = funnel.nodes.get("node_start")
    text_to_send = node_start.content.text

    # Берем текст из базы, либо ставим дефолтный
    button_text = "💳 Оплатить доступ"
    has_button = False
    if node_start.button:
        button_text = node_start.button.text
        has_button = True

    await create_lead(tg_bot_id, lead_id)

    await message.answer(
        text_to_send,
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
