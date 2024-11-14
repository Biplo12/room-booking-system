from flask import Blueprint, jsonify
from app.models.conference_room import ConferenceRoom
from app.models.schemas import ConferenceRoomSchema

conference_room_bp = Blueprint('conference_room', __name__)
conference_room_schema = ConferenceRoomSchema()
conference_rooms_schema = ConferenceRoomSchema(many=True)

@conference_room_bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = ConferenceRoom.query.filter_by(is_deleted=False).all()
    return jsonify(conference_rooms_schema.dump(rooms))