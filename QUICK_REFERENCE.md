# Quick Reference Guide

Complete setup and command reference for the authentication system.

## 🚀 One-Liner Setup

### Backend
```bash
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python init_db.py && python main.py
```

### Frontend
```bash
cd frontend && npm install && npm run dev
```

## 📝 Common Commands

### Backend

```bash
# Setup
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Initialize database
python init_db.py

# Run server
python main.py

# Run with custom port
python main.py --port 8001

# View API docs
# Open: http://localhost:8000/docs
```

### Frontend

```bash
# Setup
npm install

# Development
npm run dev                        # Start dev server

# Production
npm run build                      # Create optimized build
npm run preview                    # Test production build

# Cleanup
rm -rf node_modules               # Windows: rmdir /s node_modules
rm package-lock.json              # Windows: del package-lock.json
```

## 🔐 Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | admin|
| user1    | pass123  | user |
| user2    | pass123  | user |

## 🌐 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend Server | http://localhost:8000 | API |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health Check | http://localhost:8000/health | Server status |
| Frontend | http://localhost:3000 | React App |
| ViteJS | http://localhost:5173 | Alt Frontend (Vite dev) |

## Query Editor Endpoint

The backend includes a query execution endpoint that powers the QueryEditorPage:

**Endpoint:** `POST /api/query/run`

**Authentication:** Bearer Token (JWT) - Both admin and user roles have access

**Request Body:**
```json
{
  "query": "SELECT * FROM users LIMIT 10"
}
```

**Response (Grid Data):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-04-06T00:00:00"
  },
  {
    "id": 2,
    "username": "user1",
    "email": "user1@example.com",
    "role": "user",
    "is_active": true,
    "created_at": "2026-04-06T00:00:00"
  }
]
```

**Error Response:**
```json
{
  "detail": "Query execution failed: [SQLAlchemy error message]"
}
```

## 🌐 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend Server | http://localhost:8000 | API |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health Check | http://localhost:8000/health | Server status |
| Frontend | http://localhost:3000 | React App |
| ViteJS | http://localhost:5173 | Alt Frontend (Vite dev) |

## 📁 Important Files

### Backend
- `main.py` - FastAPI application entry point
- `app/api/auth.py` - Login endpoint
- `app/api/admin.py` - Admin endpoints (DB configs)
- `app/api/query.py` - **Query execution endpoint (NEW)**
- `app/core/security.py` - JWT and password utilities
- `app/db/database.py` - Database setup
- `init_db.py` - Database initialization script
- `schema.sql` - Database schema
- `.env` - Configuration (copy from .env.example)

### Frontend
- `src/App.jsx` - Main app component with routing
- `src/context/AuthContext.jsx` - Auth state management
- `src/pages/LoginPage.jsx` - Login form
- `src/utils/api.js` - Axios instance with interceptors
- `vite.config.js` - Build configuration
- `.env` - Configuration (copy from .env.example)

## 💾 Database

### Initialize Database
```bash
cd backend
python init_db.py
```

### View Database
```bash
# Using SQLite CLI
sqlite3 app.db

# View users
SELECT * FROM users;

# Count users
SELECT role, COUNT(*) FROM users GROUP BY role;
```

### Reset Database
```bash
# Delete and reinitialize
cd backend
rm app.db
python init_db.py
```

## 🔌 API Examples

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Health Check
```bash
curl http://localhost:8000/health
```

### Query Execution (NEW)
```bash
# Execute a SELECT query
curl -X POST http://localhost:8000/api/query/run \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT id, username, role FROM users"
  }'

# Response example:
# [
#   {"id": 1, "username": "admin", "role": "admin"},
#   {"id": 2, "username": "user1", "role": "user"}
# ]
```

## 📋 OpenAPI Specification

The complete OpenAPI 3.1.0 specification for all endpoints is available in:

**File:** `openapi-complete.json`

This specification includes:
- Authentication endpoints (`/api/auth/login`, `/api/auth/me`)
- Admin database configuration endpoints (`/admin/db-configs`)
- Query execution endpoint (`/api/query/run`) - **NEW**
- Health check and root endpoints

**View API Docs:** http://localhost:8000/docs (Swagger UI)

## 🧪 Test Flow

1. **Start Backend**
   ```bash
   cd backend
   python main.py
   ```

2. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Browser**
   - Navigate to http://localhost:5173

4. **Login**
   - Username: admin
   - Password: admin123
   - Click Login

5. **Navigate to Query Editor**
   - Click "🔍 Query" in the navigation menu
   - Or go directly to http://localhost:5173/query

6. **Test Query Execution**
   - Enter a SQL query: `SELECT * FROM users`
   - Click "Execute Query"
   - Results display in **Grid View** (default) or **JSON View**
   - Try switching between views using the toggle buttons
   - Copy JSON to clipboard using the copy button
   - Access previous queries from the history

7. **Verify Features**
   - Grid view shows dynamic columns from query results
   - JSON view displays formatted, pretty-printed results
   - Query history stores last 5 queries
   - Both admin and regular users can access the query editor
   - Errors display gracefully if query execution fails

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in main.py
# OR use a different port
python main.py --port 8001

# Find process using port
lsof -i :8000              # MacOS/Linux
netstat -ano | grep 8000   # Windows
```

### Module Not Found
```bash
# Ensure virtual environment is activated
source venv/bin/activate   # MacOS/Linux
venv\Scripts\activate      # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Issues
```bash
# Recreate database
cd backend
rm app.db
python init_db.py
```

### CORS Error
- Check backend `.env` CORS settings
- Verify frontend URL is in `ALLOWED_ORIGINS`
- Example: `"http://localhost:3000"`

### Frontend Won't Load
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📊 Architecture Overview

```
┌──────────────────────────────┐
│  React Frontend              │
│  - Login Page                │
│  - Config Page (Admin)       │
│  - Editor Page               │
│  - Query Editor Page (NEW!)  │
│  - Reports Page              │
└──────────┬───────────────────┘
           │
         Axios + JWT Token
           │
┌──────────────────────────────┐
│  FastAPI Backend             │
│  - Auth Routes               │
│  - Admin Routes              │
│  - Query Execution (NEW!)    │
│  - JWT Validation            │
│  - Password Hashing          │
└──────────┬───────────────────┘
           │
       SQLAlchemy ORM
           │
┌──────────────────────────────┐
│  SQLite Database             │
│  - Users Table               │
│  - DB Configs Table          │
└──────────────────────────────┘
```

## 📖 File Tree

```
test_project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── admin.py
│   │   │   ├── query.py          (NEW - Query Execution)
│   │   │   └── __init__.py
│   │   ├── core/config.py
│   │   ├── core/security.py
│   │   ├── db/database.py
│   │   ├── models/user.py
│   │   └── schemas/user.py
│   ├── main.py
│   ├── init_db.py
│   ├── schema.sql
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/ProtectedRoute.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ConfigPage.jsx
│   │   │   ├── EditorPage.jsx
│   │   │   ├── QueryEditorPage.jsx    (NEW - Query Editor UI)
│   │   │   ├── ReportsPage.jsx
│   │   │   └── UnauthorizedPage.jsx
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── ConfigPage.css
│   │   │   ├── EditorPage.css
│   │   │   ├── QueryEditorPage.css    (NEW)
│   │   │   ├── ReportsPage.css
│   │   │   ├── Login.css
│   │   │   └── UnauthorizedPage.css
│   │   ├── utils/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```

## ⚡ Performance Tips

- Use `.env.example` as a template (don't commit `.env`)
- Enable CORS only for necessary origins
- Use async/await for all async operations
- Memoize React components that receive static props
- Use code splitting for large frontend bundles

## 🆕 New: Query Editor Features

### Backend Query Execution (`/api/query/run`)

**Endpoint Details:**
- **Route:** `POST /api/query/run`
- **Authentication:** Required (Bearer Token - JWT)
- **Access:** Both admin and user roles
- **Database:** Executes queries against SQLite database
- **Response Format:** JSON array of objects (for SELECT queries)

**Example Queries:**
```sql
-- View all users
SELECT id, username, email, role FROM users;

-- Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- View database configurations (admin)
SELECT * FROM db_configs;
```

### Frontend Query Editor Page (`/query`)

**Features:**
1. **SQL Query Input**
   - Textarea with syntax highlighting
   - Auto-complete support (coming soon)

2. **Multiple Result Formats**
   - Grid View (default): Dynamic table with columns from query results
   - JSON View: Pretty-printed formatted JSON with syntax highlighting

3. **Query History**
   - Stores last 5 executed queries
   - Click any history item to reload the query
   - Accessible for quick re-execution

4. **Copy to Clipboard**
   - JSON view includes copy button
   - Automatically copies formatted JSON

5. **Error Handling**
   - Database errors display clearly
   - Invalid query syntax shows detailed error messages
   - Empty results show graceful "no results" message

6. **Navigation Menu**
   - Quick links to Editor, Query, Reports, Config pages
   - Admin-only Config link
   - User info and logout button

### Accessing Query Editor

**URL:** `http://localhost:5173/query`

**Who Can Access:**
- ✅ Admin users
- ✅ Regular users
- ❌ Unauthenticated users (redirected to login)

## 🔒 Security Checklist

- [ ] Change `SECRET_KEY` in `.env` before production
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Regular security audits
- [ ] Enable database encryption
- [ ] Implement refresh tokens
- [ ] Add multi-factor authentication (MFA)

## 📞 Support

For detailed information, refer to:
- [Main README](./README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
