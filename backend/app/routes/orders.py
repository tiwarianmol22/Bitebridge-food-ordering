from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.order import OrderTable
from ..models.order_details import OrderDetails
from ..models.menu import Menu
from ..extensions import db
from ..utils.helpers import success_response, error_response
from ..utils.decorators import admin_required

bp = Blueprint('orders', __name__)


@bp.route('/', methods=['POST'])
@jwt_required()
def place_order():
    """Place a new order with items — uses transaction for atomicity."""
    customer_id = get_jwt_identity()
    data = request.get_json()
    items = data.get('items', [])

    if not items:
        return error_response('Order must contain at least one item.', 400)

    try:
        # Calculate total and validate items
        total = 0.0
        order_items = []

        for item_data in items:
            menu_item = Menu.query.get(item_data.get('menu_id'))
            if not menu_item:
                return error_response(f"Menu item {item_data.get('menu_id')} not found.", 404)
            if not menu_item.availability:
                return error_response(f"'{menu_item.item_name}' is currently unavailable.", 400)

            quantity = item_data.get('quantity', 1)
            item_total = float(menu_item.price) * quantity
            total += item_total

            order_items.append({
                'menu_id': menu_item.menu_id,
                'quantity': quantity,
                'price': float(menu_item.price),
            })

        # Create order in a transaction
        order = OrderTable(
            customer_id=customer_id,
            total_amount=total,
            status='Pending',
        )
        db.session.add(order)
        db.session.flush()  # Get the order_id before committing

        # Add order details
        for item_data in order_items:
            detail = OrderDetails(
                order_id=order.order_id,
                menu_id=item_data['menu_id'],
                quantity=item_data['quantity'],
                price=item_data['price'],
            )
            db.session.add(detail)

        db.session.commit()

        return success_response(
            order.to_dict(include_details=True),
            'Order placed successfully.',
            201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to place order: {str(e)}', 500)


@bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """Get all orders for the current customer."""
    customer_id = get_jwt_identity()
    orders = OrderTable.query.filter_by(customer_id=customer_id)\
        .order_by(OrderTable.order_date.desc()).all()
    return success_response([order.to_dict(include_details=True) for order in orders])


@bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get a specific order with details."""
    customer_id = get_jwt_identity()
    order = OrderTable.query.get(order_id)

    if not order:
        return error_response('Order not found.', 404)

    # Customers can only see their own orders (admin can see all)
    from ..models.customer import Customer
    customer = Customer.query.get(customer_id)
    if order.customer_id != customer_id and customer.role != 'admin':
        return error_response('Access denied.', 403)

    return success_response(order.to_dict(include_details=True, include_customer=True))


@bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_order_status(order_id):
    """Update order status (admin only) — triggers fire here."""
    order = OrderTable.query.get(order_id)
    if not order:
        return error_response('Order not found.', 404)

    data = request.get_json()
    new_status = data.get('status')
    valid_statuses = ['Pending', 'Processing', 'Out for Delivery', 'Completed', 'Canceled']

    if new_status not in valid_statuses:
        return error_response(f'Invalid status. Must be one of: {", ".join(valid_statuses)}', 400)

    try:
        order.status = new_status
        db.session.commit()
        return success_response(order.to_dict(include_details=True), f'Order status updated to {new_status}.')
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update status: {str(e)}', 500)
