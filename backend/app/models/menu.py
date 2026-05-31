from ..extensions import db


class Menu(db.Model):
    """Menu model — maps to MENU table."""
    __tablename__ = 'MENU'

    menu_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2), nullable=False)
    availability = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255))

    def to_dict(self):
        """Serialize menu item to dictionary."""
        return {
            'menu_id': self.menu_id,
            'item_name': self.item_name,
            'description': self.description,
            'category': self.category,
            'price': float(self.price) if self.price else 0.0,
            'availability': self.availability,
            'image_url': self.image_url,
        }
