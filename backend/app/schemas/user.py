from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None


class UserResponse(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None
    is_admin: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str
