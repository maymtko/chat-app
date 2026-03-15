from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    FIREBASE_CREDENTIALS: str
    FIREBASE_API_KEY: str
    APP_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()  # type: ignore[call-arg]
