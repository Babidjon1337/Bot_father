from sqlalchemy import select
from database.models import BotConfig, User, async_session

async def get_bot_by_id(id: int) -> BotConfig | None:
    """Запрашивает конфигурацию бота по его внутреннему ID."""
    async with async_session() as session:
        return await session.scalar(select(BotConfig).where(BotConfig.id == id))

async def get_bot_by_tg_id(tg_bot_id: int) -> BotConfig | None:
    """Запрашивает конфигурацию бота по его Telegram ID."""
    async with async_session() as session:
        return await session.scalar(select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id))

async def create_user_if_not_exists(telegram_id: int) -> User:
    """Создает пользователя, если его еще нет в базе."""
    async with async_session() as session:
        user = await session.scalar(select(User).where(User.telegram_id == telegram_id))
        if not user:
            user = User(telegram_id=telegram_id)
            session.add(user)
            await session.commit()
            await session.refresh(user)
        return user

async def register_bot_config(owner_id: int, tg_bot_id: int, bot_token_enc: bytes, payment_provider: str = None, payment_creds_enc: bytes = None) -> BotConfig:
    """Регистрирует нового бота в системе."""
    async with async_session() as session:
        bot = BotConfig(
            owner_id=owner_id,
            tg_bot_id=tg_bot_id,
            bot_token_enc=bot_token_enc,
            payment_provider=payment_provider,
            payment_creds_enc=payment_creds_enc
        )
        session.add(bot)
        await session.commit()
        await session.refresh(bot)
        return bot
