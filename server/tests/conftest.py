import sys
import pytest
from pathlib import Path
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token
import os

root_dir = str(Path(__file__).parent.parent)
sys.path.insert(0, root_dir)

from app import create_app, db
from app.models.user import User
from app.models.conference_room import ConferenceRoom
from app.models.reservation import Reservation

@pytest.fixture(scope='function')
def app():
    app = create_app('app.config.DevelopmentConfig')
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-key'
    })
    
    os.environ['FLASK_TESTING'] = 'true'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()
    
    os.environ.pop('FLASK_TESTING', None)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers():
    return {'Content-Type': 'application/json'}

@pytest.fixture
def admin_user(app):
    with app.app_context():
        user = User(
            username='admin',
            password=generate_password_hash('Admin123!'),
            role='admin'
        )
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        return user_id

@pytest.fixture
def regular_user(app):
    with app.app_context():
        user = User(
            username='user',
            password=generate_password_hash('User123!'),
            role='user'
        )
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        return user_id

@pytest.fixture
def admin_token(app, admin_user):
    with app.app_context():
        return create_access_token(identity=admin_user)

@pytest.fixture
def user_token(app, regular_user):
    with app.app_context():
        return create_access_token(identity=regular_user)

@pytest.fixture
def admin_auth_headers(auth_headers, admin_token):
    headers = auth_headers.copy()
    headers['Authorization'] = f'Bearer {admin_token}'
    return headers

@pytest.fixture
def user_auth_headers(auth_headers, user_token):
    headers = auth_headers.copy()
    headers['Authorization'] = f'Bearer {user_token}'
    return headers 