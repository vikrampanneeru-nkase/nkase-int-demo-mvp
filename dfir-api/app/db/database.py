from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine
import os

DATABASE_URL = "postgresql+asyncpg://postgres:nkasedemo123@nkasedfirdb.cyjkc2caaq19.us-east-1.rds.amazonaws.com:5432/nkasedfirdb"

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with async_session_maker() as session:
        yield session

SYNC_DATABASE_URL = DATABASE_URL.replace("+asyncpg", "")  # Converts to normal psycopg2 driver

sync_engine = create_engine(SYNC_DATABASE_URL, echo=True)
SyncSessionLocal = sessionmaker(bind=sync_engine, autocommit=False, autoflush=False)
