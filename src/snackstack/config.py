from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str | None = Field(
        default=None,
        validation_alias=AliasChoices("OPENAI_API_KEY", "SNACKSTACK_OPENAI_API_KEY"),
    )
    model: str = "gpt-5.6-luna"
    embedding_model: str = "text-embedding-3-small"
    langsmith_tracing: bool = False
    langsmith_project: str = "snackstack-lab"

    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env"),
        env_prefix="SNACKSTACK_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
