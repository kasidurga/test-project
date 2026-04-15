"""Admin API endpoints for database configuration management."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Security
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.db_config import DBConfig
from app.models.user import User
from app.schemas.db_config import DBConfigCreate, DBConfigUpdate, DBConfigResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure user is admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.post("/db-configs", response_model=DBConfigResponse)
async def create_db_config(
    config: DBConfigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> DBConfigResponse:
    """Create a new database configuration (admin only).
    
    Requires: Admin role and valid Bearer token
    """
    db_config = DBConfig(
        **config.model_dump(),
        created_by=current_user.id
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


@router.get("/db-configs", response_model=List[DBConfigResponse])
async def get_db_configs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> List[DBConfigResponse]:
    """Get all database configurations (admin only).
    
    Requires: Admin role and valid Bearer token
    """
    configs = db.query(DBConfig).offset(skip).limit(limit).all()
    return configs


@router.get("/db-configs/{config_id}", response_model=DBConfigResponse)
async def get_db_config(
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> DBConfigResponse:
    """Get a specific database configuration by ID (admin only).
    
    Requires: Admin role and valid Bearer token
    """
    config = db.query(DBConfig).filter(DBConfig.id == config_id).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Database configuration not found"
        )
    return config


@router.put("/db-configs/{config_id}", response_model=DBConfigResponse)
async def update_db_config(
    config_id: int,
    config_update: DBConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> DBConfigResponse:
    """Update a database configuration (admin only).
    
    Requires: Admin role and valid Bearer token
    """
    config = db.query(DBConfig).filter(DBConfig.id == config_id).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Database configuration not found"
        )
    
    update_data = config_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(config, field, value)
    
    db.commit()
    db.refresh(config)
    return config


@router.delete("/db-configs/{config_id}")
async def delete_db_config(
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a database configuration (admin only).
    
    Requires: Admin role and valid Bearer token
    """
    config = db.query(DBConfig).filter(DBConfig.id == config_id).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Database configuration not found"
        )
    
    db.delete(config)
    db.commit()
    return {"message": "Database configuration deleted successfully"}