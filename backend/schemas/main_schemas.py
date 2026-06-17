from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

# ==========================================
# 1. СХЕМЫ ДЛЯ СОЗДАНИЯ БОТОВ
# ==========================================

class BotCreateRequest(BaseModel):
    bot_token: str = Field(..., description="Токен от @BotFather")
    payment_provider: Optional[str] = Field(None, description="yookassa, prodamus, robokassa")
    payment_creds: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Ключи платежки")

class BotCreateResponse(BaseModel):
    status: str = "ok"
    message: str
    webhook_url: str
    tg_bot_id: int

# ==========================================
# 2. СХЕМЫ ДЛЯ ВЕБХУКОВ ОПЛАТ
# ==========================================

class PaymentWebhookResponse(BaseModel):
    status: str = "ok"

# Мы не делаем жесткую схему для входящих данных от касс, 
# так как они все шлют разное, но можем сделать базовую
class ProdamusWebhookData(BaseModel):
    payment_status: str
    order_id: str
    sum: float
    # ... остальные поля можно добавить по нужде

# ==========================================
# 3. СХЕМЫ ОБЩИХ ОТВЕТОВ
# ==========================================

class HealthCheckResponse(BaseModel):
    status: str = "healthy"
