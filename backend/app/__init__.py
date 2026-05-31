from flask import Flask
from flask_cors import CORS
from .config import config
from .extensions import db, jwt, migrate, bcrypt


def create_app(config_name='development'):
    """Flask application factory."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    # Register blueprints
    from .routes.auth import bp as auth_bp
    from .routes.menu import bp as menu_bp
    from .routes.orders import bp as orders_bp
    from .routes.cart import bp as cart_bp
    from .routes.payment import bp as payment_bp
    from .routes.admin import bp as admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(payment_bp, url_prefix='/api/payment')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Create tables if they don't exist
    with app.app_context():
        from . import models  # noqa: F401
        db.create_all()

    return app
