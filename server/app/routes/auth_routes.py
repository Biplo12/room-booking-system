from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, get_jwt_identity
import re

auth_bp = Blueprint('auth', __name__)

def validate_password(password):
    """
    Password must:
    - Be at least 8 characters long
    - Contain at least one uppercase letter
    - Contain at least one lowercase letter
    - Contain at least one number
    - Contain at least one special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    
    if not re.search(r"[ !@#$%&'()*+,-./[\\\]^_`{|}~"+r'"]', password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is valid"

# -------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'Invalid arguments'
        }), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Username and password are required'
        }), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'Username already exists'
        }), 409

    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({
            'success': False,
            'message': message
        }), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Error creating user'
        }), 500

    return jsonify({
        'success': True,
        'message': 'User created successfully'
    }), 201

# -------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'Invalid arguments'
        }), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Username and password are required'
        }), 400

    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({
            'success': False,
            'message': 'Invalid credentials'
        }), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'data': {
            'access_token': access_token,
            'username': user.username,
            'role': user.role
        }
    }), 200

# -------
def is_admin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user and user.role == 'admin'