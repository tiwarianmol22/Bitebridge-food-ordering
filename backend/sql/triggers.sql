-- ============================================
-- BiteBridge MySQL Triggers
-- ============================================

USE bitbridge_db;

DELIMITER $$

-- ============================================
-- TRIGGER 1: Backup order before deletion
-- Copies the order record to ORDER_BACKUP
-- before it is permanently deleted
-- ============================================
DROP TRIGGER IF EXISTS backup_deleted_order$$
CREATE TRIGGER backup_deleted_order
BEFORE DELETE ON ORDER_TABLE
FOR EACH ROW
BEGIN
    INSERT INTO ORDER_BACKUP (order_id, customer_id, order_date, status, total_amount, deleted_at)
    VALUES (OLD.order_id, OLD.customer_id, OLD.order_date, OLD.status, OLD.total_amount, NOW());
END$$

-- ============================================
-- TRIGGER 2: Auto-update ORDER_TABLE total
-- when a new ORDER_DETAILS row is inserted
-- ============================================
DROP TRIGGER IF EXISTS update_order_total_on_insert$$
CREATE TRIGGER update_order_total_on_insert
AFTER INSERT ON ORDER_DETAILS
FOR EACH ROW
BEGIN
    UPDATE ORDER_TABLE
    SET total_amount = (
        SELECT COALESCE(SUM(price * quantity), 0)
        FROM ORDER_DETAILS
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END$$

-- ============================================
-- TRIGGER 3: Prevent ordering unavailable items
-- Raises an error if the menu item is not available
-- ============================================
DROP TRIGGER IF EXISTS prevent_unavailable_item_order$$
CREATE TRIGGER prevent_unavailable_item_order
BEFORE INSERT ON ORDER_DETAILS
FOR EACH ROW
BEGIN
    DECLARE item_available BOOLEAN;
    SELECT availability INTO item_available FROM MENU WHERE menu_id = NEW.menu_id;
    IF item_available = FALSE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot order an unavailable menu item.';
    END IF;
END$$

-- ============================================
-- TRIGGER 4: Sync payment status when order
-- status is updated
-- ============================================
DROP TRIGGER IF EXISTS sync_payment_on_order_update$$
CREATE TRIGGER sync_payment_on_order_update
AFTER UPDATE ON ORDER_TABLE
FOR EACH ROW
BEGIN
    IF NEW.status = 'Processing' AND OLD.status = 'Pending' THEN
        UPDATE PAYMENT SET payment_status = 'Processing' WHERE order_id = NEW.order_id;
    END IF;
    IF NEW.status = 'Completed' THEN
        UPDATE PAYMENT SET payment_status = 'Paid' WHERE order_id = NEW.order_id;
    END IF;
    IF NEW.status = 'Canceled' THEN
        UPDATE PAYMENT SET payment_status = 'Refunded' WHERE order_id = NEW.order_id;
    END IF;
END$$

DELIMITER ;
