from flask import jsonify


def success_response(data=None, message='Success', status_code=200):
    """Create a standardized success response."""
    response = {
        'success': True,
        'message': message,
    }
    if data is not None:
        response['data'] = data
    return jsonify(response), status_code


def error_response(message='An error occurred', status_code=400):
    """Create a standardized error response."""
    return jsonify({
        'success': False,
        'message': message,
    }), status_code


def validate_required_fields(data, fields):
    """Validate that required fields are present in the data dict."""
    missing = [f for f in fields if not data.get(f)]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    return True, None
