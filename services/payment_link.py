import json
import hmac
import hashlib
import uuid
import random
import httpx
from typing import Any, Optional
from urllib.parse import urlencode, quote
from database.models import BotConfig
from services.security import crypto
from loggers import logger

# Используем единый асинхронный клиент
http_client = httpx.AsyncClient(timeout=10.0, follow_redirects=True)


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
        return await _create_prodamus_link(creds, amount, description, lead_telegram_id)
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
        "receipt": {
            "customer": {"email": f"client_{telegram_id}@telegram-bot.ru"},
            "items": [
                {
                    "description": description,
                    "quantity": "1.00",
                    "amount": {"value": f"{amount:.2f}", "currency": "RUB"},
                    "vat_code": 1,
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
    """
    merchant_login = creds.get("merchant_login")
    password_1 = creds.get("password_1")
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

    if is_test:
        params["IsTest"] = "1"

    payment_url = f"https://auth.robokassa.ru/Merchant/Index.aspx?{urlencode(params)}"

    return payment_url


# ==========================================
# 3. ИНТЕГРАЦИЯ PRODAMUS
# ==========================================


def _to_str_values(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: _to_str_values(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_to_str_values(v) for v in obj]
    if obj is None:
        return ""
    return str(obj)


def _sort_deep(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: _sort_deep(obj[k]) for k in sorted(obj.keys())}
    if isinstance(obj, list):
        return [_sort_deep(v) for v in obj]
    return obj


def _canonical_json_for_signature(data: dict) -> str:
    normalized = _sort_deep(_to_str_values(data))
    json_str = json.dumps(normalized, ensure_ascii=False, separators=(",", ":"))
    return json_str.replace("/", r"\/")


def _sign_prodamus_payload(data: dict, secret_key: str) -> str:
    canonical = _canonical_json_for_signature(data)
    return hmac.new(
        secret_key.encode("utf-8"),
        canonical.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def _flatten_query(prefix: str, value: Any):
    items = []
    if isinstance(value, dict):
        for k in sorted(value.keys()):
            items.extend(_flatten_query(f"{prefix}[{k}]", value[k]))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            items.extend(_flatten_query(f"{prefix}[{i}]", v))
    else:
        items.append((prefix, str(value)))
    return items


async def _create_prodamus_link(
    creds: dict, amount: float, description: str, telegram_id: int
) -> Optional[str]:
    """
    Генерирует короткую ссылку на оплату в Prodamus.
    Бот сам обращается к API (do=link) и вытягивает готовую короткую ссылку.
    """
    payment_page = creds.get("payment_page")
    api_key = creds.get("api_key")

    if not payment_page or not api_key:
        logger.error("Для Prodamus не переданы payment_page или api_key!")
        return None

    payment_page = payment_page.rstrip("/")

    # Защита от дублей номеров заказов
    order_id = f"{telegram_id}_{random.randint(100000, 999999)}"

    # 1. Формируем полезную нагрузку
    payload = {
        "do": "link",
        "order_id": order_id,
        "products": [
            {
                "name": description,
                "price": f"{amount:.2f}",
                "quantity": "1",
                "type": "service",
            }
        ],
        "customer_email": f"client_{telegram_id}@telegram.bot",
    }

    # 2. Подписываем (JSON канонизация)
    signature = _sign_prodamus_payload(payload, api_key)
    payload["signature"] = signature

    # 3. Сериализуем для запроса
    query_items = []
    for key in sorted(payload.keys()):
        value = payload[key]
        if isinstance(value, (dict, list)):
            query_items.extend(_flatten_query(key, value))
        else:
            query_items.append((key, value))

    query_string = urlencode(query_items, quote_via=quote, safe="[]")
    request_url = f"{payment_page}/?{query_string}"

    try:
        # 4. Бот сам идет по ссылке do=link, чтобы получить короткий URL
        response = await http_client.get(request_url)
        
        if response.status_code == 200:
            content = response.text.strip()
            # Продамус возвращает саму ссылку в теле ответа (иногда внутри HTML)
            if "http" in content:
                import re
                # Ищем любую ссылку payform.ru в ответе
                found_urls = re.findall(r'https?://[^\s<>"]+', content)
                for url in found_urls:
                    if "payform.ru" in url and "/?" not in url: # Ищем именно короткую
                        logger.info(f"Получена короткая ссылка Prodamus: {url}")
                        return url
                
                # Если регулярка не нашла специфичную, вернем первую попавшуюся
                return found_urls[0] if found_urls else None
            
            logger.error(f"Продамус не вернул ссылку в ответе: {content[:100]}")
            return None
        else:
            logger.error(f"Ошибка API Prodamus (код {response.status_code})")
            return None

    except Exception as e:
        logger.error(f"Сетевой сбой при получении ссылки Prodamus: {e}")
        return None
