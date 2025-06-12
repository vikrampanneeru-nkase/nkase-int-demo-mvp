### backend/app/api/settings.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_settings():
    return {"theme": "dark", "notifications": True}