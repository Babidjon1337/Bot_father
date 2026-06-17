from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup


def user_payment_button(text: str = "💳 Оплатить доступ"):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    callback_data="payment",
                )
            ]
        ]
    )


def user_agreement_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Я согласен с офертой",
                    callback_data="agree_tos",
                )
            ]
        ]
    )
