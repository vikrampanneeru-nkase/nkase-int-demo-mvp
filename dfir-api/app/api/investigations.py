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
from datetime import datetime

from app.schemas.cases import CaseOut
from app.models import Case, CaseTask, Report, TimelineEvent, Finding


from app.db.database import get_db
from app.workers.mitigation_worker import mitigation_worker
from app.schemas.mitigation import MitigationResponse
from fastapi import APIRouter, BackgroundTasks
import uuid
from app.models.action_job_detail import ActionJobDetail
from app.schemas.action_job_detail import ActionJobDetailResponse
from app.services.users import get_all_users
STATUS_KEY_PREFIX = "snapshot_status:"
router = APIRouter()
from sqlalchemy import select
from app.schemas.cases import CaseCreate

from uuid import UUID

# ----------- Models -----------

class ActionRequest(BaseModel):
    instance_ids: List[str]

# ----------- Endpoints -----------



@router.get("",response_model=List[CaseOut])
async def get_investigations(db: AsyncSession = Depends(get_db)):
    #return await list_instances(db)
    result = await db.execute(select(Case))
    cases = result.scalars().all()
    return cases

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

@router.get("/mitigation/status/{job_id}",response_model=List[ActionJobDetailResponse])
async def mitigation_status(job_id:UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(ActionJobDetail).where(ActionJobDetail.job_id == job_id)
    result = await db.execute(stmt)
    records = result.scalars().all()
    
    if not records:
        raise HTTPException(status_code=404, detail="No action job details found for this job_id")
    
    return record
@router.get("/{case_number}")
async def get_case_details(case_number: str, session: AsyncSession = Depends(get_db)):
    # Get case
    result = await session.execute(select(Case).where(Case.case_number == case_number))
    case = result.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Get tasks
    result = await session.execute(select(CaseTask).where(CaseTask.case_id == case_number))
    tasks = result.scalars().all()

    # Get reports
    result = await session.execute(select(Report).where(Report.case_number == case_number))
    reports = result.scalars().all()

    # Get timeline events
    result = await session.execute(select(TimelineEvent).where(TimelineEvent.case_number == case_number))
    timeline = result.scalars().all()

    # Get findings
    result = await session.execute(select(Finding).where(Finding.case_number == case_number))
    findings = result.scalars().all()

    return {
        "case": case,
        "tasks": tasks,
        "reports": reports,
        "timeline": timeline,
        "findings": findings
    }



@router.post("/cases/create")
async def create_case(payload: CaseCreate, db: AsyncSession = Depends(get_db)):
    print("value are before construction",payload)
    #assigned_to=payload.accountName
    new_case = Case(
        title=payload.title,
        #description=payload.description,
        priority=payload.priority,
        status="Open",
        assigned_to=payload.assigned_to,
        #due_date=payload.due_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    print("values are ", new_case)
    db.add(new_case)
    await db.flush()       # Triggers the insert + calls the trigger
    await db.refresh(new_case)
    await db.commit()

    return {
        "message": "Case created successfully",
        "case_number": new_case.case_number,
        "title": new_case.title,
        "status": new_case.status
    }

@router.get("/resources/available")
async def get_all_resources(db: AsyncSession = Depends(get_db)):
    # Run all async calls concurrently
    from asyncio import gather

    ec2_task = list_instances(db)
    s3_task = list_s3_buckets()
    dynamo_task = list_dynamodb_tables()
    user_task = get_all_users(db)

    ec2_data, s3_data, dynamo_data,users = await gather(ec2_task, s3_task, dynamo_task,user_task)

    return {
        "EC2": ec2_data,
        "S3": s3_data,
        "DynamoDB": dynamo_data,
        "Users":users
    }
