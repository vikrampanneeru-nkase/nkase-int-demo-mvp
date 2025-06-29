from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.activity_log import ActivityLog
from app.schemas.activity_log import ActivityLogResponse
#from app.schemas.mitigation_log import MitigationJobOut
from app.models.mitigation_job import MitigationJob
from typing import List
from datetime import datetime
from app.db.database import get_db
from sqlalchemy.future import select

from sqlalchemy import select, func
router = APIRouter()

@router.get("", response_model=List[ActivityLogResponse])
async def get_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ActivityLog).order_by(ActivityLog.performed_at.desc()))
    logs = result.scalars().all()
    return logs


@router.get("/mitigated")
async def get_mitigated_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MitigationJob))
    jobs: List[MitigationJob] = result.scalars().all()

    simplified_jobs = []
    for job in jobs:
        job_dict = {
            "job_id": str(job.job_id),
            "instance_id": job.instance_id,
            "stage": job.stage,
            "created_at": job.created_at.isoformat(),
            "updated_at": job.updated_at.isoformat(),
        }

        if job.stage == "failed" and job.details:
            job_dict["error_message"] = job.details.get("data", {}).get("error", "Unknown error")

        simplified_jobs.append(job_dict)

    return simplified_jobs


#http://ec2-54-196-221-208.compute-1.amazonaws.com/api/dashboard/mitigations/in-progress/count
@router.get("/mitigations/in-progress/count")
async def get_not_completed_count(db: AsyncSession = Depends(get_db)):
    # Get cases where status is not 'Completed' or 'Error'
    from app.models.cases import Case
    result = await db.execute(
        select(Case.case_number).where(~Case.status.in_(["Completed", "Error"]))
    )
    case_numbers = [row[0] for row in result.all()]
    return {
        "in_progress_count": len(case_numbers),
        "case_numbers": case_numbers
    }

