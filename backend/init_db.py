"""Database initialization script - creates tables and adds sample data."""
import sqlite3
from pathlib import Path
from app.core.security import get_password_hash

# Database file path
DB_FILE = Path(__file__).parent / "app.db"


def init_database():
    """Initialize database with tables and sample data."""
    conn = sqlite3.connect(str(DB_FILE))
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'user',
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create db_configs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS db_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            host VARCHAR(255) NOT NULL,
            port INTEGER NOT NULL,
            database VARCHAR(100) NOT NULL,
            username VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_by INTEGER NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    ''')
    
    # Insert sample users (if they don't exist)
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
    
    for user in sample_users:
        cursor.execute(
            'SELECT id FROM users WHERE username = ?',
            (user['username'],)
        )
        if not cursor.fetchone():
            hashed_password = get_password_hash(user['password'])
            cursor.execute(
                '''INSERT INTO users (username, email, hashed_password, role)
                   VALUES (?, ?, ?, ?)''',
                (user['username'], user['email'], hashed_password, user['role'])
            )
            print(f"✓ Created user: {user['username']} (role: {user['role']}) - hash: {hashed_password}")
            # Test verification
            from app.core.security import verify_password
            if verify_password(user['password'], hashed_password):
                print(f"✓ Verification successful for {user['username']}")
            else:
                print(f"✗ Verification failed for {user['username']}")
        else:
            print(f"✓ User already exists: {user['username']}")
    
    conn.commit()
    conn.close()
    print(f"\n✓ Database initialized at: {DB_FILE}")


if __name__ == "__main__":
    init_database()
