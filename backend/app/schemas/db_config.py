"""Pydantic schemas for database configuration operations."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DBConfigBase(BaseModel):
    """Base DB config schema."""
    name: str = Field(..., min_length=1, max_length=100)
    host: str = Field(..., min_length=1, max_length=255)
    port: int = Field(..., gt=0, le=65535)
    database: str = Field(..., min_length=1, max_length=100)
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=255)


class DBConfigCreate(DBConfigBase):
    """Schema for creating DB config."""
    pass


class DBConfigUpdate(BaseModel):
    """Schema for updating DB config."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    host: Optional[str] = Field(None, min_length=1, max_length=255)
    port: Optional[int] = Field(None, gt=0, le=65535)
    database: Optional[str] = Field(None, min_length=1, max_length=100)
    username: Optional[str] = Field(None, min_length=1, max_length=100)
    password: Optional[str] = Field(None, min_length=1, max_length=255)


class DBConfigResponse(DBConfigBase):
    """Schema for DB config response."""
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True