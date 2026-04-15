# Backend - FastAPI Authentication Server

FastAPI-based backend server with JWT authentication, SQLite database, and role-based access control.

## 📋 Quick Start

### 1. Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start server
python main.py
```

Server runs at: http://localhost:8000

### 2. API Documentation

- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/          # API routes
│   ├── core/         # Configuration & security utilities
│   ├── db/           # Database setup
│   ├── models/       # SQLAlchemy models
│   └── schemas/      # Pydantic validation schemas
├── main.py           # FastAPI app factory
├── init_db.py        # Database initialization
└── requirements.txt  # Dependencies
```

## 🔐 Authentication

### Login Endpoint

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Response

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-03-27T10:00:00"
  },
  "role": "admin"
}
```

## 📊 Database

### Schema

```sql
users
├── id (PRIMARY KEY)
├── username (UNIQUE)
├── email (UNIQUE)
├── hashed_password
├── role (admin/user)
├── is_active
├── created_at
└── updated_at
```

### Sample Users

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | admin|
| user1    | pass123  | user |
| user2    | pass123  | user |

## 🔧 Configuration

Edit `.env` file to customize:

```
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./app.db
DEBUG=False
```

## 📝 File Descriptions

### `app/core/config.py`
Application settings using Pydantic Settings
- Database URL
- JWT configuration
- CORS settings

### `app/core/security.py`
Security utilities for authentication
- `get_password_hash()` - Hash passwords with bcrypt
- `verify_password()` - Verify password against hash
- `create_access_token()` - Generate JWT tokens
- `decode_token()` - Validate and decode JWT tokens

### `app/models/user.py`
SQLAlchemy User model defining database structure

### `app/schemas/user.py`
Pydantic schemas for request/response validation
- `UserLogin` - Login payload
- `TokenResponse` - Token response
- `UserResponse` - User data response

### `app/api/auth.py`
Authentication endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### `app/db/database.py`
Database configuration
- Engine setup
- Session management
- `get_db()` - Dependency injection for sessions

## 🧪 Testing

### Login Request

```python
import requests

response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={
        "username": "admin",
        "password": "admin123"
    }
)

print(response.json())
```

### Protected Request

```python
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
    "http://localhost:8000/api/auth/me",
    headers=headers
)
```

## 🚨 Error Responses

### Invalid Credentials
```json
{
  "detail": "Invalid username or password"
}
```
Status: 401 Unauthorized

### Inactive User
```json
{
  "detail": "User account is inactive"
}
```
Status: 403 Forbidden

### Invalid Token
```json
{
  "detail": "Invalid token"
}
```
Status: 401 Unauthorized

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | 0.104.1 | Web framework |
| uvicorn | 0.24.0 | ASGI server |
| sqlalchemy | 2.0.23 | ORM |
| pydantic | 2.5.0 | Validation |
| python-jose | 3.3.0 | JWT handling |
| passlib | 1.7.4 | Password hashing |
| bcrypt | 4.1.1 | Bcrypt algorithm |

## 💡 Tips

- Use `http://localhost:8000/docs` for interactive API testing
- Database resets when `app.db` is deleted
- Run `python init_db.py` to reseed sample data
- Modify secret key in `.env` before production deployment

## 🐛 Common Issues

**"Address already in use":**
```bash
# Use a different port
python main.py --port 8001
```

**"Database locked":**
```bash
# Delete and reinitialize
rm app.db
python init_db.py
```

**CORS errors from frontend:**
- Check `ALLOWED_ORIGINS` in `.env`
- Verify frontend URL is in the list

## 📚 Further Reading

- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Password Hashing with Bcrypt](https://github.com/pyca/bcrypt)
