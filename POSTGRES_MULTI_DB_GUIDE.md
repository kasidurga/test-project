# PostgreSQL Multi-Database Connection Guide

## 📋 Overview

This application now supports connecting to multiple PostgreSQL databases. Connection configurations are stored in SQLite, and users can select which database to query from when executing SQL queries.

## 🏗️ Architecture

### Data Flow

```
1. Admin adds PostgreSQL connections via /config page
   ↓
2. Connection info stored in SQLite (db_configs table)
   ↓
3. User selects a database from dropdown on /editor or /query page
   ↓
4. Query submitted with selected config_id
   ↓
5. Backend retrieves config from SQLite
   ↓
6. Backend creates connection to selected PostgreSQL database
   ↓
7. Query executed against selected PostgreSQL database
   ↓
8. Results returned to frontend
```

## 🔧 Backend Configuration

### Database Connections Table (SQLite)

```sql
CREATE TABLE db_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,          -- Display name (e.g., "Production DB")
    host VARCHAR(255) NOT NULL,           -- PostgreSQL host (e.g., "localhost")
    port INTEGER NOT NULL,                -- PostgreSQL port (e.g., 5432)
    database VARCHAR(100) NOT NULL,       -- Database name
    username VARCHAR(100) NOT NULL,       -- Database user
    password VARCHAR(255) NOT NULL,       -- Database password (encrypted in production)
    created_by INTEGER NOT NULL,          -- Admin user ID who created it
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

### API Endpoints

#### 1. Database Configuration Management (Admin Only)

**Create DB Config**
```bash
POST /admin/db-configs
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Production Database",
    "host": "prod-db.example.com",
    "port": 5432,
    "database": "production_db",
    "username": "prod_user",
    "password": "secure_password"
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Production Database",
    "host": "prod-db.example.com",
    "port": 5432,
    "database": "production_db",
    "username": "prod_user",
    "password": "secure_password",
    "created_by": 1,
    "created_at": "2026-04-07T10:00:00",
    "updated_at": "2026-04-07T10:00:00"
}
```

**Get All DB Configs**
```bash
GET /admin/db-configs?skip=0&limit=100
Authorization: Bearer <token>
```

**Get Specific DB Config**
```bash
GET /admin/db-configs/{config_id}
Authorization: Bearer <token>
```

**Update DB Config**
```bash
PUT /admin/db-configs/{config_id}
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Name",
    "port": 5433
}
```

**Delete DB Config**
```bash
DELETE /admin/db-configs/{config_id}
Authorization: Bearer <token>
```

#### 2. Query Execution with Database Selection

**Execute Query Against Selected Database**
```bash
POST /api/query/run
Authorization: Bearer <token>
Content-Type: application/json

{
    "query": "SELECT * FROM users LIMIT 10",
    "config_id": 1
}
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-01-01T00:00:00"
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "created_at": "2026-01-02T00:00:00"
    }
]
```

## 🖥️ Frontend Usage

### Configuration Page (/config)

**Admin Only**

1. Navigate to: http://localhost:3000/config
2. Click "Add New Configuration"
3. Fill in the form:
   - **Configuration Name**: Display name for the database
   - **Host**: PostgreSQL server hostname or IP
   - **Port**: PostgreSQL port (default: 5432)
   - **Database**: Database name
   - **Username**: Database user
   - **Password**: Database password
4. Click "Save Configuration"
5. View all configured databases
6. Edit or delete existing configurations

### Query Editor Page (/editor)

**All Authenticated Users**

1. Navigate to: http://localhost:3000/editor
2. **Select PostgreSQL Database**: Choose from dropdown
3. **Write SQL Query**: Enter your SQL in the textarea
4. **Execute Query**: Click "Execute Query" button
5. **View Results**: Results display in table format below

### Advanced Query Editor Page (/query)

**All Authenticated Users**

1. Navigate to: http://localhost:3000/query
2. **Select PostgreSQL Database**: Choose from dropdown
3. **Write SQL Query**: Enter your SQL in the textarea
4. **Execute Query**: Click "Execute Query" button
5. **View Results**: 
   - Grid view: Displays results in a table
   - JSON view: Copy button to copy results as JSON
6. **Query History**: Click previous queries to reuse them

## 📝 Example Workflows

### Workflow 1: Setup and Query

**Step 1: Admin Setup**
```
1. Login as admin (admin/admin123)
2. Go to http://localhost:3000/config
3. Add new configuration:
   - Name: "Local Dev DB"
   - Host: "localhost"
   - Port: 5432
   - Database: "myapp_dev"
   - Username: "dev_user"
   - Password: "dev_password"
4. Click Submit
```

**Step 2: User Query**
```
1. Login as regular user (user1/pass123)
2. Go to http://localhost:3000/editor
3. Select "Local Dev DB" from dropdown
4. Enter query: SELECT * FROM users
5. Click Execute Query
6. View results
```

### Workflow 2: Multiple Database Access

**Admin Setup**
```
Add multiple database configurations:
1. Production DB
2. Staging DB
3. Development DB
4. Testing DB
```

**User Access**
```
Users can switch between databases using the dropdown
and query each one independently.
```

## 🔒 Security Considerations

### Current Implementation
- Passwords stored in SQLite (unencrypted for demo)
- Only admin can create/edit/delete database configurations
- Connections are authenticated with provided credentials

### Production Recommendations
1. **Encrypt Passwords**: Use encryption for stored passwords
   ```python
   from cryptography.fernet import Fernet
   
   # Encrypt password before storing
   cipher = Fernet(key)
   encrypted_password = cipher.encrypt(password.encode())
   ```

2. **Use Environment Variables**: Store credentials in environment
   ```bash
   export DB_PROD_HOST=prod-db.example.com
   export DB_PROD_USER=prod_user
   ```

3. **Connection Pooling**: Reuse connections for performance
   ```python
   from sqlalchemy.pool import QueuePool
   
   engine = create_engine(
       db_url,
       poolclass=QueuePool,
       pool_size=10,
       max_overflow=20
   )
   ```

4. **SSL/TLS**: Use encrypted connections to PostgreSQL
   ```python
   postgres_url = f"postgresql://{user}:{password}@{host}:{port}/{db}?sslmode=require"
   ```

5. **Query Validation**: Implement query inspection to prevent dangerous operations
   ```python
   dangerous_keywords = ['DROP', 'TRUNCATE', 'DELETE', 'ALTER']
   if any(kw in query.upper() for kw in dangerous_keywords):
       raise HTTPException(status_code=403, detail="Dangerous operation not allowed")
   ```

## 📊 Database Schema

### db_configs Table
```
Column         | Type        | Constraints        | Description
---------------|-------------|-------------------|------------------
id             | INTEGER     | PRIMARY KEY       | Unique identifier
name           | VARCHAR(100)| NOT NULL          | Configuration name
host           | VARCHAR(255)| NOT NULL          | PostgreSQL host
port           | INTEGER     | NOT NULL          | PostgreSQL port
database       | VARCHAR(100)| NOT NULL          | Database name
username       | VARCHAR(100)| NOT NULL          | Database user
password       | VARCHAR(255)| NOT NULL          | Database password
created_by     | INTEGER     | FOREIGN KEY       | Admin user who created
created_at     | DATETIME    | DEFAULT NOW()     | Creation timestamp
updated_at     | DATETIME    | DEFAULT NOW()     | Last update timestamp
```

## 🧪 Testing Examples

### Test 1: Add Database Configuration
```bash
curl -X POST http://localhost:8000/admin/db-configs \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test DB",
    "host": "localhost",
    "port": 5432,
    "database": "test_db",
    "username": "test_user",
    "password": "test_pass"
  }'
```

### Test 2: List All Configurations
```bash
curl -X GET http://localhost:8000/admin/db-configs \
  -H "Authorization: Bearer <admin_token>"
```

### Test 3: Execute Query Against Selected Database
```bash
curl -X POST http://localhost:8000/api/query/run \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM users LIMIT 5",
    "config_id": 1
  }'
```

## ⚙️ Configuration

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to PostgreSQL database"
**Cause**: Database configuration is incorrect or PostgreSQL is not running
**Solution**:
1. Verify PostgreSQL is running
2. Check connection parameters: host, port, database name
3. Verify username and password are correct
4. Test connection manually: `psql -h <host> -U <user> -d <database>`

### Issue: "No databases configured"
**Cause**: Admin hasn't added any database configurations yet
**Solution**:
1. Login as admin
2. Go to http://localhost:3000/config
3. Add a database configuration

### Issue: "Query execution failed"
**Cause**: Invalid SQL or query error
**Solution**:
1. Check SQL syntax
2. Verify table/column names exist in the PostgreSQL database
3. Check PostgreSQL server logs for errors

### Issue: "Access denied - Admin access required"
**Cause**: Trying to configure databases as a regular user
**Solution**:
1. Ask your admin to configure databases
2. Or login as admin to configure

## 📚 Related Documentation

- [Main README](./README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [OpenAPI Specification](./backend/openapi.json)

## 🚀 Next Steps

1. Test with your actual PostgreSQL databases
2. Implement password encryption
3. Add query validation and sanitization
4. Set up monitoring and logging
5. Implement database connection testing endpoint
6. Add query result export (CSV, JSON)
7. Add query scheduling/automation
