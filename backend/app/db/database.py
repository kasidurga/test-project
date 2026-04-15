"""Database configuration and session management."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import settings

# Create engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db() -> Session:
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database by creating all tables and populating sample data."""
    from app.models.user import User
    from app.core.security import get_password_hash
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Sample users to insert
        sample_users = [
            {
                'username': 'admin',
                'email': 'admin@example.com',
                'password': 'admin123',
                'role': 'admin'
            },
            {
                'username': 'user1',
                'email': 'user1@example.com',
                'password': 'pass123',
                'role': 'user'
            },
            {
                'username': 'user2',
                'email': 'user2@example.com',
                'password': 'pass123',
                'role': 'user'
            }
        ]
        
        # Insert sample users if they don't exist
        for user_data in sample_users:
            existing_user = db.query(User).filter(User.username == user_data['username']).first()
            if not existing_user:
                hashed_password = get_password_hash(user_data['password'])
                new_user = User(
                    username=user_data['username'],
                    email=user_data['email'],
                    hashed_password=hashed_password,
                    role=user_data['role'],
                    is_active=True
                )
                db.add(new_user)
                print(f"✓ Created user: {user_data['username']} (role: {user_data['role']})")
            else:
                print(f"✓ User already exists: {user_data['username']}")
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
    finally:
        db.close()
