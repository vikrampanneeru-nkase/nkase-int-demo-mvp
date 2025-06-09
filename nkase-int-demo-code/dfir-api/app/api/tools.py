### backend/app/api/tools.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_tools():
    return [{"id": 1, "tool": "Port Scanner"}]