from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ProductStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ProductCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    keywords: Optional[List[str]] = None
    image_url: str
    user_id: str


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    keywords: Optional[List[str]] = None


class ProductStatusUpdate(BaseModel):
    status: ProductStatus


class ProductResponse(BaseModel):
    id: str
    title: str
    description: str
    keywords: Optional[List[str]] = None
    image_url: str
    user_id: str
    status: ProductStatus
    created_at: str
    updated_at: str
    is_deleted: bool = False


class AIGenerationRequest(BaseModel):
    image_data: str
    

class AIGenerationResponse(BaseModel):
    title: str
    description: str
    keywords: Optional[List[str]] = None
