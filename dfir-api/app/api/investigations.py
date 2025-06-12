from fastapi import APIRouter, Depends, HTTPException,BackgroundTasks
from pydantic import BaseModel
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
from arq.connections import create_pool
import json
from app.services.ec2_ops import (
    list_dynamodb_tables,
    list_s3_buckets,
    list_instances,
    quarantine_instance,
    un_quarantine_instance
)

from app.db.database import get_db
from app.workers.mitigation_worker import mitigation_worker
from app.schemas.mitigation import MitigationResponse
from fastapi import APIRouter, BackgroundTasks
import uuid
STATUS_KEY_PREFIX = "snapshot_status:"
router = APIRouter()


# ----------- Models -----------

class ActionRequest(BaseModel):
    instance_ids: List[str]

# ----------- Endpoints -----------

@router.get("")
async def get_investigations(db: AsyncSession = Depends(get_db)):
    return await list_instances(db)

@router.get("/new")
async def get_new_investigations(db: AsyncSession = Depends(get_db)):
    return await list_instances(db)

@router.get("/s3")
async def get_s3_buckets():
    return await list_s3_buckets()

@router.get("/dynamodb")
async def get_dynamodb():
    return await list_dynamodb_tables()

@router.post("/Quarantine")
async def quarantine_instances(req: ActionRequest, db: AsyncSession = Depends(get_db)):
    return await quarantine_instance(req.instance_ids, db)

@router.post("/Un-Quarantine")
async def unquarantine_instances(req: ActionRequest, db: AsyncSession = Depends(get_db)):
    return await un_quarantine_instance(req.instance_ids, db)



@router.post("/Mitigate")
async def start_mitigation(request: ActionRequest):
    instance_id_str = request.instance_ids[0]
    job_id = str(uuid.uuid4())
    redis = await create_pool()
    #return {"job_id": job.id, "message": f"Mitigation started for instance {instance_id_str}"}i
    await redis.enqueue_job("mitigation_worker", instance_id_str, job_id)
    return [f"Mitigation started for instance id: {instance_id_str} with job id: {job_id}"]

@router.get("/mitigation/status/{job_id}")
async def mitigation_status(job_id: str):
    redis = await create_pool()
    key = f"{STATUS_KEY_PREFIX}{job_id}"
    data = await redis.get(key)
    if data is None:
        raise HTTPException(status_code=404, detail="Job not found")
    status = json.loads(data.decode())
    return status
