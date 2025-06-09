from pydantic import BaseModel
from typing import List

class ActionRequest(BaseModel):
    account_id: str
    instance_ids: List[str]
    vpc_id: str
    nic_id: str
    quarantine_security_group: str

