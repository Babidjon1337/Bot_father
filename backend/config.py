from dotenv import load_dotenv
import os
from pathlib import Path

# Указываем путь к .env в корне проекта (на уровень выше папки backend)
root_dir = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=root_dir / ".env")

MAIN_BOT_TOKEN = os.getenv("MAIN_BOT_TOKEN")

# Защита: если нет ID, ставим 0, чтобы int() не падал
MAIN_BOT_TG_ID = int(os.getenv("MAIN_BOT_TG_ID", 0))

WEBHOOK_URL = os.getenv("WEBHOOK_URL")
WEBHOOK_PORT = int(os.getenv("WEBHOOK_PORT", 8000))
PROXY_URL = os.getenv("PROXY_URL")

# Ссылка на Mini App Dashboard
WEBAPP_URL = os.getenv("WEBAPP_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

# Явно берем данные для БД
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Ro22874009")
POSTGRES_DB = os.getenv("POSTGRES_DB", "postgres")

DB_HOST = "localhost"
DB_PORT = 5432

DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}:{DB_PORT}/{POSTGRES_DB}"
