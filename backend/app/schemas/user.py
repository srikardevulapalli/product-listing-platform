from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    display_name: Optional[str] = None


class UserResponse(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None
    is_admin: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class SetAdminRequest(BaseModel):
    user_id: str
    master_key: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "firebase_user_uid_here",
                "master_key": "your_master_admin_key"
            }
        }
