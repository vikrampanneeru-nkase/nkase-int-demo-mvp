from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_investigations():
    return [{"id": 1, "name": "Network Intrusion"}, {"id": 2, "name": "Forensic Analysis"}]

















