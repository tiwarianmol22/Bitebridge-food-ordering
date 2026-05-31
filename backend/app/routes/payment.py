from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.payment import Payment
from ..models.order import OrderTable
from ..extensions import db
from ..utils.helpers import success_response, error_response, validate_required_fields

bp = Blueprint('payment', __name__)


@bp.route('/', methods=['POST'])
@jwt_required()
def create_payment():
    """Create a payment record for an order."""
    data = request.get_json()
    valid, msg = validate_required_fields(data, ['order_id', 'payment_method'])
    if not valid:
        return error_response(msg, 400)

    # Verify order exists and belongs to current user
    customer_id = get_jwt_identity()
    order = OrderTable.query.get(data['order_id'])
    if not order:
        return error_response('Order not found.', 404)
    if order.customer_id != customer_id:
        return error_response('Access denied.', 403)

    # Check if payment already exists for this order
    existing = Payment.query.filter_by(order_id=data['order_id']).first()
    if existing:
        return error_response('Payment already exists for this order.', 409)

    valid_methods = ['Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery', 'PayPal']
    if data['payment_method'] not in valid_methods:
        return error_response(f'Invalid payment method. Must be one of: {", ".join(valid_methods)}', 400)

    payment = Payment(
        order_id=data['order_id'],
        payment_method=data['payment_method'],
        payment_status='Pending',
    )

    try:
        db.session.add(payment)
        db.session.commit()
        return success_response(payment.to_dict(), 'Payment created.', 201)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create payment: {str(e)}', 500)


@bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_payment(order_id):
    """Get payment status for an order."""
    payment = Payment.query.filter_by(order_id=order_id).first()
    if not payment:
        return error_response('Payment not found.', 404)
    return success_response(payment.to_dict())


@bp.route('/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(payment_id):
    """Update payment status (simulate payment processing)."""
    payment = Payment.query.get(payment_id)
    if not payment:
        return error_response('Payment not found.', 404)

    data = request.get_json()
    new_status = data.get('payment_status')
    valid_statuses = ['Pending', 'Processing', 'Paid', 'Refunded', 'Failed']

    if new_status and new_status not in valid_statuses:
        return error_response(f'Invalid status. Must be one of: {", ".join(valid_statuses)}', 400)

    try:
        if new_status:
            payment.payment_status = new_status
        db.session.commit()
        return success_response(payment.to_dict(), 'Payment updated.')
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update payment: {str(e)}', 500)
