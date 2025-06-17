from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.users import User
from app.schemas.user import UserOut

async def get_all_users(db: AsyncSession):
    result = await db.execute(select(User))
    users = result.scalars().all()
    #return [UserOut.model_validate(u).model_dump() for u in users]
    return [UserOut.model_validate(u, from_attributes=True).model_dump() for u in users]

