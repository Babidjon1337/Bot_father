from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse

from aiogram import Bot, Dispatcher
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.client.default import DefaultBotProperties
from aiogram.exceptions import TelegramUnauthorizedError
from aiogram.types import Update

from contextlib import asynccontextmanager
import uvicorn

from handlers.main_bot import main_bot_router
from handlers.user_bot import user_bot_router
from database.requests import *
from database.models import init_models
from services.security import crypto
from services.scheduler import start_scheduler, stop_scheduler
from services.payment_link import send_success_message  # Перенесли логику в сервис
from loggers import logger
from config import (
    WEBHOOK_URL,
    WEBHOOK_PORT,
    MAIN_BOT_TOKEN,
    SECRET_KEY,
)
from schemas.main_schemas import HealthCheckResponse, BotCreateResponse

dp = Dispatcher()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Регистрация роутеров
    if main_bot_router not in dp.sub_routers:
        dp.include_router(main_bot_router)
    if user_bot_router not in dp.sub_routers:
        dp.include_router(user_bot_router)

    await init_models()
    start_scheduler()

    session = AiohttpSession()
    main_bot = Bot(
        token=MAIN_BOT_TOKEN,
        session=session,
        default=DefaultBotProperties(parse_mode="HTML"),
    )

    app.state.session = session
    app.state.main_bot = main_bot

    await main_bot.set_webhook(
        url=f"{WEBHOOK_URL}/webhook/main",
        secret_token=SECRET_KEY,
        drop_pending_updates=True,
    )
    logger.info("Вебхук главного бота успешно установлен ✅")

    yield

    await stop_scheduler()
    if app.state.session:
        await app.state.session.close()
    logger.info("Все соединения успешно закрыты.")


app = FastAPI(lifespan=lifespan, title="Telegram Bot Constructor Backend")

# ВНИМАНИЕ: Ограничьте origins в продакшене!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthCheckResponse)
async def health_check():
    return {"status": "healthy"}


# =====================================================================
# ЭНДПОИНТ 1: Обработка вебхуков Главного Бота
# =====================================================================
@app.post("/webhook/main")
async def main_bot_webhook(request: Request):
    if request.headers.get("X-Telegram-Bot-Api-Secret-Token") != SECRET_KEY:
        logger.warning("Попытка несанкционированного доступа к вебхуку главного бота")
        raise HTTPException(status_code=403, detail="Invalid secret token")

    update_data = await request.json()
    update = Update(**update_data)
    await dp.feed_update(request.app.state.main_bot, update)
    return {"status": "ok"}


# =====================================================================
# ЭНДПОИНТ 2: Универсальный вебхук для клиентских ботов
# =====================================================================
@app.post("/webhook/bots/{bot_db_id}")
async def client_bots_webhook(bot_db_id: int, request: Request):
    if request.headers.get("X-Telegram-Bot-Api-Secret-Token") != SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid secret token")

    bot_config = await get_bot_by_id(bot_db_id)
    if not bot_config:
        raise HTTPException(status_code=404, detail="Bot not found")

    try:
        token = crypto.decrypt(bot_config.bot_token_enc)
        async with Bot(
            token=token,
            session=request.app.state.session,
            default=DefaultBotProperties(parse_mode="HTML"),
        ) as bot:
            update_data = await request.json()
            update = Update(**update_data)
            await dp.feed_update(bot, update)
        return {"status": "ok"}

    except TelegramUnauthorizedError:
        logger.error(f"Токен для бота {bot_db_id} недействителен. Отключаем.")
        return JSONResponse(status_code=410, content={"detail": "Token revoked"})
    except Exception as e:
        logger.exception(f"Ошибка вебхука бота {bot_db_id}: {e}")
        return JSONResponse(status_code=500, content={"detail": "Error"})


@app.post("/test/set_webhook/{bot_token}")
async def test_set_webhook(bot_token: str, request: Request):
    """
    Позволяет быстро перепривязать любого бота к текущему WEBHOOK_URL.
    Нужно, так как ngrok меняет ссылки после перезапуска.
    """
    try:
        temp_bot = Bot(
            token=bot_token,
            session=request.app.state.session,
            default=DefaultBotProperties(parse_mode="HTML"),
        )

        # Для теста привязываем к bot_id = 1
        target_url = f"{WEBHOOK_URL}/webhook/bots/1"

        await temp_bot.set_webhook(
            url=target_url, secret_token=SECRET_KEY, drop_pending_updates=True
        )

        logger.info(
            f"Тестовая перепривязка вебхука для токена ...{bot_token[-5:]} выполнена."
        )
        return {"status": "ok", "message": "Webhook updated!", "new_url": target_url}
    except Exception as e:
        logger.error(f"Ошибка в тестовом эндпоинте set_webhook: {e}")
        return JSONResponse(status_code=400, content={"detail": str(e)})


# =====================================================================
# ЭНДПОИНТ 3: Универсальный вебхук оплат
# =====================================================================
@app.post("/webhook/payments/{provider}/{tg_bot_id}")
async def universal_payment_webhook(provider: str, tg_bot_id: int, request: Request):
    provider = provider.lower()
    telegram_id = None
    inv_id = None

    try:
        # Парсинг данных в зависимости от кассы
        if provider == "prodamus":
            data = await request.form()
            print(data)
            if data.get("payment_status") == "success":
                order_id_raw = data.get("order_num", "0")
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

        if telegram_id and telegram_id > 0:
            logger.info(
                f"💰 Оплата [{provider.upper()}] для бота {tg_bot_id}, юзер {telegram_id}"
            )

            # Обновляем статус в БД (все запросы через user_rq)
            await mark_lead_as_successful(tg_bot_id=tg_bot_id, telegram_id=telegram_id)

            # Отправляем сообщение об успехе через сервис
            await send_success_message(
                tg_bot_id=tg_bot_id,
                telegram_id=telegram_id,
                http_session=request.app.state.session,
            )

            # Ответы для касс
            if provider == "prodamus":
                return PlainTextResponse("OK")
            if provider == "robokassa":
                return PlainTextResponse(f"OK{inv_id}")
            return JSONResponse({"status": "ok"})

        return PlainTextResponse("OK")

    except Exception as e:
        logger.error(f"Ошибка вебхука {provider}: {e}")
        raise HTTPException(status_code=500)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=WEBHOOK_PORT, reload=True)
