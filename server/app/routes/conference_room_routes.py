from flask import Blueprint, jsonify, request
from app import db
from datetime import datetime
from marshmallow import ValidationError

from app.models.conference_room import ConferenceRoom
from app.models.schemas import ConferenceRoomSchema
from flask_jwt_extended import jwt_required
from app.models.reservation import Reservation
from app.routes.auth_routes import is_admin

conference_room_bp = Blueprint('conference_room', __name__)
conference_room_schema = ConferenceRoomSchema()
conference_rooms_schema = ConferenceRoomSchema(many=True)

# -------
@conference_room_bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = ConferenceRoom.query.filter_by(is_deleted=False).all()

    return jsonify(conference_rooms_schema.dump(rooms))

# -------
@conference_room_bp.route('/rooms', methods=['POST'])
@jwt_required()
def create_room():
    data = request.get_json()
    try:
        validated_data = conference_room_schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    room = ConferenceRoom(**validated_data)
    db.session.add(room)
    db.session.commit()

    return conference_room_schema.dump(room), 201

# -------
@conference_room_bp.route('/rooms/<int:room_id>', methods=['PUT'])
@jwt_required()
def update_room(room_id):
    room = ConferenceRoom.query.get_or_404(room_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(room, key, value)
    db.session.commit()

    return conference_room_schema.dump(room)

# -------
@conference_room_bp.route('/rooms/<int:room_id>', methods=['DELETE'])
@jwt_required()
def delete_room(room_id):
    if not is_admin():
        return jsonify(message='Admin privileges required'), 403

    room = ConferenceRoom.query.get_or_404(room_id)
    room.is_deleted = True
    db.session.commit()

    return '', 204

# -------
@conference_room_bp.route('/rooms/<int:room_id>/availability', methods=['GET'])
def check_availability(room_id):
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')
    
    try:
        start_time = datetime.fromisoformat(start_time)
        end_time = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify(message='Invalid date format'), 400

    conflicts = Reservation.query.filter(
        Reservation.room_id == room_id,
        Reservation.start_time < end_time,
        Reservation.end_time > start_time
    ).count()

    return jsonify(is_available=(conflicts == 0))

# -------
@conference_room_bp.route('/rooms/<int:room_id>/reserve', methods=['POST'])
@jwt_required()
def reserve_room(room_id):
    data = request.get_json()
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if not start_time or not end_time:
        return jsonify(message='Start time and end time are required'), 400

    try:
        start_time = datetime.fromisoformat(start_time)
        end_time = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify(message='Invalid date format'), 400

    if start_time >= end_time:
        return jsonify(message='Start time must be before end time'), 400

    conflicts = Reservation.query.filter(
        Reservation.room_id == room_id,
        Reservation.start_time < end_time,
        Reservation.end_time > start_time
    ).count()

    if conflicts > 0:
        return jsonify(message='Time conflict detected'), 409

    reservation = Reservation(room_id=room_id, start_time=start_time, end_time=end_time)
    db.session.add(reservation)
    db.session.commit()

    return jsonify(message='Reservation created successfully'), 201