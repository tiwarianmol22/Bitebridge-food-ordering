from flask import Blueprint
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from datetime import datetime, timedelta
from ..models.order import OrderTable
from ..models.customer import Customer
from ..models.menu import Menu
from ..models.payment import Payment
from ..extensions import db
from ..utils.helpers import success_response, error_response
from ..utils.decorators import admin_required

bp = Blueprint('admin', __name__)


@bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def dashboard():
    """Get dashboard statistics."""
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())

    # Total orders today
    orders_today = OrderTable.query.filter(
        OrderTable.order_date >= today_start
    ).count()

    # Total revenue (all completed orders)
    revenue_result = db.session.query(
        func.coalesce(func.sum(OrderTable.total_amount), 0)
    ).filter(OrderTable.status == 'Completed').scalar()
    total_revenue = float(revenue_result)

    # Revenue today
    revenue_today_result = db.session.query(
        func.coalesce(func.sum(OrderTable.total_amount), 0)
    ).filter(
        OrderTable.status == 'Completed',
        OrderTable.order_date >= today_start
    ).scalar()
    revenue_today = float(revenue_today_result)

    # Pending orders
    pending_count = OrderTable.query.filter_by(status='Pending').count()

    # Processing orders
    processing_count = OrderTable.query.filter_by(status='Processing').count()

    # Total menu items
    menu_count = Menu.query.filter_by(availability=True).count()

    # Total customers
    customer_count = Customer.query.filter_by(role='customer').count()

    # Total orders overall
    total_orders = OrderTable.query.count()

    return success_response({
        'orders_today': orders_today,
        'total_revenue': total_revenue,
        'revenue_today': revenue_today,
        'pending_orders': pending_count,
        'processing_orders': processing_count,
        'total_menu_items': menu_count,
        'total_customers': customer_count,
        'total_orders': total_orders,
    })


@bp.route('/orders', methods=['GET'])
@jwt_required()
@admin_required
def get_all_orders():
    """Get all orders with customer info (admin only)."""
    orders = OrderTable.query.order_by(OrderTable.order_date.desc()).all()
    return success_response([
        order.to_dict(include_details=True, include_customer=True)
        for order in orders
    ])


@bp.route('/customers', methods=['GET'])
@jwt_required()
@admin_required
def get_all_customers():
    """Get all customers (admin only)."""
    customers = Customer.query.order_by(Customer.created_at.desc()).all()
    return success_response([customer.to_dict() for customer in customers])
