from flask import Blueprint, jsonify, request
from app import db

from app.models.conference_room import ConferenceRoom
from app.models.schemas import ConferenceRoomSchema
from flask_jwt_extended import jwt_required

conference_room_bp = Blueprint('conference_room', __name__)
conference_room_schema = ConferenceRoomSchema()
conference_rooms_schema = ConferenceRoomSchema(many=True)

# GET
@conference_room_bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = ConferenceRoom.query.filter_by(is_deleted=False).all()

    return jsonify(conference_rooms_schema.dump(rooms))

# POST
@conference_room_bp.route('/rooms', methods=['POST'])
@jwt_required()
def create_room():
    data = request.get_json()
    errors = conference_room_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    room = ConferenceRoom(**data)
    db.session.add(room)
    db.session.commit()

    return conference_room_schema.dump(room), 201

# PUT
@conference_room_bp.route('/rooms/<int:room_id>', methods=['PUT'])
@jwt_required()
def update_room(room_id):
    room = ConferenceRoom.query.get_or_404(room_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(room, key, value)
    db.session.commit()

    return conference_room_schema.dump(room)

# DELETE
@conference_room_bp.route('/rooms/<int:room_id>', methods=['DELETE'])
@jwt_required()
def delete_room(room_id):
    room = ConferenceRoom.query.get_or_404(room_id)
    room.is_deleted = True
    db.session.commit()

    return '', 204