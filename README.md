# Authentication System - Full Stack Application

A production-grade full-stack web application with React frontend, FastAPI backend, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Access Control](#access-control)

---

## ✨ Features

### User Roles
- **Admin**: Full access to all pages
- **User**: Access to Query Editor and Reports only

### Pages
1. **Login Page** - Authentication entry point
2. **Configuration Page** - Admin-only database connection settings
3. **Query Editor** - SQL query execution interface
4. **Reports** - Data visualization and reporting

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with role-based access
- Token storage in localStorage with auto-refresh on 401
- CORS enabled for frontend communication

---

## 📁 Project Structure

```
test_project/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── __init__.py
│   │   │   └── auth.py       # Authentication routes
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py     # App configuration
│   │   │   └── security.py   # JWT & password utilities
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── database.py   # Database setup & session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user.py       # SQLAlchemy User model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── user.py       # Pydantic schemas
│   │   └── __init__.py
│   ├── main.py               # FastAPI app factory
│   ├── init_db.py            # Database initialization
│   ├── requirements.txt      # Python dependencies
│   ├── schema.sql            # Database schema
│   ├── sample_data.sql       # Sample data queries
│   ├── .env.example          # Environment variables template
│   └── README.md             # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── ProtectedRoute.jsx    # Route protection logic
│   │   │   └── __init__.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state management
│   │   ├── pages/            # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ConfigPage.jsx
│   │   │   ├── EditorPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── UnauthorizedPage.jsx
│   │   ├── styles/           # CSS files
│   │   │   ├── App.css
│   │   │   ├── Login.css
│   │   │   ├── ConfigPage.css
│   │   │   ├── EditorPage.css
│   │   │   ├── ReportsPage.css
│   │   │   └── UnauthorizedPage.css
│   │   ├── utils/
│   │   │   └── api.js        # Axios instance with interceptors
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── __init__.js
│   ├── index.html            # HTML template
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── .env.example          # Environment variables template
│   └── README.md             # Frontend documentation
│
└── README.md                 # This file
```

---

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **PyJWT** - JWT token handling
- **Passlib & Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library with hooks
- **React Router DOM** - Routing and navigation
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+ and npm
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   copy .env.example .env
   # Edit .env with your settings if needed
   ```

5. **Initialize database**
   ```bash
   python init_db.py
   ```

6. **Start backend server**
   ```bash
   python main.py
   ```
   
   Server will run at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/health`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   copy .env.example .env
   # Edit .env with your API base URL if needed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   App will run at `http://localhost:3000` (or `http://localhost:5173` with Vite)

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📊 Database

### Schema

The database uses SQLite with a single `users` table:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data

**Demo Credentials:**

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin    | admin123 | admin| All pages |
| user1    | pass123  | user | Editor, Reports |
| user2    | pass123  | user | Editor, Reports |

### Initialization

The `init_db.py` script automatically:
- Creates database tables
- Seeds sample users
- Hashes passwords securely

---

## 🔌 API Endpoints

### Authentication

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response**:
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

#### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "user_id": 1,
    "username": "admin",
    "role": "admin"
  }
  ```

### Health Check

- **Endpoint**: `GET /health`
- **Response**: `{"status": "ok", "message": "Server is running"}`

---

## 🔐 Authentication Flow

### Login Process

```
1. User enters credentials on Login page
2. Frontend sends POST /api/auth/login with username & password
3. Backend:
   - Finds user by username
   - Verifies password against hashed password
   - Checks if user is active
   - Creates JWT token with user info
   - Returns token + user data
4. Frontend:
   - Stores token in localStorage
   - Stores user info in localStorage
   - Sets authentication context
   - Redirects based on role:
     - admin → /config
     - user → /editor
5. Subsequent requests:
   - Axios interceptor adds token to Authorization header
   - Token expires after 30 minutes by default
   - On 401 response, token is cleared and user redirected to /login
```

### JWT Token Structure

**Token Claims:**
```json
{
  "user_id": 1,
  "username": "admin",
  "role": "admin",
  "exp": 1648470000
}
```

**Configuration:**
- Algorithm: HS256
- Expiration: 30 minutes (configurable)
- Secret Key: Set in `.env` file

---

## 🛡️ Access Control

### Protected Routes

The application implements role-based access control (RBAC):

```
Route              Required Role    Public  Component
-------------------------------------------------
/login             None            ✓       LoginPage
/config            admin           ✗       ConfigPage
/editor            authenticated   ✗       EditorPage
/reports           authenticated   ✗       ReportsPage
/unauthorized      authenticated   ✗       UnauthorizedPage
```

### Route Protection Components

#### ProtectedRoute
- Requires any valid authentication
- Redirects to `/login` if not authenticated
- Optional role-based access control

```jsx
<ProtectedRoute>
  <EditorPage />
</ProtectedRoute>
```

#### AdminRoute
- Requires admin role
- Redirects to `/unauthorized` if insufficient permissions

```jsx
<AdminRoute>
  <ConfigPage />
</AdminRoute>
```

### Access Restrictions

| Action | Admin | User |
|--------|-------|------|
| View Configuration | ✓ | ✗ |
| Access Query Editor | ✓ | ✓ |
| View Reports | ✓ | ✓ |
| View Dashboard | ✓ | ✗ |

---

## 🔑 Security Best Practices

### Implemented
- ✓ Password hashing with bcrypt
- ✓ JWT token-based authentication
- ✓ CORS configuration
- ✓ Protected routes
- ✓ Secure token storage
- ✓ Automatic token validation

### Recommendations for Production
- [ ] Use HTTPS/TLS
- [ ] Store secret keys in secure environment
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Enable database encryption
- [ ] Implement refresh tokens
- [ ] Add session management
- [ ] Implement account lockout on failed attempts
- [ ] Add multi-factor authentication (MFA)
- [ ] Regular security audits

---

## 📝 Usage Examples

### Login as Admin
```
Username: admin
Password: admin123
```
Redirects to `/config` page

### Login as User
```
Username: user1
Password: pass123
```
Redirects to `/editor` page

### Make API Call with Token
```javascript
const response = await api.post('/api/auth/login', {
  username: 'admin',
  password: 'admin123'
});

const { access_token } = response.data;
localStorage.setItem('token', access_token);

// Token is automatically added to subsequent requests
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in main.py or use:
python main.py --port 8001
```

**Database connection error:**
```bash
# Reinitialize database:
rm app.db
python init_db.py
```

### Frontend Issues

**CORS Error:**
- Check backend CORS configuration in `app/core/config.py`
- Ensure API URL is correct in `.env`

**Login not working:**
- Verify backend is running
- Check browser console for errors
- Confirm credentials match demo data

**Blank page:**
- Check browser dev tools (F12)
- Verify Node modules installed: `npm install`
- Clear browser cache

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/)
- [SQLAlchemy Guide](https://docs.sqlalchemy.org/)
- [Axios Docs](https://axios-http.com/)
- [React Router](https://reactrouter.com/)

---

## 📄 License

This project is open source and available under the MIT License.

---

## ✉️ Support

For issues or questions, please refer to the documentation or create an issue in the repository.
