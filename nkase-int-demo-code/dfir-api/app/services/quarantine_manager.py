from app.db.database import Base
from sqlalchemy import Column, String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.db.redis import is_table_created, set_table_created

async def ensure_quarantine_table(account_id: str, db: AsyncSession):
    table_name = f"quarantine_{account_id}"
    if await is_table_created(account_id):
        return table_name

    sql = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        id SERIAL PRIMARY KEY,
        account_id TEXT,
        instance_id TEXT,
        vpc_id TEXT,
        network_interface TEXT,
        exesecuritygroup TEXT
    );
    """
    await db.execute(text(sql))
    await db.commit()
    await set_table_created(account_id)
    return table_name

async def insert_quarantine_record(account_id: str, record: dict, db: AsyncSession):
    table_name = await ensure_quarantine_table(account_id, db)
    fields = ', '.join(record.keys())
    values = ', '.join(f":{key}" for key in record)
    sql = f"INSERT INTO {table_name} ({fields}) VALUES ({values})"
    await db.execute(text(sql), record)
    await db.commit()

