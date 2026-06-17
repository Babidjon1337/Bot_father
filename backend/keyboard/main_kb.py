from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from config import WEBAPP_URL

def main_video_learning_button(text: str = "🎬 Смотреть видео-обучение"):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    callback_data="main_video_learning",
                )
            ]
        ]
    )


def main_create_bot_button(text: str = "🚀 Открыть конструктор"):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    web_app=WebAppInfo(url=WEBAPP_URL),
                )
            ]
        ]
    )
