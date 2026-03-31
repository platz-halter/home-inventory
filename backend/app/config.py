from pydantic_settings import BaseSettings
from pathlib import Path

# __file__ = /home/simson/Projects/home-inventory/backend/app/config.py
# .parent   = backend/app
# .parent   = backend
# .parent   = home-inventory  ← project root
ROOT = Path(__file__).resolve().parent.parent.parent

ENV_FILE = ROOT / ".env"
ENV_LOCAL_FILE = ROOT / ".env.local"


class Settings(BaseSettings):
    db_user: str
    db_password: str
    db_name: str
    db_host: str = "localhost"
    db_port: int = 5432
    secret_key: str = ""
    vite_api_url: str = ""

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    model_config = {
        "env_file": (str(ENV_FILE), str(ENV_LOCAL_FILE)),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
