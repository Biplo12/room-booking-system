import json
from datetime import datetime, timedelta

def test_get_rooms(client):
    response = client.get('/api/v1/rooms')
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'data' in response.json

def test_create_room_as_admin(client, admin_auth_headers):
    data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector, Whiteboard",
        "location": "Floor 1, Building A",
        "image_url": "https://example.com/image.jpg"
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
        "equipment": "Projector, Whiteboard",
        "location": "Floor 1, Building A",
        "image_url": "https://example.com/image.jpg"
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
        "name": "",
        "capacity": "invalid",
        "equipment": "Projector",
        "location": "Floor 1, Building A",
        "image_url": "https://example.com/image.jpg"
    }
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert response.json['success'] is False
    assert 'errors' in response.json

def test_update_room(client, admin_auth_headers):
    create_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1, Building A",
        "image_url": "https://example.com/image.jpg"
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
        "equipment": "Projector",
        "location": "Floor 1, Building A",
        "image_url": "https://example.com/image.jpg"
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

def test_check_room_availability(client, admin_auth_headers, user_auth_headers):
    room_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1",
        "image_url": "https://example.com/image.jpg"
    }
    create_response = client.post('/api/v1/rooms',
                                headers=admin_auth_headers,
                                data=json.dumps(room_data))
    assert create_response.status_code == 201
    room_id = create_response.json['data']['id']
    
    start_time = datetime.now() + timedelta(hours=1)
    end_time = start_time + timedelta(hours=2)
    
    response = client.get(
        f'/api/v1/rooms/{room_id}/availability',
        headers=user_auth_headers,
        query_string={
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat()
        }
    )
    assert response.status_code == 200
    assert 'is_available' in response.json['data']

def test_check_availability_missing_params(client, admin_auth_headers, user_auth_headers):
    """Test availability check with missing parameters"""
    room_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1",
        "image_url": "https://example.com/image.jpg"
    }
    create_response = client.post('/api/v1/rooms',
                                headers=admin_auth_headers,
                                data=json.dumps(room_data))
    room_id = create_response.json['data']['id']
    
    response = client.get(
        f'/api/v1/rooms/{room_id}/availability',
        headers=user_auth_headers
    )
    assert response.status_code == 400
    assert 'Start time and end time are required' in response.json['message']

def test_check_availability_invalid_dates(client, admin_auth_headers, user_auth_headers):
    """Test availability check with invalid date format"""
    room_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1",
        "image_url": "https://example.com/image.jpg"
    }
    create_response = client.post('/api/v1/rooms',
                                headers=admin_auth_headers,
                                data=json.dumps(room_data))
    room_id = create_response.json['data']['id']
    
    response = client.get(
        f'/api/v1/rooms/{room_id}/availability',
        headers=user_auth_headers,
        query_string={
            'start_time': 'invalid-date',
            'end_time': 'invalid-date'
        }
    )
    assert response.status_code == 400
    assert 'Invalid date format' in response.json['message']

def test_create_room_invalid_data(client, admin_auth_headers):
    """Test room creation with invalid data"""
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps({}))
    assert response.status_code == 400
    assert response.json['success'] is False

def test_create_room_validation_error(client, admin_auth_headers):
    """Test room creation with validation errors"""
    data = {
        "name": "",  # Empty name should fail validation
        "capacity": "invalid"  # Invalid capacity type
    }
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert 'errors' in response.json

def test_reserve_room_invalid_dates(client, user_auth_headers):
    """Test room reservation with invalid date format"""
    data = {
        'start_time': 'invalid-date',
        'end_time': 'invalid-date'
    }
    response = client.post('/api/v1/rooms/1/reserve',
                          headers=user_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert 'Invalid date format' in response.json['message']

def test_reserve_room_invalid_time_range(client, user_auth_headers):
    """Test room reservation with end time before start time"""
    now = datetime.utcnow()
    data = {
        'start_time': (now + timedelta(hours=2)).isoformat(),
        'end_time': (now + timedelta(hours=1)).isoformat()
    }
    response = client.post('/api/v1/rooms/1/reserve',
                          headers=user_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert 'Start time must be before end time' in response.json['message']

def test_reserve_room_missing_data(client, user_auth_headers):
    """Test room reservation with missing data"""
    response = client.post('/api/v1/rooms/1/reserve',
                          headers=user_auth_headers,
                          data=json.dumps({}))
    assert response.status_code == 400
    assert 'Invalid arguments' in response.json['message']

def test_reserve_room_missing_times(client, user_auth_headers):
    """Test room reservation with empty times"""
    data = {
        'start_time': '',
        'end_time': ''
    }
    response = client.post('/api/v1/rooms/1/reserve',
                          headers=user_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 400
    assert response.json['success'] is False

def test_update_room_invalid_data(client, admin_auth_headers):
    """Test room update with invalid data"""
    response = client.put('/api/v1/rooms/1',
                         headers=admin_auth_headers,
                         data=json.dumps({}))
    assert response.status_code == 400
    assert 'Invalid arguments' in response.json['message']

def test_get_rooms_error(client, monkeypatch):
    """Test get rooms with database error"""
    def mock_query(*args, **kwargs):
        raise Exception("Database error")
    
    monkeypatch.setattr("app.models.conference_room.ConferenceRoom.query", 
                       type('Query', (), {'filter_by': mock_query}))
    
    response = client.get('/api/v1/rooms')
    assert response.status_code == 500
    assert response.json['success'] is False
    assert 'Error retrieving rooms' in response.json['message']

def test_create_room_database_error(client, admin_auth_headers, monkeypatch):
    """Test room creation with database error"""
    def mock_add(*args):
        raise Exception("Database error")
    
    monkeypatch.setattr("app.db.session.add", mock_add)
    
    data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1",
        "image_url": "https://example.com/image.jpg"
    }
    response = client.post('/api/v1/rooms',
                          headers=admin_auth_headers,
                          data=json.dumps(data))
    assert response.status_code == 500
    assert response.json['success'] is False
    assert 'Error creating room' in response.json['message']

def test_get_room_bookings_error(client, user_auth_headers, monkeypatch):
    """Test get room bookings with database error"""
    def mock_query(*args, **kwargs):
        raise Exception("Database error")
    
    monkeypatch.setattr("app.models.reservation.Reservation.query", 
                       type('Query', (), {'filter_by': mock_query}))
    
    response = client.get('/api/v1/rooms/1/bookings',
                         headers=user_auth_headers)
    assert response.status_code == 500
    assert response.json['success'] is False
    assert 'Error retrieving room bookings' in response.json['message']

def test_check_availability_error(client, admin_auth_headers, user_auth_headers, monkeypatch):
    """Test check availability with database error"""
    room_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1",
        "image_url": "https://example.com/image.jpg"
    }
    create_response = client.post('/api/v1/rooms',
                                headers=admin_auth_headers,
                                data=json.dumps(room_data))
    assert create_response.status_code == 201
    room_id = create_response.json['data']['id']
    
    class MockQuery:
        def filter(self, *args, **kwargs):
            raise Exception("Database error")
        def first(self, *args, **kwargs):
            raise Exception("Database error")
    
    monkeypatch.setattr("app.models.reservation.Reservation.query", MockQuery())
    
    start_time = datetime.now() + timedelta(hours=1)
    end_time = start_time + timedelta(hours=2)
    
    response = client.get(f'/api/v1/rooms/{room_id}/availability',
                         headers=user_auth_headers,
                         query_string={
                             'start_time': start_time.isoformat(),
                             'end_time': end_time.isoformat()
                         })
    assert response.status_code == 500
    assert response.json['success'] is False
    assert 'Error checking availability' in response.json['message']