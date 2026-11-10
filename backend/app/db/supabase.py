
from supabase import Client, create_client

from app.core.config import settings

_supabase_client: Client | None = None


def get_supabase_client() -> Client | None:
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
        except Exception:  # noqa: BLE001
            _supabase_client = None

    return _supabase_client


# Module-level singleton instance (evaluated if credentials are present at import)
supabase: Client | None = get_supabase_client()

