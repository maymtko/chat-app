from typing import Any

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    FIREBASE_CREDENTIALS: str | dict[str, Any]
    FIREBASE_API_KEY: str
    APP_SECRET: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()  # type: ignore[call-arg]
