from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    user_id: str
    password: str
    api_key: str
    account_id: str
    external_id: str
    api_gateway_url: str
    account_name: str
    email_id: EmailStr

class UserOut(BaseModel):
    user_id: str
    api_key: str
    account_id: str
    external_id: str
    api_gateway_url: str
    account_name: str
    email_id: EmailStr

    class Config:
        orm_mode = True

