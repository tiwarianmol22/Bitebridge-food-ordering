from ..extensions import db
from datetime import datetime


class OrderBackup(db.Model):
    """Order Backup model — maps to ORDER_BACKUP table (trigger target)."""
    __tablename__ = 'ORDER_BACKUP'

    # No auto-increment PK — this is populated by trigger
    order_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer)
    order_date = db.Column(db.DateTime)
    status = db.Column(db.String(50))
    total_amount = db.Column(db.Numeric(10, 2))
    deleted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Serialize backup record to dictionary."""
        return {
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'status': self.status,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None,
        }
