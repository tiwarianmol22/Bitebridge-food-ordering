from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from ..models.customer import Customer


def admin_required(fn):
    """Decorator that requires the current user to be an admin."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        customer_id = get_jwt_identity()
        customer = Customer.query.get(customer_id)
        if not customer or customer.role != 'admin':
            return jsonify({
                'success': False,
                'message': 'Admin access required.'
            }), 403
        return fn(*args, **kwargs)
    return wrapper
