import aioboto3
import asyncio
import uuid
from datetime import datetime
from botocore.exceptions import ClientError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.quarantine import QuarantinedInstance
from app.models.activity_log import ActivityLog
from typing import List, Dict
import json
import random
import datetime as dt
from app.db.database import async_session_maker
#from app.workers.mitigation_worker import _set_status
from app.helpers.status_updater import set_status

role_arn = "arn:aws:iam::339751003344:role/CrossAccountEC2Access"
region = "us-east-1"

BACKOFF_MAX = 5
BACKOFF_BASE = 2
SNAP_POLL_SECS =90   # 3 minutes
STATUS_KEY_PREFIX = "snapshot_status:"

async def get_cross_account_session(role_arn: str):
    base_session = aioboto3.Session()
    async with base_session.client("sts") as sts:
        response = await sts.assume_role(
            RoleArn=role_arn,
            RoleSessionName="DFIRSession"
        )
        credentials = response["Credentials"]
    return aioboto3.Session(
        aws_access_key_id=credentials["AccessKeyId"],
        aws_secret_access_key=credentials["SecretAccessKey"],
        aws_session_token=credentials["SessionToken"],
    )


async def get_account_id(session):
    async with session.client("sts") as sts_client:
        identity = await sts_client.get_caller_identity()
        return identity["Account"]


async def get_ec2_client(session):
    return await session.client("ec2", region_name=region).__aenter__()


async def identify_instance_vpc_id(ec2, instance_id: str):
    response = await ec2.describe_instances(InstanceIds=[instance_id])
    return response["Reservations"][0]["Instances"][0]["VpcId"]


async def get_or_create_security_group(ec2, vpc_id: str, suffix: str):
    name = f"ISOLATE SG NKASE-{suffix}"
    response = await ec2.describe_security_groups(
        Filters=[
            {"Name": "group-name", "Values": [name]},
            {"Name": "vpc-id", "Values": [vpc_id]}
        ]
    )
    if response['SecurityGroups']:
        return response['SecurityGroups'][0], False

    new_sg = await ec2.create_security_group(
        Description='SG for quarantine isolation',
        GroupName=name,
        VpcId=vpc_id
    )
    return new_sg, True


async def revoke_egress_rules(ec2, sg_id: str):
    await ec2.revoke_security_group_egress(
        GroupId=sg_id,
        IpPermissions=[{
            'IpProtocol': '-1',
            'IpRanges': [{'CidrIp': '0.0.0.0/0'}],
        }]
    )


async def is_instance_quarantined(db: AsyncSession, instance_id: str, account_id: str, vpc_id: str):
    stmt = select(QuarantinedInstance.is_quarantined).where(
        QuarantinedInstance.instance_id == instance_id,
        QuarantinedInstance.account_id == account_id,
        QuarantinedInstance.vpc_id == vpc_id
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() or False


async def list_instances(db: AsyncSession):
    # Assume the cross-account role and get a session
    session = await get_cross_account_session(role_arn)

    # Optionally get the account ID if you want to use or log it
    account_id = await get_account_id(session)
    print(f"Listing instances in account: {account_id}")

    # Use the session to create an EC2 client and call describe_instances
    async with session.client("ec2", region_name="us-east-1") as ec2:
        response = await ec2.describe_instances()
    instances = []

    for reservation in response.get("Reservations", []):
        for instance in reservation.get("Instances", []):
            volume_ids = [bd["Ebs"]["VolumeId"]
                          for bd in instance.get("BlockDeviceMappings", [])
                          if "Ebs" in bd]

            security_groups = [
                {"GroupId": sg["GroupId"], "GroupName": sg["GroupName"]}
                for sg in instance.get("SecurityGroups", [])
            ]
            print(f"security_groups are {security_groups}")

            is_quarantined = await is_instance_quarantined(
                db, instance["InstanceId"], account_id, instance["VpcId"]
            )

            instances.append({
                "InstanceId": instance["InstanceId"],
                "InstanceType": instance["InstanceType"],
                "State": instance["State"]["Name"],
                "PublicIpAddress": instance.get("PublicIpAddress"),
                "PrivateIpAddress": instance.get("PrivateIpAddress"),
                "AvailabilityZone": instance["Placement"]["AvailabilityZone"],
                "Tags": instance.get("Tags", []),
                "VolumeIds": volume_ids,
                "SecurityGroups": security_groups,
                "is_quarantined": is_quarantined
            })

    return instances


async def quarantine_instance(instance_ids: list, db: AsyncSession):
    results = []
    session = await get_cross_account_session(role_arn)
    ec2 = await get_ec2_client(session)
    account_id = await get_account_id(session)

    for instance_id in instance_ids:
        try:
            vpc_id = await identify_instance_vpc_id(ec2, instance_id)
            instance = (await ec2.describe_instances(InstanceIds=[instance_id]))["Reservations"][0]["Instances"][0]
            nic_id = instance["NetworkInterfaces"][0]["NetworkInterfaceId"]
            security_groups = instance["NetworkInterfaces"][0]["Groups"]

            quarantine_sg_name = str(uuid.uuid4())
            quarantine_sg, created = await get_or_create_security_group(ec2, vpc_id, quarantine_sg_name)

            await revoke_egress_rules(ec2, quarantine_sg["GroupId"])
            await ec2.modify_network_interface_attribute(
                NetworkInterfaceId=nic_id,
                Groups=[quarantine_sg["GroupId"]]
            )

            for sg in security_groups:
                db.add(QuarantinedInstance(
                    account_id=account_id,
                    instance_id=instance_id,
                    vpc_id=vpc_id,
                    nic_id=nic_id,
                    existing_security_group=sg["GroupId"],
                    quarantine_security_group=quarantine_sg["GroupId"],
                    is_quarantined=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ))

            await db.commit()
            db.add(ActivityLog(id=uuid.uuid4(),account_id=account_id,instance_id=instance_id,vpc_id=vpc_id,
                               action="Isolate",
                    status="success",message="isolate successful",
                                 performed_at=datetime.utcnow()
                    ))
            await db.commit()
            results.append(f"Isolate success: {instance_id}")

        except ClientError as e:
            error_message = e.response['Error']['Message']

            
            db.add(ActivityLog(
                id=uuid.uuid4(),
                account_id=account_id,
                instance_id=instance_id,
                vpc_id=vpc_id,
                action="Isolate",
                status="failed",
                message=error_message,
                performed_at=datetime.utcnow()
            ))

            await db.commit()
            results.append(f"Isolate failed: {instance_id} - {error_message}")

    return results


async def un_quarantine_instance(instance_ids: list, db: AsyncSession):
    results = []
    session = await get_cross_account_session(role_arn)
    ec2 = await get_ec2_client(session)
    account_id = await get_account_id(session)

    for instance_id in instance_ids:
        try:
            vpc_id = await identify_instance_vpc_id(ec2, instance_id)
            instance = (await ec2.describe_instances(InstanceIds=[instance_id]))["Reservations"][0]["Instances"][0]
            nic_id = instance["NetworkInterfaces"][0]["NetworkInterfaceId"]
            current_groups = [sg["GroupId"] for sg in instance["NetworkInterfaces"][0]["Groups"]]

            stmt = select(QuarantinedInstance).where(
                QuarantinedInstance.account_id == account_id,
                QuarantinedInstance.vpc_id == vpc_id,
                QuarantinedInstance.instance_id == instance_id,
                QuarantinedInstance.quarantine_security_group == current_groups[0]
            )
            result = await db.execute(stmt)
            print("results are from db",result)
            q_record = result.scalar_one_or_none()

            if not q_record:
                results.append(f"{instance_id} not found in quarantine records")
                continue

            await ec2.modify_network_interface_attribute(
                NetworkInterfaceId=nic_id,
                Groups=[q_record.existing_security_group]
            )

            await db.delete(q_record)
            db.add(ActivityLog(
                id=uuid.uuid4(),
                account_id=account_id,
                instance_id=instance_id,
                vpc_id=vpc_id,
                action="deisolate",
                status="success",
                message="deisolate successful",
                performed_at=datetime.utcnow()
            ))

            await db.commit()
            results.append(f"De-isolate success: {instance_id}")

        except ClientError as e:
            error_message = e.response['Error']['Message']

           
            db.add(ActivityLog(
                id=uuid.uuid4(),
                account_id=account_id,
                instance_id=instance_id,
                vpc_id=vpc_id,
                action="deisolate",
                status="failed",
                message=error_message,
                performed_at=datetime.utcnow()
            ))

            await db.commit()
            results.append(f"De-isolate failed: {instance_id} - {error_message}")

    return results
async def mitigate_instance(instance_ids: list[str], db):
    # Dummy logic for now
    print(f"Mitigating instances in ec2_ops: {instance_ids}")
    return {"detail": f"Successfully mitigated {len(instance_ids)} instance(s)."}

async def list_s3_buckets():
    session = await get_cross_account_session(role_arn)
    account_id = await get_account_id(session)
    print(f"Listing buckets in account: {account_id}")

    async with session.client("s3", region_name="us-east-1") as s3:
        response = await s3.list_buckets()
        buckets = response.get('Buckets', [])

        result = []
        for bucket in buckets:
            name = bucket["Name"]
            created = bucket.get("CreationDate")

            # Get region (optional but recommended)
            try:
                loc_response = await s3.get_bucket_location(Bucket=name)
                region = loc_response.get("LocationConstraint") or "us-east-1"
            except Exception as e:
                print(f"Failed to get region for {name}: {e}")
                region = "unknown"

            result.append({
                "Name": name,
                "Region": region,
                "CreationDate": created.isoformat() if isinstance(created, dt.datetime) else str(created)
            })

        return result
    
async def list_dynamodb_tables():
    session = await get_cross_account_session(role_arn)
    account_id = await get_account_id(session)
    print(f"Listing instances in account: {account_id}")
    async with session.client("dynamodb", region_name="us-east-1") as dynamodb:
        response = await dynamodb.list_tables()
        tables = response.get('TableNames', [])
        return tables


async def _set_status(redis, job_id: str, stage: str, data: dict = None):
    payload = {
        "stage": stage,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data or {}
    }
    key = f"{STATUS_KEY_PREFIX}{job_id}"
    await redis.set(key, json.dumps(payload))
    async with async_session_maker() as session:
        await save_job_to_db(session, job_id, data.get("instance_id") if data else None, stage, payload)

"""""
async def create_snapshot(instance_id: str, job_id: str, redis) -> list:
    await _set_status(redis, job_id, "starting", {"instance_id": instance_id})
    session = await get_cross_account_session(role_arn)

    async with session.client("ec2", region_name="us-east-1") as ec2:
        instance = (await ec2.describe_instances(InstanceIds=[instance_id]))["Reservations"][0]["Instances"][0]
        volume_ids = [bdm["Ebs"]["VolumeId"] for bdm in instance["BlockDeviceMappings"]]
        await _set_status(redis, job_id, "volumes_found", {"volume_ids": volume_ids})

        snapshot_map = {}

        for vol in volume_ids:
            try:
                await _set_status(redis, job_id, "snapshot_create", {"volume_id": vol, "attempt": 1})
                snap = await ec2.create_snapshot(
                    VolumeId=vol,
                    Description=f"Snapshot of {instance_id} volume {vol}",
                    TagSpecifications=[{
                        "ResourceType": "snapshot",
                        "Tags": [
                            {"Key": "InstanceId", "Value": instance_id},
                            {"Key": "JobId", "Value": job_id}
                        ],
                    }],
                )
                snapshot_map[vol] = snap["SnapshotId"]
            except ClientError as e:
                await _set_status(redis, job_id, "failed", {"error": str(e)})
                raise

        await _set_status(redis, job_id, "all_snapshots_started", {"snapshots": snapshot_map})

        pending = set(snapshot_map.values())
        while pending:
            await asyncio.sleep(120)
            resp = await ec2.describe_snapshots(SnapshotIds=list(pending))
            for snap in resp["Snapshots"]:
                sid = snap["SnapshotId"]
                state = snap["State"]
                prog = snap.get("Progress", "")
                await _set_status(redis, job_id, "snapshot_progress", {
                    "snapshot_id": sid,
                    "state": state,
                    "progress": prog,
                })
                if state == "completed":
                    pending.discard(sid)

        await _set_status(redis, job_id, "completed", {"snapshots": snapshot_map})

    return [{"volume_id": v, "snapshot_id": s} for v, s in snapshot_map.items()]
"""



async def create_snapshot(instance_id: str, job_id: str, redis):
    session = await get_cross_account_session(role_arn)

    async with session.client("ec2", region_name="us-east-1") as ec2:
        reservations = await ec2.describe_instances(InstanceIds=[instance_id])
        instance = reservations["Reservations"][0]["Instances"][0]
        volume_ids = [bdm["Ebs"]["VolumeId"] for bdm in instance["BlockDeviceMappings"]]

        await set_status(redis, job_id, "volumes_found", {"instance_id": instance_id, "volume_ids": volume_ids})

        snapshot_map = {}

        for vol_id in volume_ids:
            try:
                await set_status(redis, job_id, "snapshot_create_started", {"volume_id": vol_id, "instance_id": instance_id})

                response = await ec2.create_snapshot(
                    VolumeId=vol_id,
                    Description=f"Snapshot of {instance_id} volume {vol_id}",
                    TagSpecifications=[{
                        "ResourceType": "snapshot",
                        "Tags": [
                            {"Key": "InstanceId", "Value": instance_id},
                            {"Key": "JobId", "Value": job_id}
                        ],
                    }],
                )
                snapshot_id = response["SnapshotId"]
                snapshot_map[vol_id] = snapshot_id

                await set_status(redis, job_id, "snapshot_creation_initiated", {
                    "volume_id": vol_id,
                    "snapshot_id": snapshot_id,
                    "instance_id": instance_id
                })

            except ClientError as e:
                await set_status(redis, job_id, "failed", {"volume_id": vol_id, "error": str(e), "instance_id": instance_id})
                raise

        await set_status(redis, job_id, "all_snapshots_started", {"snapshots": snapshot_map, "instance_id": instance_id})

        pending_snapshots = set(snapshot_map.values())

        while pending_snapshots:
            await asyncio.sleep(120)  # 2 minutes
            resp = await ec2.describe_snapshots(SnapshotIds=list(pending_snapshots))

            for snap in resp["Snapshots"]:
                sid = snap["SnapshotId"]
                state = snap["State"]
                progress = snap.get("Progress", "0%")

                await set_status(redis, job_id, "snapshot_progress", {
                    "snapshot_id": sid,
                    "state": state,
                    "progress": progress,
                    "instance_id": instance_id,
                    "volume_id": next((v for v, s in snapshot_map.items() if s == sid), None)
                })

                if state == "completed":
                    pending_snapshots.discard(sid)

        await set_status(redis, job_id, "completed", {"snapshots": snapshot_map, "instance_id": instance_id})

    return [{"volume_id": v, "snapshot_id": s} for v, s in snapshot_map.items()]
