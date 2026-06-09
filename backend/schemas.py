from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import StatusEnum

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class RequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    address: str
    preferred_time: Optional[datetime] = None
    image_url: Optional[str] = None

class RequestCreate(RequestBase):
    pass

class RequestUpdate(BaseModel):
    status: StatusEnum

class RequestOut(RequestBase):
    id: int
    status: StatusEnum
    user_id: int

    class Config:
        from_attributes = True