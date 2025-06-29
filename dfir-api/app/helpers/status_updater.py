import json
from datetime import datetime
from app.db.database import async_session_maker
from app.db_helper.action_job_details import insert_action_log
import logging

STATUS_KEY_PREFIX = "snapshot_status:"

async def fail_and_cleanup(redis, job_id: str):
    """Remove job status from redis and perform any additional cleanup."""
    try:
        await redis.delete(f"{STATUS_KEY_PREFIX}{job_id}")
        # If you have a background task manager, add code here to remove/cancel the job
        # Example: await arq_queue.cancel(job_id)  # Uncomment and adapt if using ARQ
        logging.info(f"[fail_and_cleanup] Cleared job {job_id} from redis and background tasks.")
    except Exception as e:
        logging.error(f"[fail_and_cleanup] Failed to cleanup job {job_id}: {e}")

async def set_status(
    redis,
    job_id: str,
    account_id: str,
    case_number: str,
    stage: str,
    status:str,
    instance_id: str = None,
    volume_id: str = None,
    snapshot_id: str = None,
    tenat_progress: int = None,
    nkase_snapshot_id: str = None,
    nkase_snapshot_progress: int = None,
    nkase_volume_id: str = None,
    message: str = None,
    errors: str = None,
    details: dict = None,
):
    # Ensure tenat_progress and nkase_snapshot_progress are always int or None
    def parse_int(val):
        try:
            return int(val) if val is not None else None
        except (ValueError, TypeError):
            return None

    tenat_progress = parse_int(tenat_progress)
    nkase_snapshot_progress = parse_int(nkase_snapshot_progress)

    payload = {
        "stage": stage,
        "timestamp": datetime.utcnow().isoformat(),
        "status": status,
        "account_id": account_id,
        "case_number": case_number,
        "instance_id": instance_id,
        "volume_id": volume_id,
        "snapshot_id": snapshot_id,
        "tenat_progress": tenat_progress,
        "nkase_snapshot_id": nkase_snapshot_id,
        "nkase_snapshot_progress": nkase_snapshot_progress,
        "nkase_volume_id": nkase_volume_id,
        "message": message,
        "errors": errors,
        "details": details or {},
    }
    await redis.set(f"{STATUS_KEY_PREFIX}{job_id}", json.dumps(payload))

    async with async_session_maker() as session:
        try:
            await insert_action_log(
                session=session,
                job_id=job_id,
                instance_id=instance_id,
                action=stage,
                status=status,
                stage=stage,
                volume_id=volume_id,
                snapshot_id=snapshot_id,
                tenat_progress=tenat_progress,
                nkase_snapshot_id=nkase_snapshot_id,
                nkase_snapshot_progress=nkase_snapshot_progress,
                nkase_volume_id=nkase_volume_id,
                message=message,
                details=details,
                case_number=case_number,
                account_id=account_id,
                errors=errors
            )
            logging.info(f"[set_status] Successfully inserted action log for job_id={job_id}, stage={stage}, case_number={case_number}")
        except Exception as e:
            logging.error(f"[set_status] Failed to insert action log for job_id={job_id}, stage={stage}, case_number={case_number}: {e}")

    # Enhanced failure detection: delete redis if stage is 'failed' or any error/exception in errors/message
    should_cleanup = False
    if stage.lower() == "failed":
        should_cleanup = True
    else:
        for val in (errors, message):
            if val and any(word in val.lower() for word in ["error", "exception"]):
                should_cleanup = True
                break
    if should_cleanup:
        await fail_and_cleanup(redis, job_id)

async def periodic_status_updater(redis, job_id, account_id, case_number, stage, data_fn, interval=20, stop_condition_fn=None):
    """
    Call set_status every `interval` seconds with data from data_fn().
    Optionally stop if stop_condition_fn() returns True.
    """
    import asyncio
    while True:
        data = await data_fn()
        await set_status(redis, job_id, account_id, case_number, stage, data)
        if stop_condition_fn and await stop_condition_fn():
            break
        await asyncio.sleep(interval)

# Usage example for a snapshot progress loop:
# async def get_snapshot_status():
#     ... # fetch latest status from AWS
#     return {"instance_id": ..., "progress": ..., ...}
# await periodic_status_updater(redis, job_id, account_id, case_number, "snapshot_in_progress", get_snapshot_status)


