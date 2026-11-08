import json
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory for backend project
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(BASE_DIR / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "EasyCode Backend"
    PORT: int = 8888
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    GEMINI_API_KEYS: Union[List[str], str] = []

    @field_validator("GEMINI_API_KEYS", mode="after")
    @classmethod
    def parse_gemini_api_keys(cls, v: Union[List[str], str]) -> List[str]:
        """
        Parses a comma-separated string of Gemini API keys into a list of strings.
        Supports key rotation and fallback strategies when facing HTTP 429 rate limits.
        """
        if isinstance(v, str):
            trimmed = v.strip()
            if not trimmed:
                return []
            if trimmed.startswith("[") and trimmed.endswith("]"):
                try:
                    parsed = json.loads(trimmed)
                    if isinstance(parsed, list):
                        return [str(k).strip() for k in parsed if str(k).strip()]
                except Exception:
                    pass
            return [key.strip() for key in trimmed.split(",") if key.strip()]
        if isinstance(v, list):
            return [str(key).strip() for key in v if str(key).strip()]
        return []


settings = Settings()
