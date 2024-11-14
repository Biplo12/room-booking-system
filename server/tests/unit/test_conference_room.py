import json
from datetime import datetime, timedelta

def test_get_rooms(client):
    response = client.get('/api/v1/rooms')
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'items' in response.json['data']
    assert 'pagination' in response.json['data']

def test_create_room_as_admin(client, admin_auth_headers):
    data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector, Whiteboard"
    }
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 201
    assert response.json['success'] is True
    assert response.json['data']['name'] == "Test Room"

def test_create_room_unauthorized(client, user_auth_headers):
    data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector, Whiteboard"
    }
    response = client.post('/api/v1/rooms',
                          headers=user_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 403

def test_create_room_invalid_data(client, admin_auth_headers):
    data = {}
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert response.json['success'] is False

def test_create_room_validation_error(client, admin_auth_headers):
    data = {
        "name": "",  # Invalid empty name
        "capacity": "invalid",  # Invalid capacity type
        "equipment": "Projector"
    }
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert response.json['success'] is False
    assert 'errors' in response.json

def test_update_room(client, admin_auth_headers):
    # First create a room
    create_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector"
    }
    create_response = client.post('/api/v1/rooms',
                                headers=admin_auth_headers,
                                data=json.dumps(create_data))
    room_id = create_response.json['data']['id']
    
    update_data = {
        "name": "Updated Room",
        "capacity": 20
    }
    response = client.put(f'/api/v1/rooms/{room_id}',
                         headers=admin_auth_headers,
                         data=json.dumps(update_data))
    assert response.status_code == 200
    assert response.json['data']['name'] == "Updated Room"
    assert response.json['data']['capacity'] == 20

def test_update_room_unauthorized(client, user_auth_headers):
    response = client.put('/api/v1/rooms/1',
                         headers=user_auth_headers,
                         data=json.dumps({"name": "Updated"}))
    assert response.status_code == 403

def test_update_room_not_found(client, admin_auth_headers):
    response = client.put('/api/v1/rooms/999',
                         headers=admin_auth_headers,
                         data=json.dumps({"name": "Updated"}))
    assert response.status_code == 404

def test_delete_room(client, admin_auth_headers):
    create_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector"
    }
    create_response = client.post('/api/v1/rooms',
                                headers=admin_auth_headers,
                                data=json.dumps(create_data))
    room_id = create_response.json['data']['id']
    
    response = client.delete(f'/api/v1/rooms/{room_id}',
                           headers=admin_auth_headers)
    assert response.status_code == 200
    assert response.json['success'] is True

def test_delete_room_unauthorized(client, user_auth_headers):
    response = client.delete('/api/v1/rooms/1',
                           headers=user_auth_headers)
    assert response.status_code == 403

def test_check_room_availability(client):
    start_time = datetime.now() + timedelta(hours=1)
    end_time = start_time + timedelta(hours=2)
    
    response = client.get(f'/api/v1/rooms/1/availability',
                         query_string={
                             'start_time': start_time.isoformat(),
                             'end_time': end_time.isoformat()
                         })
    assert response.status_code == 200
    assert 'is_available' in response.json['data']

def test_check_availability_missing_params(client):
    response = client.get('/api/v1/rooms/1/availability')
    assert response.status_code == 400
    assert response.json['success'] is False

def test_check_availability_invalid_date_format(client):
    response = client.get('/api/v1/rooms/1/availability',
                         query_string={
                             'start_time': 'invalid-date',
                             'end_time': 'invalid-date'
                         })
    assert response.status_code == 400
    assert response.json['success'] is False