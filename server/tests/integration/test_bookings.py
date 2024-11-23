import json
from datetime import datetime, timedelta
import pytest
from app.models.reservation import Reservation
from app.models.conference_room import ConferenceRoom
from app.models.user import User

@pytest.fixture
def setup_bookings(client, admin_auth_headers, user_auth_headers):
    # Create a room
    room_data = {
        "name": "Test Room",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1",
        "image_url": "https://example.com/image.jpg"
    }
    room_response = client.post('/api/v1/rooms',
                              headers=admin_auth_headers,
                              json=room_data)
    room_id = room_response.json['data']['id']
    
    # Create some bookings
    start_time = datetime.now() + timedelta(hours=1)
    bookings_data = [
        {
            "start_time": (start_time + timedelta(days=i)).isoformat(),
            "end_time": (start_time + timedelta(days=i, hours=2)).isoformat(),
            "title": f"Booking {i}",
            "description": f"Test booking {i}"
        } for i in range(3)
    ]
    
    created_bookings = []
    for booking in bookings_data:
        response = client.post(
            f'/api/v1/rooms/{room_id}/reserve',
            headers=user_auth_headers,
            json=booking
        )
        created_bookings.append(response.json['data'])
    
    return {'room_id': room_id, 'bookings': created_bookings}

def test_get_all_bookings(client, user_auth_headers, setup_bookings):
    """Test retrieving all bookings"""
    response = client.get('/api/v1/bookings', headers=user_auth_headers)
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'items' in response.json['data']
    
    bookings = response.json['data']['items']
    assert len(bookings) >= 3  # At least the ones we created
    
    # Verify booking structure
    for booking in bookings:
        assert all(key in booking for key in [
            'id', 'room_id', 'user_id', 'start_time', 'end_time', 'title'
        ])

def test_get_room_bookings(client, user_auth_headers, setup_bookings):
    """Test retrieving bookings for a specific room"""
    room_id = setup_bookings['room_id']
    response = client.get(
        f'/api/v1/rooms/{room_id}/bookings',
        headers=user_auth_headers
    )
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'items' in response.json['data']
    
    bookings = response.json['data']['items']
    assert len(bookings) == 3  # The ones we created for this room
    
    # Verify all bookings are for the correct room
    for booking in bookings:
        assert booking['room_id'] == room_id

def test_get_room_bookings_nonexistent_room(client, user_auth_headers):
    """Test retrieving bookings for a nonexistent room"""
    response = client.get(
        '/api/v1/rooms/99999/bookings',
        headers=user_auth_headers
    )
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert len(response.json['data']['items']) == 0

def test_get_bookings_unauthorized(client):
    """Test accessing bookings without authentication"""
    response = client.get('/api/v1/bookings')
    assert response.status_code == 401

def test_get_room_bookings_unauthorized(client):
    """Test accessing room bookings without authentication"""
    response = client.get('/api/v1/rooms/1/bookings')
    assert response.status_code == 401

def test_get_bookings_with_deleted_reservations(client, user_auth_headers, setup_bookings, db_session):
    """Test that deleted reservations are not returned"""
    # Mark one booking as deleted
    booking = Reservation.query.first()
    booking.is_deleted = True
    db_session.commit()
    
    response = client.get('/api/v1/bookings', headers=user_auth_headers)
    
    assert response.status_code == 200
    bookings = response.json['data']['items']
    booking_ids = [b['id'] for b in bookings]
    assert booking.id not in booking_ids

def test_get_room_bookings_with_filters(client, user_auth_headers, setup_bookings):
    """Test retrieving room bookings with date filters"""
    room_id = setup_bookings['room_id']
    tomorrow = datetime.now() + timedelta(days=1)
    
    response = client.get(
        f'/api/v1/rooms/{room_id}/bookings',
        query_string={
            'start_date': tomorrow.date().isoformat()
        },
        headers=user_auth_headers
    )
    
    assert response.status_code == 200
    assert response.json['success'] is True
    bookings = response.json['data']['items']
    for booking in bookings:
        booking_date = datetime.fromisoformat(booking['start_time']).date()
        assert booking_date >= tomorrow.date()

def test_get_all_bookings_as_admin(client, admin_auth_headers, setup_bookings):
    """Test retrieving all bookings as admin"""
    response = client.get('/api/v1/bookings', headers=admin_auth_headers)
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'items' in response.json['data']

def test_get_all_bookings_as_user(client, user_auth_headers, setup_bookings):
    """Test retrieving all bookings as regular user"""
    response = client.get('/api/v1/bookings', headers=user_auth_headers)
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'items' in response.json['data'] 