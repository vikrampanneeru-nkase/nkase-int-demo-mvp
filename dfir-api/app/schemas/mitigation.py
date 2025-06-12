from typing import List
from pydantic import BaseModel

class MitigationResponse(BaseModel):
    job_ids: str
    message: str
