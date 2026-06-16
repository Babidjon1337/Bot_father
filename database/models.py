import os
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.ext.asyncio import AsyncAttrs, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID

from loggers import logger
from config import DATABASE_URL


class Base(AsyncAttrs, DeclarativeBase):
    pass


# ==========================================
# 1. ТАБЛИЦА USERS (Владельцы ботов / Клиенты SaaS)
# ==========================================
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)

    # Подписка на SaaS и юридическое согласие
    subscription_ends_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True)
    )
    agreed_to_tos_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Связи (Один-ко-Многим)
    bots: Mapped[list["BotConfig"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )


# ==========================================
# 2. ТАБЛИЦА BOTS (Клиентские боты)
# ==========================================
class BotConfig(Base):
    __tablename__ = "bots"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # Настройки Telegram бота Зашифрованный Fernet токен
    bot_token_enc: Mapped[bytes] = mapped_column(nullable=False)
    tg_bot_id: Mapped[int] = mapped_column(
        BigInteger, unique=True, index=True, nullable=False
    )
    username: Mapped[Optional[str]] = mapped_column(String(255))

    # Настройки платежной системы (например, ЮKassa)
    payment_provider: Mapped[Optional[str]] = mapped_column(String(50))
    payment_creds_enc: Mapped[Optional[bytes]] = (
        mapped_column()
    )  # Зашифрованный JSON с ключами

    # Схема воронки (наш Pydantic JSON)
    funnel_schema: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Связи
    owner: Mapped["User"] = relationship(back_populates="bots")
    leads: Mapped[list["Lead"]] = relationship(
        back_populates="bot", cascade="all, delete-orphan"
    )


# ==========================================
# 3. ТАБЛИЦА LEADS (Подписчики внутри воронок)
# ==========================================
class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    bot_id: Mapped[int] = mapped_column(ForeignKey("bots.id", ondelete="CASCADE"))
    telegram_id: Mapped[int] = mapped_column(BigInteger, index=True)

    # Состояние в воронке
    current_step_id: Mapped[str] = mapped_column(String(255), default="node_start")

    # Метрика для аналитики (вместо отдельной таблицы Payment)
    has_purchased: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Связи
    bot: Mapped["BotConfig"] = relationship(back_populates="leads")
    tasks: Mapped[list["ScheduledTask"]] = relationship(
        back_populates="lead", cascade="all, delete-orphan"
    )


# ==========================================
# 4. ТАБЛИЦА SCHEDULED_TASKS (Очередь дожимов)
# ==========================================
class ScheduledTask(Base):
    __tablename__ = "scheduled_tasks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    bot_id: Mapped[int] = mapped_column(ForeignKey("bots.id", ondelete="CASCADE"))
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))

    # ID шага (например, "node_dozhim_1")
    step_to_send: Mapped[str] = mapped_column(String(255), default="node_dozhim_1")

    # Хранилище для самого куска JSON (данные внутри "node_dozhim_1")
    raw_node_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Индекс для быстрого поиска наступивших задач
    execute_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)

    # Связи
    lead: Mapped["Lead"] = relationship(back_populates="tasks")


engine = create_async_engine(url=DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)


async def init_models():
    # Создаем таблицы в БД
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Подключение к БД успешно. Таблицы проверены!")


if __name__ == "__main__":
    import asyncio

    # Запускаем создание таблиц
    asyncio.run(init_models())
