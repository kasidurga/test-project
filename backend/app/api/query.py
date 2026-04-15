"""Query execution API endpoints."""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import text, create_engine
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.db_config import DBConfig

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/query", tags=["query"])


class QueryRequest(BaseModel):
    """Schema for query execution request."""
    query: str = Field(..., min_length=1, description="SQL query to execute")
    config_id: int = Field(..., gt=0, description="Database config ID for PostgreSQL database")

    class Config:
        json_schema_extra = {
            "example": {
                "query": "SELECT * FROM users LIMIT 10",
                "config_id": 1
            }
        }


@router.post("/run")
async def run_query(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Execute a SQL query and return results.
    
    Accessible to: both admin and regular authenticated users
    
    Args:
        request: QueryRequest with SQL query and optional config_id
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        List of query results as JSON array
    
    Raises:
        HTTPException: If query execution fails or config not found
    """
    query_string = request.query.strip()
    
    # Validate query is not empty
    if not query_string:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query cannot be empty"
        )
    
    target_engine = None

    try:
        db_config = db.query(DBConfig).filter(
            DBConfig.id == request.config_id
        ).first()

        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Database configuration with ID {request.config_id} not found"
            )

        postgres_url = (
            f"postgresql+psycopg2://{db_config.username}:{db_config.password}@"
            f"{db_config.host}:{db_config.port}/{db_config.database}"
        )

        logger.info(
            "Executing query on PostgreSQL config %s: %s@%s:%s/%s",
            request.config_id,
            db_config.username,
            db_config.host,
            db_config.port,
            db_config.database,
        )

        target_engine = create_engine(
            postgres_url,
            echo=False,
            future=True,
            pool_pre_ping=True,
        )

        with target_engine.begin() as connection:
            result = connection.execute(text(query_string))

            if result.returns_rows:
                rows = result.fetchall()
                columns = result.keys()
                return [dict(zip(columns, row)) for row in rows]

            return {
                "message": "Query executed successfully",
                "rows_affected": result.rowcount
            }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Query execution failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )
    finally:
        # Dispose the target engine if it was created
        if target_engine is not None:
            target_engine.dispose()

from sqlalchemy import create_engine, text

def get_dynamic_engine(db_config):
    """
    Create engine dynamically for selected DB
    """
    if db_config["type"] == "postgres":
        return create_engine(
            f"postgresql://{db_config['username']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
        )