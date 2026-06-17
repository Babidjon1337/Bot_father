from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
import os

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
    # URL должен вести на задеплоенный React (например, Vercel) или ngrok для локальных тестов
    webapp_url = os.getenv("WEBAPP_URL", "https://novaflow.app/dashboard")
    
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    web_app=WebAppInfo(url=webapp_url),
                )
            ]
        ]
    )
