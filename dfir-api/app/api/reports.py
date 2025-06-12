### backend/app/api/reports.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_reports():
    return [{"id": 1, "title": "Weekly Security Report"}]