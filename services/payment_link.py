import json
import hmac
import hashlib
import uuid
import random
import httpx
from typing import Optional
from urllib.parse import urlencode, quote, quote_plus  # ⚡️ Добавили quote для RFC 3986
from database.models import BotConfig
from services.security import crypto
from loggers import logger

# Используем единый асинхронный клиент для оптимизации сетевых запросов
http_client = httpx.AsyncClient(timeout=10.0)


async def generate_payment_link(
    bot_config: BotConfig, amount: float, description: str, lead_telegram_id: int
) -> Optional[str]:
    """
    Универсальная функция генерации платежной ссылки.
    Определяет провайдера бота, расшифровывает ключи и возвращает готовую ссылку.
    """
    if not bot_config.payment_provider or not bot_config.payment_creds_enc:
        logger.warning(f"У бота {bot_config.id} не настроена платежная система!")
        return None

    try:
        # 1. Расшифровываем учетные данные платежки из БД
        creds_json = crypto.decrypt(bot_config.payment_creds_enc)
        creds = json.loads(creds_json)
    except Exception as e:
        logger.error(f"Ошибка расшифровки платежных ключей у бота {bot_config.id}: {e}")
        return None

    provider = bot_config.payment_provider.lower()

    if provider == "yookassa":
        return await _create_yookassa_link(creds, amount, description, lead_telegram_id)
    elif provider == "robokassa":
        return _create_robokassa_link(creds, amount, description, lead_telegram_id)
    elif provider == "prodamus":
        return _create_prodamus_link(creds, amount, description, lead_telegram_id)
    else:
        logger.warning(f"Неподдерживаемый платежный провайдер: {provider}")
        return None


# ==========================================
# 1. ИНТЕГРАЦИЯ ЮKASSA
# ==========================================
async def _create_yookassa_link(
    creds: dict, amount: float, description: str, telegram_id: int
) -> Optional[str]:
    """
    Генерирует счет в ЮKassa.
    Требует в creds: shop_id (ID магазина) и api_key (Секретный ключ)
    """
    shop_id = creds.get("shop_id")
    api_key = creds.get("api_key")

    if not shop_id or not api_key:
        logger.error("Для ЮKassa не переданы shop_id или api_key!")
        return None

    url = "https://api.yookassa.ru/v3/payments"
    headers = {"Idempotence-Key": str(uuid.uuid4()), "Content-Type": "application/json"}

    payload = {
        "amount": {"value": f"{amount:.2f}", "currency": "RUB"},
        "capture": True,
        "confirmation": {"type": "redirect", "return_url": "https://t.me/telegram"},
        "description": description,
        "metadata": {"telegram_id": str(telegram_id)},
        # ⚡️ ДОБАВЛЯЕМ ДАННЫЕ ДЛЯ ЧЕКА (ОБЯЗАТЕЛЬНО ПРИ 54-ФЗ)
        "receipt": {
            "customer": {
                # ЮКасса требует email или телефон. Генерируем технический email.
                "email": f"client_{telegram_id}@telegram-bot.ru"
            },
            "items": [
                {
                    "description": description,  # Название товара
                    "quantity": "1.00",
                    "amount": {"value": f"{amount:.2f}", "currency": "RUB"},
                    "vat_code": 1,  # 1 - Без НДС (подходит для ИП на УСН/Патенте и самозанятых)
                    "payment_mode": "full_prepayment",
                    "payment_subject": "service",
                }
            ],
        },
    }

    try:
        response = await http_client.post(
            url, json=payload, headers=headers, auth=(str(shop_id), str(api_key))
        )
        data = response.json()

        if response.status_code == 200:
            return data["confirmation"]["confirmation_url"]
        else:
            logger.error(f"Ошибка API ЮKassa: {data}")
            return None
    except Exception as e:
        logger.error(f"Сетевой сбой при обращении к ЮKassa: {e}")
        return None


# ==========================================
# 2. ИНТЕГРАЦИЯ РОБОКАССЫ
# ==========================================
def _create_robokassa_link(
    creds: dict, amount: float, description: str, telegram_id: int
) -> Optional[str]:
    """
    Генерирует платежную ссылку Робокассы.
    Автоматически добавляет IsTest=1 для тестового режима.
    """
    merchant_login = creds.get("merchant_login")
    password_1 = creds.get("password_1")

    # ⚡️ Извлекаем флаг тестового режима из конфига кассы (по умолчанию True для безопасности)
    is_test = creds.get("is_test", True)

    if not merchant_login or not password_1:
        logger.error("Для Робокассы не переданы merchant_login или password_1!")
        return None

    inv_id = int(uuid.uuid4().int >> 96)

    signature_str = f"{merchant_login}:{amount:.2f}:{inv_id}:{password_1}:shp_telegram_id={telegram_id}"
    signature = hashlib.md5(signature_str.encode("utf-8")).hexdigest()

    params = {
        "MerchantLogin": merchant_login,
        "OutSum": f"{amount:.2f}",
        "InvId": str(inv_id),
        "SignatureValue": signature,
        "Description": description,
        "shp_telegram_id": str(telegram_id),
    }

    # ⚡️ Если включен тестовый режим — добавляем IsTest=1 в параметры запроса
    if is_test:
        params["IsTest"] = "1"

    payment_url = f"https://auth.robokassa.ru/Merchant/Index.aspx?{urlencode(params)}"

    return payment_url


# ==========================================
# 3. ИНТЕГРАЦИЯ PRODAMUS
# ==========================================
def _create_prodamus_link(
    creds: dict, amount: float, description: str, telegram_id: int
) -> Optional[str]:
    """
    Генерирует ссылку на оплату в Prodamus через HMAC-SHA256 подпись.
    Специфическая сборка: кодируются только значения, ключи остаются сырыми (для [0]).
    """
    payment_page = creds.get("payment_page")
    api_key = creds.get("api_key")

    if not payment_page or not api_key:
        logger.error("Для Prodamus не переданы payment_page или api_key!")
        return None

    payment_page = payment_page.rstrip("/")

    # Защита от дублей номеров заказов в Продамусе
    order_id = f"{telegram_id}_{random.randint(100000, 999999)}"

    params = {
        "do": "pay",
        "order_id": order_id,
        "products[0][name]": description,
        "products[0][price]": f"{amount:.2f}",
        "products[0][quantity]": "1",
        "sum": f"{amount:.2f}",
    }

    # 1. Сортируем параметры по ключам (алфавитный порядок как в ksort PHP)
    sorted_keys = sorted(params.keys())

    # 2. Формируем query string вручную
    # Важно: ключи (например, со скобками) НЕ кодируются, кодируются только значения.
    # Это критично для некоторых реализаций HMAC в PHP-бэкендах.
    raw_params = []
    for key in sorted_keys:
        value = str(params[key])
        raw_params.append(f"{key}={quote_plus(value)}")

    query_string = "&".join(raw_params)

    # 3. Вычисляем HMAC-SHA256 подпись
    signature = hmac.new(
        key=api_key.encode("utf-8"),
        msg=query_string.encode("utf-8"),
        digestmod=hashlib.sha256,
    ).hexdigest()

    # 4. Собираем финальный URL
    final_url = f"{payment_page}/?{query_string}&signature={signature}"

    logger.info(f"Сгенерирована ссылка Prodamus для {telegram_id}: {order_id}")
    return final_url
