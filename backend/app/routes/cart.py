from flask import Blueprint, request, session
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.menu import Menu
from ..utils.helpers import success_response, error_response

bp = Blueprint('cart', __name__)


@bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    """Get current cart items (session-based, server-side)."""
    customer_id = str(get_jwt_identity())
    cart = session.get(f'cart_{customer_id}', [])

    # Enrich cart items with menu data
    enriched_cart = []
    total = 0.0
    for cart_item in cart:
        menu_item = Menu.query.get(cart_item['menu_id'])
        if menu_item:
            item_data = menu_item.to_dict()
            item_data['quantity'] = cart_item['quantity']
            item_data['subtotal'] = float(menu_item.price) * cart_item['quantity']
            total += item_data['subtotal']
            enriched_cart.append(item_data)

    return success_response({
        'items': enriched_cart,
        'total': round(total, 2),
        'item_count': sum(item['quantity'] for item in cart),
    })


@bp.route('/', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add an item to the cart."""
    customer_id = str(get_jwt_identity())
    data = request.get_json()
    menu_id = data.get('menu_id')
    quantity = data.get('quantity', 1)

    if not menu_id:
        return error_response('menu_id is required.', 400)

    menu_item = Menu.query.get(menu_id)
    if not menu_item:
        return error_response('Menu item not found.', 404)
    if not menu_item.availability:
        return error_response('Item is currently unavailable.', 400)

    cart = session.get(f'cart_{customer_id}', [])

    # Check if item already in cart
    for item in cart:
        if item['menu_id'] == menu_id:
            item['quantity'] += quantity
            session[f'cart_{customer_id}'] = cart
            session.modified = True
            return success_response(message=f'Updated {menu_item.item_name} quantity in cart.')

    cart.append({'menu_id': menu_id, 'quantity': quantity})
    session[f'cart_{customer_id}'] = cart
    session.modified = True

    return success_response(message=f'{menu_item.item_name} added to cart.', status_code=201)


@bp.route('/<int:menu_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(menu_id):
    """Update quantity of a cart item."""
    customer_id = str(get_jwt_identity())
    data = request.get_json()
    quantity = data.get('quantity', 1)

    cart = session.get(f'cart_{customer_id}', [])
    for item in cart:
        if item['menu_id'] == menu_id:
            if quantity <= 0:
                cart.remove(item)
            else:
                item['quantity'] = quantity
            session[f'cart_{customer_id}'] = cart
            session.modified = True
            return success_response(message='Cart updated.')

    return error_response('Item not found in cart.', 404)


@bp.route('/<int:menu_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(menu_id):
    """Remove an item from the cart."""
    customer_id = str(get_jwt_identity())
    cart = session.get(f'cart_{customer_id}', [])

    cart = [item for item in cart if item['menu_id'] != menu_id]
    session[f'cart_{customer_id}'] = cart
    session.modified = True

    return success_response(message='Item removed from cart.')


@bp.route('/', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear the entire cart."""
    customer_id = str(get_jwt_identity())
    session.pop(f'cart_{customer_id}', None)
    return success_response(message='Cart cleared.')
