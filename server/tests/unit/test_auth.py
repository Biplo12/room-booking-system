import json
from app.routes.auth_routes import validate_password

def test_validate_password_valid():
    password = "Test123!@#"
    is_valid, message = validate_password(password)
    assert is_valid is True
    assert message == "Password is valid"

def test_validate_password_too_short():
    password = "Test1!"
    is_valid, message = validate_password(password)
    assert is_valid is False
    assert "at least 8 characters" in message

def test_register_endpoint(client, auth_headers):
    data = {
        "username": "testuser",
        "password": "Test123!@#"
    }
    response = client.post('/api/v1/auth/register', 
                          headers=auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 201
    assert response.json['success'] is True

def test_register_existing_user(client, auth_headers, regular_user):
    data = {
        "username": "user",
        "password": "Test123!@#"
    }
    response = client.post('/api/v1/auth/register', 
                          headers=auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 409
    assert response.json['success'] is False

def test_login_success(client, auth_headers, regular_user):
    data = {
        "username": "user",
        "password": "User123!"
    }
    response = client.post('/api/v1/auth/login',
                          headers=auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'access_token' in response.json['data'] 