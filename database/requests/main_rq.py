from sqlalchemy import select, update, delete
from database.models import User, BotConfig, async_session


async def get_bot(id: int) -> BotConfig | None:
    """
    Безопасно запрашивает пользователя по его ID.
    Возвращает объект User или None, если пользователь не найден.
    """
    async with async_session() as session:
        # Используем современный ORM-синтаксис select(User)
        result = await session.scalar(select(BotConfig).where(BotConfig.id == id))

        # .scalars() преобразует результат в последовательность объектов User,
        # а .first() или .one_or_none() безопасно извлекает объект
        return result


async def create_user(bot_token_enc: str, bot_id: int) -> User:
    async with async_session() as session:
        new_user = User(bot_token_enc=bot_token_enc, bot_id=bot_id)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user
