from ..extensions import db


class OrderDetails(db.Model):
    """Order Details model — maps to ORDER_DETAILS table."""
    __tablename__ = 'ORDER_DETAILS'

    order_detail_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('ORDER_TABLE.order_id', ondelete='CASCADE'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('MENU.menu_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    # Relationship to Menu
    menu_item = db.relationship('Menu', backref='order_details', lazy=True)

    def to_dict(self):
        """Serialize order detail to dictionary."""
        data = {
            'order_detail_id': self.order_detail_id,
            'order_id': self.order_id,
            'menu_id': self.menu_id,
            'quantity': self.quantity,
            'price': float(self.price) if self.price else 0.0,
        }
        if self.menu_item:
            data['item_name'] = self.menu_item.item_name
            data['image_url'] = self.menu_item.image_url
        return data
