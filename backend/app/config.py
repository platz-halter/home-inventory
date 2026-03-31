from pydantic_settings import BaseSettings
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
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
        # Pydantic loads these left to right — later files override earlier ones
        "env_file": (str(ENV_FILE), str(ENV_LOCAL_FILE)),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
