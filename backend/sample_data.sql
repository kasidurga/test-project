-- Sample data insertion queries
-- Use these to insert test data into the users table

-- Insert Admin User
-- Password: admin123
INSERT INTO users (username, email, hashed_password, role, is_active)
VALUES (
    'admin',
    'admin@example.com',
    '$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    'admin',
    1
);

-- Insert Regular User 1
-- Password: pass123
INSERT INTO users (username, email, hashed_password, role, is_active)
VALUES (
    'user1',
    'user1@example.com',
    '$2b$12$xyz1234567890xyz1234567890xyz1234567890xyz1234567890xyz',
    'user',
    1
);

-- Insert Regular User 2
-- Password: pass123
INSERT INTO users (username, email, hashed_password, role, is_active)
VALUES (
    'user2',
    'user2@example.com',
    '$2b$12$abc123def456abc123def456abc123def456abc123def456abc123d',
    'user',
    1
);

-- View all users
SELECT id, username, email, role, is_active, created_at FROM users;

-- Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Find user by username
SELECT * FROM users WHERE username = 'admin';

-- Check active users only
SELECT * FROM users WHERE is_active = 1;
