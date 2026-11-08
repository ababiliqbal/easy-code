from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Returns the singleton Supabase client instance.
    Initializes the client using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY if configured.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
        try:
            _supabase_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY,
            )
        except Exception:
            _supabase_client = None

    return _supabase_client


# Module-level singleton instance (evaluated if credentials are present at import)
supabase: Optional[Client] = get_supabase_client()

