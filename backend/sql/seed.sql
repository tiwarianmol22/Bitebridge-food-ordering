-- ============================================
-- BiteBridge Seed Data (DML)
-- Sample data for testing
-- ============================================

USE bitbridge_db;

-- ============================================
-- CUSTOMERS (password hash for 'password123')
-- Hash generated with bcrypt
-- ============================================
INSERT INTO CUSTOMER (name, phone, email, address, password_hash, role) VALUES
('Admin User', '9999999999', 'admin@bitbridge.com', '1 Restaurant Ave, Food City', '$2b$12$LQv3c1yqBo9SkvXS7QTJPOm0wG3FJG0d0Gm0D0P5bGJ8fYBzT9zq6', 'admin'),
('John Doe', '1234567890', 'john@gmail.com', '123 Main St, Apartment 4B', '$2b$12$LQv3c1yqBo9SkvXS7QTJPOm0wG3FJG0d0Gm0D0P5bGJ8fYBzT9zq6', 'customer'),
('Jane Smith', '9876543210', 'jane@gmail.com', '456 Oak St, Suite 201', '$2b$12$LQv3c1yqBo9SkvXS7QTJPOm0wG3FJG0d0Gm0D0P5bGJ8fYBzT9zq6', 'customer'),
('Alice Brown', '5551234567', 'alice@gmail.com', '789 Pine St', '$2b$12$LQv3c1yqBo9SkvXS7QTJPOm0wG3FJG0d0Gm0D0P5bGJ8fYBzT9zq6', 'customer'),
('Bob White', '1112223333', 'bob@gmail.com', '321 Maple St', '$2b$12$LQv3c1yqBo9SkvXS7QTJPOm0wG3FJG0d0Gm0D0P5bGJ8fYBzT9zq6', 'customer'),
('Charlie Black', '4445556666', 'charlie@gmail.com', '654 Birch St', '$2b$12$LQv3c1yqBo9SkvXS7QTJPOm0wG3FJG0d0Gm0D0P5bGJ8fYBzT9zq6', 'customer');

-- ============================================
-- MENU ITEMS
-- ============================================
INSERT INTO MENU (item_name, description, category, price, availability, image_url) VALUES
-- Fast Food
('Classic Smash Burger', 'Double smashed patty with American cheese, caramelized onions, pickles, and secret sauce on a brioche bun', 'Fast Food', 12.99, TRUE, '/images/burger.jpg'),
('Truffle Fries', 'Hand-cut fries tossed in truffle oil, parmesan, and fresh herbs', 'Fast Food', 8.49, TRUE, '/images/fries.jpg'),
('Crispy Chicken Sandwich', 'Buttermilk fried chicken with slaw, pickles, and spicy mayo on a toasted bun', 'Fast Food', 11.99, TRUE, '/images/chicken-sandwich.jpg'),
('Loaded Nachos', 'Tortilla chips with queso, jalapeños, guacamole, sour cream, and pico de gallo', 'Fast Food', 10.99, TRUE, '/images/nachos.jpg'),

-- Italian
('Margherita Pizza', 'San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil on hand-tossed dough', 'Italian', 14.99, TRUE, '/images/pizza.jpg'),
('Fettuccine Alfredo', 'House-made fettuccine in a rich parmesan cream sauce with cracked black pepper', 'Italian', 13.49, TRUE, '/images/pasta.jpg'),
('Bruschetta', 'Grilled sourdough topped with diced tomatoes, fresh basil, garlic, and balsamic glaze', 'Italian', 7.99, TRUE, '/images/bruschetta.jpg'),
('Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa', 'Italian', 8.99, TRUE, '/images/tiramisu.jpg'),

-- Healthy
('Quinoa Power Bowl', 'Quinoa, roasted sweet potato, avocado, chickpeas, kale, and tahini dressing', 'Healthy', 12.49, TRUE, '/images/bowl.jpg'),
('Grilled Salmon Salad', 'Mixed greens with grilled Atlantic salmon, cherry tomatoes, cucumber, and citrus vinaigrette', 'Healthy', 15.99, TRUE, '/images/salad.jpg'),
('Acai Smoothie Bowl', 'Blended acai berry topped with granola, banana, strawberry, and honey drizzle', 'Healthy', 9.99, TRUE, '/images/acai.jpg'),

-- Beverages
('Espresso', 'Double shot of premium single-origin espresso', 'Beverages', 3.99, TRUE, '/images/espresso.jpg'),
('Mango Lassi', 'Creamy yogurt blended with sweet Alphonso mango and cardamom', 'Beverages', 5.49, TRUE, '/images/lassi.jpg'),
('Fresh Lemonade', 'Hand-squeezed lemonade with mint and a touch of honey', 'Beverages', 4.49, TRUE, '/images/lemonade.jpg'),
('Iced Matcha Latte', 'Premium Japanese matcha whisked with oat milk over ice', 'Beverages', 5.99, TRUE, '/images/matcha.jpg');

-- ============================================
-- SAMPLE ORDERS
-- ============================================
INSERT INTO ORDER_TABLE (customer_id, order_date, status, total_amount) VALUES
(2, '2025-03-20 12:30:00', 'Completed', 34.47),
(3, '2025-03-21 14:15:00', 'Completed', 28.48),
(4, '2025-03-22 18:45:00', 'Processing', 27.48),
(5, '2025-03-23 11:00:00', 'Canceled', 14.99),
(2, '2025-03-24 19:30:00', 'Pending', 41.46);

-- ============================================
-- ORDER DETAILS
-- ============================================
INSERT INTO ORDER_DETAILS (order_id, menu_id, quantity, price) VALUES
(1, 1, 1, 12.99),
(1, 2, 1, 8.49),
(1, 12, 1, 3.99),
(2, 5, 1, 14.99),
(2, 6, 1, 13.49),
(3, 9, 1, 12.49),
(3, 10, 1, 15.99),
(4, 5, 1, 14.99),
(5, 1, 2, 12.99),
(5, 2, 1, 8.49),
(5, 14, 1, 4.49);

-- ============================================
-- PAYMENTS
-- ============================================
INSERT INTO PAYMENT (order_id, payment_date, payment_method, payment_status) VALUES
(1, '2025-03-20 12:30:00', 'Credit Card', 'Paid'),
(2, '2025-03-21 14:15:00', 'UPI', 'Paid'),
(3, '2025-03-22 18:45:00', 'Debit Card', 'Processing'),
(4, '2025-03-23 11:00:00', 'PayPal', 'Refunded'),
(5, '2025-03-24 19:30:00', 'Credit Card', 'Pending');
