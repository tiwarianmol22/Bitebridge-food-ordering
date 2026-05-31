-- ============================================
-- BiteBridge Database Schema (DDL)
-- Online Food Ordering System
-- ============================================

CREATE DATABASE IF NOT EXISTS bitbridge_db;
USE bitbridge_db;

-- ============================================
-- TABLE 1: CUSTOMER
-- ============================================
CREATE TABLE IF NOT EXISTS CUSTOMER (
    customer_id   INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    phone         VARCHAR(20),
    email         VARCHAR(100) UNIQUE NOT NULL,
    address       TEXT,
    password_hash VARCHAR(256) NOT NULL,
    role          ENUM('customer', 'admin') DEFAULT 'customer',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 2: ORDER_TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ORDER_TABLE (
    order_id      INT AUTO_INCREMENT PRIMARY KEY,
    customer_id   INT NOT NULL,
    order_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status        ENUM('Pending', 'Processing', 'Out for Delivery', 'Completed', 'Canceled') DEFAULT 'Pending',
    total_amount  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE
);

-- ============================================
-- TABLE 3: MENU
-- ============================================
CREATE TABLE IF NOT EXISTS MENU (
    menu_id       INT AUTO_INCREMENT PRIMARY KEY,
    item_name     VARCHAR(100) NOT NULL,
    description   TEXT,
    category      VARCHAR(50),
    price         DECIMAL(10,2) NOT NULL,
    availability  BOOLEAN DEFAULT TRUE,
    image_url     VARCHAR(255)
);

-- ============================================
-- TABLE 4: ORDER_DETAILS
-- ============================================
CREATE TABLE IF NOT EXISTS ORDER_DETAILS (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    menu_id         INT NOT NULL,
    quantity        INT NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDER_TABLE(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES MENU(menu_id)
);

-- ============================================
-- TABLE 5: PAYMENT
-- ============================================
CREATE TABLE IF NOT EXISTS PAYMENT (
    payment_id      INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method  ENUM('Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery', 'PayPal') NOT NULL,
    payment_status  ENUM('Pending', 'Processing', 'Paid', 'Refunded', 'Failed') DEFAULT 'Pending',
    FOREIGN KEY (order_id) REFERENCES ORDER_TABLE(order_id)
);

-- ============================================
-- TABLE 6: ORDER_BACKUP (Trigger Target)
-- ============================================
CREATE TABLE IF NOT EXISTS ORDER_BACKUP (
    order_id      INT,
    customer_id   INT,
    order_date    TIMESTAMP NULL,
    status        VARCHAR(50),
    total_amount  DECIMAL(10,2),
    deleted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
