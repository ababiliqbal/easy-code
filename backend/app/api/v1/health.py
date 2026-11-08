from fastapi import APIRouter
from app.core.config import settings
from app.db.supabase import get_supabase_client

router = APIRouter()


@router.get("/health", summary="Health Check")
def health_check():
    """
    Returns application status, active port, Supabase configuration status,
    and the count of detected Gemini API keys.
    """
    supabase_client = get_supabase_client()
    supabase_configured = bool(
        settings.SUPABASE_URL
        and settings.SUPABASE_SERVICE_ROLE_KEY
        and supabase_client is not None
    )

    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "port": settings.PORT,
        "supabase_configured": supabase_configured,
        "gemini_keys_count": len(settings.GEMINI_API_KEYS),
    }

