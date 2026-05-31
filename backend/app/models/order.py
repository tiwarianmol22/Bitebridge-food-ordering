from ..extensions import db
from datetime import datetime


class OrderTable(db.Model):
    """Order model — maps to ORDER_TABLE."""
    __tablename__ = 'ORDER_TABLE'

    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('CUSTOMER.customer_id', ondelete='CASCADE'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(
        db.Enum('Pending', 'Processing', 'Out for Delivery', 'Completed', 'Canceled'),
        default='Pending'
    )
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)

    # Relationships
    order_details = db.relationship('OrderDetails', backref='order', lazy=True, cascade='all, delete-orphan')
    payment = db.relationship('Payment', backref='order', lazy=True, uselist=False)

    def to_dict(self, include_details=False, include_customer=False):
        """Serialize order to dictionary."""
        data = {
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'status': self.status,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
        }
        if include_details:
            data['items'] = [detail.to_dict() for detail in self.order_details]
        if include_customer:
            data['customer'] = self.customer.to_dict() if self.customer else None
        if self.payment:
            data['payment'] = self.payment.to_dict()
        return data
