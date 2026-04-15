"""Pydantic schemas for user-related operations."""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common fields."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user creation/registration."""
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for login request."""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserResponse(UserBase):
    """Schema for user response (without password)."""
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    role: str


class TokenData(BaseModel):
    """Schema for token claims/data."""
    user_id: int
    username: str
    role: str
