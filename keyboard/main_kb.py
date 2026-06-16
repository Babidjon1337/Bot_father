from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup


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


def main_create_bot_button(text: str = "🚀 Создать бота"):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    callback_data="main_create_bot",
                )
            ]
        ]
    )
