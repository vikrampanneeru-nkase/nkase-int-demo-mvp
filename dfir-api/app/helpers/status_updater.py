import json
from datetime import datetime
from app.db.database import async_session_maker
from app.db_helper.mitigation_job import save_job_to_db
from app.db_helper.action_job_details import insert_action_log

STATUS_KEY_PREFIX = "snapshot_status:"

async def set_status(redis, job_id: str, stage: str, data: dict = None):
    payload = {
        "stage": stage,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data or {}
    }

    await redis.set(f"{STATUS_KEY_PREFIX}{job_id}", json.dumps(payload))

    async with async_session_maker() as session:
        instance_id = data.get("instance_id") if data else None
        volume_id = data.get("volume_id")
        snapshot_id = data.get("snapshot_id")
        progress = int(data.get("progress", "0").replace("%", "")) if "progress" in data else None
        message = data.get("error") or None

        await save_job_to_db(session, job_id, instance_id, stage, payload)

        await insert_action_log(
            session=session,
            job_id=job_id,
            instance_id=instance_id,
            action=stage,
            status="in_progress" if stage != "completed" else "completed",
            volume_id=volume_id,
            snapshot_id=snapshot_id,
            progress=progress,
            message=message,
            details=data
        )

