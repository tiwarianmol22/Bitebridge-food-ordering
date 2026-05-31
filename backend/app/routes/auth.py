from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from ..models.customer import Customer
from ..extensions import db
from ..utils.helpers import success_response, error_response, validate_required_fields

bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
    """Register a new customer."""
    data = request.get_json()
    valid, msg = validate_required_fields(data, ['name', 'email', 'password'])
    if not valid:
        return error_response(msg, 400)

    # Check if email already exists
    if Customer.query.filter_by(email=data['email']).first():
        return error_response('Email already registered.', 409)

    customer = Customer(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', ''),
        address=data.get('address', ''),
        role='customer',
    )
    customer.set_password(data['password'])

    try:
        db.session.add(customer)
        db.session.commit()

        access_token = create_access_token(identity=customer.customer_id)
        refresh_token = create_refresh_token(identity=customer.customer_id)

        return success_response({
            'customer': customer.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
        }, 'Registration successful.', 201)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Registration failed: {str(e)}', 500)


@bp.route('/login', methods=['POST'])
def login():
    """Login and receive JWT tokens."""
    data = request.get_json()
    valid, msg = validate_required_fields(data, ['email', 'password'])
    if not valid:
        return error_response(msg, 400)

    customer = Customer.query.filter_by(email=data['email']).first()
    if not customer or not customer.check_password(data['password']):
        return error_response('Invalid email or password.', 401)

    access_token = create_access_token(identity=customer.customer_id)
    refresh_token = create_refresh_token(identity=customer.customer_id)

    return success_response({
        'customer': customer.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }, 'Login successful.')


@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout (client-side token removal)."""
    return success_response(message='Logged out successfully.')


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile."""
    customer_id = get_jwt_identity()
    customer = Customer.query.get(customer_id)
    if not customer:
        return error_response('User not found.', 404)
    return success_response(customer.to_dict())


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    customer_id = get_jwt_identity()
    access_token = create_access_token(identity=customer_id)
    return success_response({'access_token': access_token}, 'Token refreshed.')


@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset (mocked — no email sent)."""
    data = request.get_json()
    email = data.get('email')
    if not email:
        return error_response('Email is required.', 400)

    customer = Customer.query.filter_by(email=email).first()
    if not customer:
        # Don't reveal if email exists — always return success
        return success_response(message='If the email exists, a reset link has been sent.')

    # In production, generate a reset token and send email
    # For this project, we just acknowledge the request
    return success_response(message='If the email exists, a reset link has been sent.')
