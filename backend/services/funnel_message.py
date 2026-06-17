from aiogram import Bot
from schemas.funnel import NodeConfig

from keyboard.user_kb import *
from loggers import logger


async def send_funnel_node_message(bot: Bot, chat_id: int, node: NodeConfig) -> None:
    media = node.content.media
    text = node.content.text

    # Безопасная проверка наличия кнопки
    reply_markup = None
    if node.button:
        reply_markup = user_payment_button(node.button.text)

    try:
        # Отправка медиа или просто текста
        if media.type == "video" and media.file_id:
            await bot.send_video(
                chat_id=chat_id,
                video=media.file_id,
                caption=text,
                reply_markup=reply_markup,
            )
        elif media.type == "photo" and media.file_id:
            await bot.send_photo(
                chat_id=chat_id,
                photo=media.file_id,
                caption=text,
                reply_markup=reply_markup,
            )
        else:
            await bot.send_message(
                chat_id=chat_id,
                text=text,
                reply_markup=reply_markup,
            )
    except Exception as e:
        logger.warning(f"Ошибка отправки сообщения пользователю {chat_id}: {e}")
        # ⚡️ КРИТИЧЕСКИЙ ФИКС: Пробрасываем ошибку наверх, чтобы scheduler.py о ней узнал!
        raise e
