from ..extensions import db
from datetime import datetime


class Payment(db.Model):
    """Payment model — maps to PAYMENT table."""
    __tablename__ = 'PAYMENT'

    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('ORDER_TABLE.order_id'), nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_method = db.Column(
        db.Enum('Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery', 'PayPal'),
        nullable=False
    )
    payment_status = db.Column(
        db.Enum('Pending', 'Processing', 'Paid', 'Refunded', 'Failed'),
        default='Pending'
    )

    def to_dict(self):
        """Serialize payment to dictionary."""
        return {
            'payment_id': self.payment_id,
            'order_id': self.order_id,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
        }
