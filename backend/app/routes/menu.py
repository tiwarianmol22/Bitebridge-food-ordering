from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ..models.menu import Menu
from ..extensions import db
from ..utils.helpers import success_response, error_response, validate_required_fields
from ..utils.decorators import admin_required

bp = Blueprint('menu', __name__)


@bp.route('/', methods=['GET'])
def get_menu():
    """Get all available menu items, with optional category filter."""
    category = request.args.get('category')

    query = Menu.query.filter_by(availability=True)
    if category and category != 'All':
        query = query.filter_by(category=category)

    items = query.order_by(Menu.category, Menu.item_name).all()
    return success_response([item.to_dict() for item in items])


@bp.route('/all', methods=['GET'])
@jwt_required()
@admin_required
def get_all_menu():
    """Get all menu items including unavailable (admin only)."""
    items = Menu.query.order_by(Menu.category, Menu.item_name).all()
    return success_response([item.to_dict() for item in items])


@bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all unique categories."""
    categories = db.session.query(Menu.category).distinct().all()
    category_list = [c[0] for c in categories if c[0]]
    return success_response(category_list)


@bp.route('/<int:menu_id>', methods=['GET'])
def get_menu_item(menu_id):
    """Get a single menu item by ID."""
    item = Menu.query.get(menu_id)
    if not item:
        return error_response('Menu item not found.', 404)
    return success_response(item.to_dict())


@bp.route('/', methods=['POST'])
@jwt_required()
@admin_required
def create_menu_item():
    """Add a new menu item (admin only)."""
    data = request.get_json()
    valid, msg = validate_required_fields(data, ['item_name', 'price', 'category'])
    if not valid:
        return error_response(msg, 400)

    item = Menu(
        item_name=data['item_name'],
        description=data.get('description', ''),
        category=data['category'],
        price=data['price'],
        availability=data.get('availability', True),
        image_url=data.get('image_url', ''),
    )

    try:
        db.session.add(item)
        db.session.commit()
        return success_response(item.to_dict(), 'Menu item created.', 201)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create item: {str(e)}', 500)


@bp.route('/<int:menu_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_menu_item(menu_id):
    """Update an existing menu item (admin only)."""
    item = Menu.query.get(menu_id)
    if not item:
        return error_response('Menu item not found.', 404)

    data = request.get_json()
    item.item_name = data.get('item_name', item.item_name)
    item.description = data.get('description', item.description)
    item.category = data.get('category', item.category)
    item.price = data.get('price', item.price)
    item.availability = data.get('availability', item.availability)
    item.image_url = data.get('image_url', item.image_url)

    try:
        db.session.commit()
        return success_response(item.to_dict(), 'Menu item updated.')
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update item: {str(e)}', 500)


@bp.route('/<int:menu_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_menu_item(menu_id):
    """Soft-delete a menu item by setting availability to False (admin only)."""
    item = Menu.query.get(menu_id)
    if not item:
        return error_response('Menu item not found.', 404)

    item.availability = False
    try:
        db.session.commit()
        return success_response(item.to_dict(), 'Menu item removed from availability.')
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to delete item: {str(e)}', 500)
