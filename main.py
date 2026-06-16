from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse

from aiogram import Bot, Dispatcher
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.client.default import DefaultBotProperties
from aiogram.exceptions import TelegramAPIError, TelegramUnauthorizedError
from aiogram.utils.token import TokenValidationError
from aiogram.enums import ParseMode
from aiogram.types import Update

from contextlib import asynccontextmanager
import uvicorn


from handlers.main_bot import main_bot_router
from handlers.user_bot import user_bot_router
from database.requests import *
from database.models import init_models
from services.security import crypto
from services.scheduler import start_scheduler, stop_scheduler
from loggers import logger
from services.funnel_message import send_funnel_node_message
from config import (
    WEBHOOK_URL,
    WEBHOOK_PORT,
    MAIN_BOT_TOKEN,
    SECRET_KEY,
)

dp = Dispatcher()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Создаем объукт бота и диспечера
    if main_bot_router not in dp.sub_routers:
        dp.include_router(main_bot_router)
    if user_bot_router not in dp.sub_routers:
        dp.include_router(user_bot_router)

    # Инициализируем модели БД (создаем таблицы, если их нет)
    await init_models()

    # Запускаем наш вынесенный планировщик
    start_scheduler()

    session = AiohttpSession()
    main_bot = Bot(
        token=MAIN_BOT_TOKEN,
        session=session,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )

    # 2. Сохраняем их в состояние приложения, чтобы потом достать в обработчике
    app.state.session = session
    app.state.main_bot = main_bot

    await main_bot.set_webhook(
        url=f"{WEBHOOK_URL}/webhook/main",
        secret_token=SECRET_KEY,
        drop_pending_updates=True,
    )
    logger.info(f"Вебхук главного бота успешно установлен ✅")

    yield  # Сервер работает

    # Останавливаем при выключении сервера
    await stop_scheduler()

    # 3. При выключении достаем сессию и закрываем
    logger.info("Остановка приложения, закрытие сетевых сессий...")
    if app.state.session:
        await app.state.session.close()
    logger.info("Все соединения успешно закрыты.")


app = FastAPI(lifespan=lifespan, title="Telegram Bot Constructor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check():
    return {"status": "healthy"}


# =====================================================================
# ЭНДПОИНТ 1: Обработка вебхуков Главного Бота-Конструктора
# =====================================================================
@app.post("/webhook/main")
async def main_bot_webhook(request: Request):
    # Проверка секретного токена для безопасности
    if request.headers.get("X-Telegram-Bot-Api-Secret-Token") != SECRET_KEY:
        logger.warning("Попытка несанкционированного доступа к вебхуку главного бота")
        raise HTTPException(status_code=403, detail="Invalid secret token")

    update_data = await request.json()
    update = Update(**update_data)

    # Достаем бота из состояния приложения
    main_bot: Bot = request.app.state.main_bot

    await dp.feed_update(main_bot, update)
    return {"status": "ok"}


# =====================================================================
# ЭНДПОИНТ 2: Универсальный вебхук для всех клиентских ботов
# =====================================================================
@app.post("/webhook/bots/{bot_id}")
async def client_bots_webhook(bot_id: str, request: Request):
    # Проверка секретного токена для безопасности
    if request.headers.get("X-Telegram-Bot-Api-Secret-Token") != SECRET_KEY:
        logger.warning(
            f"Попытка несанкционированного доступа к вебхуку бота {bot_id}"
        )
        raise HTTPException(status_code=403, detail="Invalid secret token")

    # Получите токен бота по bot_id из вашей базы данных
    client_bot = await get_bot(int(bot_id))

    if not client_bot:
        logger.warning(
            f"Попытка обращения к несуществующему или удаленному bot_id: {bot_id}"
        )
        raise HTTPException(status_code=404, detail="Bot not found")

    # ТУТ БД ЗАПРОС
    real_token = crypto.decrypt(client_bot.bot_token_enc)

    try:
        http_sesion = request.app.state.session
        client_bot = Bot(
            token=real_token,
            session=http_sesion,
            default=DefaultBotProperties(parse_mode=ParseMode.HTML),
        )

        update_data = await request.json()
        update = Update(**update_data)

        await dp.feed_update(client_bot, update)
        return {"status": "ok"}

    except TelegramUnauthorizedError:
        # Специфическая ошибка: токен бота отозван (пользователь удалил бота в @BotFather)
        logger.error(
            f"Токен для bot_id {bot_id} недействителен (Unauthorized). Отключаем бота."
        )
        # Тут по-хорошему надо пойти в БД и поставить `is_active = False` для этого bot_id
        return JSONResponse(
            status_code=410, content={"detail": "Bot token expired or revoked"}
        )

    except Exception as e:
        # Все остальные непредвиденные ошибки (ошибки в коде хэндлеров, баги бэкенда)
        logger.exception(f"Глобальный сбой обработки вебхука для bot_id {bot_id}: {e}")
        return JSONResponse(
            status_code=500, content={"detail": "Internal Server Error"}
        )


@app.post("/create/bots/{bot_token}")
async def create_client_bot(bot_token: str, request: Request):
    try:

        shared_session = request.app.state.session
        temp_bot = Bot(token=bot_token, session=shared_session)

        await temp_bot.set_webhook(
            url=f"{WEBHOOK_URL}/webhook/bots/{1}",
            secret_token=SECRET_KEY,
            drop_pending_updates=True,
        )

        logger.info(f"Бот ID {1} успешно запущен, вебхук зарегистрирован.")
        return {
            "status": "ok",
            "message": "Бот успешно запущен и готов к работе!",
            "webhook_url": f"{WEBHOOK_URL}/webhook/bots/{1}",
        }
    except TokenValidationError as e:
        logger.error(f"Ошибка валидации токена при создании бота: {e}")
        return JSONResponse(status_code=400, content={"detail": str(e)})


# ⚡️ ЕДИНЫЙ УНИВЕРСАЛЬНЫЙ ВЕБХУК
# Ссылка, которую ты даешь клиенту, будет выглядеть так:
# Для ЮKassa:    https://api.tvoy-saas.ru/webhook/payments/yookassa/5
# Для Продамус:  https://api.tvoy-saas.ru/webhook/payments/prodamus/5
# Для Робокассы: https://api.tvoy-saas.ru/webhook/payments/robokassa/5


@app.post("/webhook/payments/{provider}/{tg_bot_id}")
async def universal_payment_webhook(provider: str, tg_bot_id: int, request: Request):
    provider = provider.lower()
    telegram_id = None
    inv_id = None

    try:
        # ==========================================
        # 1. ПАРСИНГ ТЕЛЕГРАМ ID
        # ==========================================
        if provider == "prodamus":
            data = await request.form()
            if data.get("payment_status") == "success":
                order_id_raw = data.get("order_id", "0")
                telegram_id = int(str(order_id_raw).split("_")[0])

        elif provider == "yookassa":
            data = await request.json()
            if data.get("event") == "payment.succeeded":
                telegram_id = int(
                    data.get("object", {}).get("metadata", {}).get("telegram_id", 0)
                )

        elif provider == "robokassa":
            data = await request.form()
            telegram_id = int(data.get("shp_telegram_id", 0))
            inv_id = data.get("InvId")

        else:
            raise HTTPException(
                status_code=404, detail="Неизвестный платежный провайдер"
            )

        # ==========================================
        # 2. БИЗНЕС-ЛОГИКА (ВЫДАЧА ДОСТУПА)
        # ==========================================
        if telegram_id and telegram_id > 0:
            logger.info(
                f"💰 Успешная оплата [{provider.upper()}] для бота {tg_bot_id}! Юзер: {telegram_id}"
            )

            # Меняем статус в БД и удаляем дожимы (используем именно tg_bot_id!)
            await mark_lead_as_successful(tg_bot_id=tg_bot_id, telegram_id=telegram_id)

            # Отправляем сообщение успеха напрямую из вебхука,
            # передавая глобальную aiohttp-сессию! ⚡️
            await send_success_message(
                tg_bot_id=tg_bot_id,
                telegram_id=telegram_id,
                http_session=request.app.state.session,
            )

            # ==========================================
            # 3. СПЕЦИФИЧНЫЕ ОТВЕТЫ ДЛЯ КАСС
            # ==========================================
            if provider == "prodamus":
                return PlainTextResponse("OK")
            elif provider == "robokassa":
                return PlainTextResponse(f"OK{inv_id}")
            elif provider == "yookassa":
                return JSONResponse({"status": "ok"})

        # Возвращаем OK для любых других тестовых запросов кассы,
        # чтобы они не долбили нас повторными попытками
        return PlainTextResponse("OK")

    except Exception as e:
        logger.error(f"Ошибка обработки вебхука {provider} для бота {tg_bot_id}: {e}")
        raise HTTPException(
            status_code=500, detail="Внутренняя ошибка обработки вебхука"
        )


async def send_success_message(
    tg_bot_id: int, telegram_id: int, http_session: AiohttpSession
):
    """
    Вспомогательная функция: достает настройки бота и отправляет node_success
    """
    async with async_session() as session:
        bot_config = await session.scalar(
            select(BotConfig).where(BotConfig.tg_bot_id == tg_bot_id)
        )

    if not bot_config or not bot_config.funnel_schema:
        return

    try:
        token = crypto.decrypt(bot_config.bot_token_enc)
        funnel = FunnelSchema.model_validate(bot_config.funnel_schema)
        node_success = funnel.nodes.get("node_success")

        if node_success:
            # ⚡️ Передаем общую сессию из аргументов!
            bot = Bot(
                token=token,
                session=http_session,
                default=DefaultBotProperties(parse_mode=ParseMode.HTML),
            )

            # Отправляем сообщение
            await send_funnel_node_message(
                bot=bot, chat_id=telegram_id, node=node_success
            )

            # ВАЖНО: Мы больше НЕ вызываем await bot.session.close(),
            # потому что это убьет общую сессию нашего приложения!
            logger.info(f"✅ Сообщение с доступом отправлено лиду {telegram_id}")

    except Exception as e:
        logger.error(
            f"Не удалось отправить сообщение об успехе лиду {telegram_id}: {e}"
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=WEBHOOK_PORT, reload=True)
