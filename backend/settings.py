from pydantic_settings import BaseSettings
from typing import Union, Dict, Any

class Settings(BaseSettings):
    FIREBASE_CREDENTIALS: Union[str, Dict[str, Any]]
    FIREBASE_API_KEY: str
    APP_SECRET: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()  # type: ignore[call-arg]
