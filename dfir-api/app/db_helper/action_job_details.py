# app/db_helper/action_job_details.py

from app.models.action_job_detail import ActionJobDetail
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import json
import uuid

async def insert_action_log(
    session: AsyncSession,
    job_id: str,
    instance_id: str,
    stage: str,
    status: str,
    action: str = None,
    volume_id: str = None,
    snapshot_id: str = None,
    tenat_progress: int = None,
    nkase_snapshot_id: str = None,
    nkase_snapshot_progress: int = None,
    nkase_volume_id: str = None,
    message: str = None,
    details: dict = None,
    case_number: str = None,
    account_id: str = None,
    errors: str = None,
):
    entry = ActionJobDetail(
        job_id=uuid.UUID(job_id),
        instance_id=instance_id,
        action=action,
        stage=stage,
        status=status,
        volume_id=volume_id,
        snapshot_id=snapshot_id,
        tenat_progress=tenat_progress,
        nkase_snapshot_id=nkase_snapshot_id,
        nkase_snapshot_progress=nkase_snapshot_progress,
        nkase_volume_id=nkase_volume_id,
        message=message,
        details=json.loads(json.dumps(details)) if details else None,
        case_number=case_number,
        account_id=account_id,
        errors=errors,
        timestamp=datetime.utcnow(),
    )
    session.add(entry)
    await session.commit()


