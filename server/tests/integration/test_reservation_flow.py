import json
from datetime import datetime, timedelta

def test_complete_reservation_flow(client, admin_auth_headers, user_auth_headers):
    # 1. Create a room as admin
    room_data = {
        "name": "Meeting Room A",
        "capacity": 10,
        "equipment": "Projector",
        "location": "Floor 1, Building A",
        "image_url": "https://example.com/image.jpg"
    }
    room_response = client.post('/api/v1/rooms',
                              headers=admin_auth_headers,
                              data=json.dumps(room_data))
    assert room_response.status_code == 201
    room_id = room_response.json['data']['id']
    
    # 2. Check room availability
    start_time = datetime.now() + timedelta(hours=1)
    end_time = start_time + timedelta(hours=2)
    
    availability_response = client.get(
        f'/api/v1/rooms/{room_id}/availability',
        query_string={
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat()
        }
    )
    assert availability_response.status_code == 200
    assert availability_response.json['data']['is_available'] is True
    
    # 3. Make a reservation
    reservation_data = {
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat()
    }
    reservation_response = client.post(
        f'/api/v1/rooms/{room_id}/reserve',
        headers=user_auth_headers,
        data=json.dumps(reservation_data)
    )
    assert reservation_response.status_code == 201
    
    # 4. Verify room is no longer available for the same time slot
    availability_response = client.get(
        f'/api/v1/rooms/{room_id}/availability',
        query_string={
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat()
        }
    )
    assert availability_response.status_code == 200
    assert availability_response.json['data']['is_available'] is False 