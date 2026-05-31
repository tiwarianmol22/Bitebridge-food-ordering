from ..extensions import db, bcrypt
from datetime import datetime


class Customer(db.Model):
    """Customer model — maps to CUSTOMER table."""
    __tablename__ = 'CUSTOMER'

    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.Text)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum('customer', 'admin'), default='customer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    orders = db.relationship('OrderTable', backref='customer', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        """Hash and set the password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Verify password against hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Serialize customer to dictionary."""
        return {
            'customer_id': self.customer_id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
