from cryptography.fernet import Fernet

from config import ENCRYPTION_KEY


class CryptoManager:
    def __init__(self):
        # Инициализация Fernet с ключом из конфигурации
        self.fernet = Fernet(ENCRYPTION_KEY.encode())

    def encrypt(self, data: str) -> str:
        """Шифрует строку токена для безопасного хранения в базе данных"""
        if not data:
            return ""
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt(self, data: bytes | str) -> str:
        """Расшифровывает строку из базы данных в рабочий токен"""
        if not data:
            return ""

        if isinstance(data, str):
            data = data.encode()

        return self.fernet.decrypt(data).decode()


crypto = CryptoManager()
