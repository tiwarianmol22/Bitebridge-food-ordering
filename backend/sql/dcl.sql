-- ============================================
-- BiteBridge Data Control Language (DCL)
-- Grant/Revoke statements for MySQL users
-- ============================================

USE bitbridge_db;

-- ============================================
-- Create application user with limited privileges
-- ============================================
-- CREATE USER IF NOT EXISTS 'bitbridge_app'@'localhost' IDENTIFIED BY 'bitbridge_secure_password';

-- Grant SELECT, INSERT, UPDATE, DELETE on all tables
-- GRANT SELECT, INSERT, UPDATE, DELETE ON bitbridge_db.* TO 'bitbridge_app'@'localhost';

-- ============================================
-- Create read-only user for reporting
-- ============================================
-- CREATE USER IF NOT EXISTS 'bitbridge_readonly'@'localhost' IDENTIFIED BY 'readonly_password';

-- Grant only SELECT privileges
-- GRANT SELECT ON bitbridge_db.* TO 'bitbridge_readonly'@'localhost';

-- ============================================
-- Create admin user with full privileges
-- ============================================
-- CREATE USER IF NOT EXISTS 'bitbridge_admin'@'localhost' IDENTIFIED BY 'admin_secure_password';

-- Grant all privileges including CREATE, ALTER, DROP
-- GRANT ALL PRIVILEGES ON bitbridge_db.* TO 'bitbridge_admin'@'localhost';

-- ============================================
-- Revoke examples
-- ============================================
-- Revoke DELETE privilege from app user (if needed)
-- REVOKE DELETE ON bitbridge_db.ORDER_BACKUP FROM 'bitbridge_app'@'localhost';

-- Revoke all from a user
-- REVOKE ALL PRIVILEGES ON bitbridge_db.* FROM 'bitbridge_readonly'@'localhost';

-- Apply privilege changes
FLUSH PRIVILEGES;
