### backend/app/api/standards.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_standards():
    return [{"id": 1, "standard": "CIS Benchmark"}]