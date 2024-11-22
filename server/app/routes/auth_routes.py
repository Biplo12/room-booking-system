from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
import re
import sentry_sdk
from typing import Tuple

auth_bp = Blueprint('auth', __name__)

def validate_password(password: str) -> Tuple[bool, str]:
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    with sentry_sdk.start_span(op="http.server", description="register_user"):
        try:
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

            with sentry_sdk.start_span(op="db.query", description="check_existing_user"):
                if User.query.filter_by(username=username).first():
                    return jsonify({
                        'success': False,
                        'message': 'Username already exists'
                    }), 409

            with sentry_sdk.start_span(op="validation", description="validate_password"):
                is_valid, message = validate_password(password)
                if not is_valid:
                    return jsonify({
                        'success': False,
                        'message': message
                    }), 400

            with sentry_sdk.start_span(op="db.write", description="create_user"):
                hashed_password = generate_password_hash(password)
                user = User(username=username, password=hashed_password)
                db.session.add(user)
                db.session.commit()

            return jsonify({
                'success': True,
                'message': 'User registered successfully'
            }), 201

        except Exception as e:
            sentry_sdk.capture_exception(e)
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error registering user'
            }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    with sentry_sdk.start_span(op="http.server", description="login_user"):
        try:
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

            with sentry_sdk.start_span(op="db.query", description="fetch_user"):
                user = User.query.filter_by(username=username).first()
                
                if not user or not check_password_hash(user.password, password):
                    return jsonify({
                        'success': False,
                        'message': 'Invalid credentials'
                    }), 401

            with sentry_sdk.start_span(op="auth.token", description="create_token"):
                access_token = create_access_token(identity=user.id)

            return jsonify({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'role': user.role
                    },
                    'access_token': access_token,
                }
            }), 200

        except Exception as e:
            sentry_sdk.capture_exception(e)
            return jsonify({
                'success': False,
                'message': 'Error during login'
            }), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    with sentry_sdk.start_span(op="http.server", description="verify_token"):
        try:
            with sentry_sdk.start_span(op="db.query", description="fetch_user"):
                user_id = get_jwt_identity()
                user = User.query.get(user_id)
                
                if not user:
                    return jsonify({
                        'success': False,
                        'message': 'User not found'
                    }), 404

            return jsonify({
                'success': True,
                'message': 'Token is valid',
                'data': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role
                }
            }), 200

        except Exception as e:
            sentry_sdk.capture_exception(e)
            return jsonify({
                'success': False,
                'message': 'Error verifying token'
            }), 500

@auth_bp.route('/check-admin', methods=['GET'])
@jwt_required()
def check_admin():
    with sentry_sdk.start_span(op="http.server", description="check_admin_access"):
        try:
            with sentry_sdk.start_span(op="db.query", description="fetch_user"):
                user_id = get_jwt_identity()
                user = User.query.get(user_id)
                
                if not user:
                    return jsonify({
                        'success': False,
                        'message': 'User not found'
                    }), 404

            return jsonify({
                'success': True,
                'message': 'Admin check successful',
                'data': {
                    'isAdmin': user.role == 'admin'
                }
            }), 200

        except Exception as e:
            sentry_sdk.capture_exception(e)
            return jsonify({
                'success': False,
                'message': 'Error checking admin status'
            }), 500

def is_admin():
    with sentry_sdk.start_span(op="auth.check", description="check_admin"):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            return user and user.role == 'admin'
        except Exception as e:
            sentry_sdk.capture_exception(e)
            return False