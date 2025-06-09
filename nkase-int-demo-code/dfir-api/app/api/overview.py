### backend/app/api/overview.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_overview():
    return {"alerts": 5, "threats": 2, "status": "Monitoring"}