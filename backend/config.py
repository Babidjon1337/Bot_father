from dotenv import load_dotenv
import os

load_dotenv()

MAIN_BOT_TOKEN = os.getenv("MAIN_BOT_TOKEN")

# Защита: если нет ID, ставим 0, чтобы int() не падал
MAIN_BOT_TG_ID = int(os.getenv("MAIN_BOT_TG_ID", 0))

WEBHOOK_URL = os.getenv("WEBHOOK_URL")
WEBHOOK_PORT = int(os.getenv("WEBHOOK_PORT", 8000))
PROXY_URL = os.getenv("PROXY_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

# Явно берем данные для БД
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Ro22874009")
POSTGRES_DB = os.getenv("POSTGRES_DB", "postgres")

DB_HOST = "localhost"
DB_PORT = 5432

DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}:{DB_PORT}/{POSTGRES_DB}"
