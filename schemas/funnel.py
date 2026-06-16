from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Literal


class MediaConfig(BaseModel):
    type: Literal["video", "photo"] | None
    file_id: Optional[str] = None


class ContentConfig(BaseModel):
    media: MediaConfig
    text: str = ""


class ButtonConfig(BaseModel):
    type: Literal["payment", "url", "next_step"]
    text: str
    url: Optional[str] = None
    next_node_id: Optional[str] = None


class TimerConfig(BaseModel):
    delay_seconds: int
    next_node_id: str


class NodeConfig(BaseModel):
    type: str = "message"  # Теперь может быть "message" или "checkout"

    # ⚡️ Текст, который показывается 1-2 секунды, пока грузится API (ЮKassa и т.д.)
    loading_text: Optional[str] = None

    content: ContentConfig
    button: Optional[ButtonConfig] = None
    timer: Optional[TimerConfig] = None


class GlobalSettings(BaseModel):
    legal_offer_url: str
    legal_privacy_url: str
    payment_amount: float


class FunnelSchema(BaseModel):
    global_settings: GlobalSettings
    nodes: Dict[str, NodeConfig]
