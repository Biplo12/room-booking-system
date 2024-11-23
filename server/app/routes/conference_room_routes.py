from flask import Blueprint, jsonify, request
from app import db
from datetime import datetime
import logging
import bleach
from sqlalchemy import and_
from marshmallow import ValidationError
import sentry_sdk

from app.models.conference_room import ConferenceRoom
from app.models.schemas import ConferenceRoomSchema
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models.reservation import Reservation
from app.routes.auth_routes import is_admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

conference_room_bp = Blueprint('conference_room', __name__)
conference_room_schema = ConferenceRoomSchema()
conference_rooms_schema = ConferenceRoomSchema(many=True)

def sanitize_input(data):
    """Sanitize input data to prevent XSS attacks"""
    if isinstance(data, dict):
        return {k: bleach.clean(str(v)) if isinstance(v, str) else v for k, v in data.items()}
    elif isinstance(data, str):
        return bleach.clean(data)
    return data

# -------
@conference_room_bp.route('/rooms', methods=['GET'])
def get_rooms():
    with sentry_sdk.start_span(op="http.server", description="get_rooms"):
        try:
            with sentry_sdk.start_span(op="db.query", description="fetch_rooms"):
                page = request.args.get('page', 1, type=int)
                per_page = request.args.get('per_page', 10, type=int)
                
                per_page = min(per_page, 100)
                
                pagination = ConferenceRoom.query.filter_by(is_deleted=False).paginate(
                    page=page,
                    per_page=per_page,
                    error_out=False
                )
            
            return jsonify({
                'success': True,
                'message': 'Rooms retrieved successfully',
                'data': {
                    'items': conference_rooms_schema.dump(pagination.items),
                    'pagination': {
                        'total_items': pagination.total,
                        'total_pages': pagination.pages,
                        'current_page': page,
                        'per_page': per_page,
                        'has_next': pagination.has_next,
                        'has_prev': pagination.has_prev
                    }
                }
            }), 200
        except Exception as e:
            sentry_sdk.capture_exception(e)
            logger.error(f"Error retrieving rooms: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Error retrieving rooms'
            }), 500

# -------
@conference_room_bp.route('/rooms', methods=['POST'])
@jwt_required()
def create_room():
    with sentry_sdk.start_span(op="http.server", description="create_room"):
        try:
            if not is_admin():
                return jsonify({
                    'success': False,
                    'message': 'Admin privileges required'
                }), 403

            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'Invalid arguments'
                }), 400

            with sentry_sdk.start_span(op="data.sanitize", description="sanitize_input"):
                sanitized_data = sanitize_input(data)

            try:
                validated_data = conference_room_schema.load(sanitized_data)
            except ValidationError as err:
                return jsonify({
                    'success': False,
                    'message': 'Validation error',
                    'errors': err.messages
                }), 400

            with sentry_sdk.start_span(op="db.write", description="create_room"):
                room = ConferenceRoom(**validated_data)
                db.session.add(room)
                db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Room created successfully',
                'data': conference_room_schema.dump(room)
            }), 201

        except Exception as e:
            sentry_sdk.capture_exception(e)
            logger.error(f"Error creating room: {str(e)}")
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error creating room'
            }), 500
        
# -------
@conference_room_bp.route('/<int:room_id>', methods=['GET'])
def get_room_by_id(room_id: int):
    """Get a specific conference room by ID."""
    room = ConferenceRoom.query.get(room_id)
    
    if not room:
        return jsonify({
            'success': False,
            'message': f'Conference room with id {room_id} not found'
        }), 404
    
    return jsonify(conference_room_schema.dump(room)), 200

# -------
@conference_room_bp.route('/rooms/<int:room_id>', methods=['PUT'])
@jwt_required()
def update_room(room_id):
    with sentry_sdk.start_span(op="http.server", description="update_room"):
        try:
            if not is_admin():
                return jsonify({
                    'success': False,
                    'message': 'Admin privileges required'
                }), 403

            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'Invalid arguments'
                }), 400

            with sentry_sdk.start_span(op="db.write", description="update_room"):
                room = ConferenceRoom.query.filter_by(id=room_id, is_deleted=False).first()
                if not room:
                    return jsonify({
                        'success': False,
                        'message': 'Room not found'
                    }), 404

                for key, value in data.items():
                    setattr(room, key, value)
                db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Room updated successfully',
                'data': conference_room_schema.dump(room)
            }), 200

        except Exception as e:
            sentry_sdk.capture_exception(e)
            logger.error(f"Error updating room: {str(e)}")
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error updating room'
            }), 500

# -------
@conference_room_bp.route('/rooms/<int:room_id>', methods=['DELETE'])
@jwt_required()
def delete_room(room_id):
    with sentry_sdk.start_span(op="http.server", description="delete_room"):
        try:
            if not is_admin():
                return jsonify({
                    'success': False,
                    'message': 'Admin privileges required'
                }), 403

            with sentry_sdk.start_span(op="db.write", description="delete_room"):
                room = ConferenceRoom.query.get_or_404(room_id)
                room.is_deleted = True
                db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Room deleted successfully'
            }), 200

        except Exception as e:
            sentry_sdk.capture_exception(e)
            logger.error(f"Error deleting room: {str(e)}")
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error deleting room'
            }), 500

# -------
@conference_room_bp.route('/rooms/<int:room_id>/availability', methods=['GET'])
def check_availability(room_id):
    with sentry_sdk.start_span(op="http.server", description="check_availability"):
        try:
            start_time = request.args.get('start_time')
            end_time = request.args.get('end_time')

            if not start_time or not end_time:
                return jsonify({
                    'success': False,
                    'message': 'Start time and end time are required'
                }), 400
            
            try:
                start_time = datetime.fromisoformat(sanitize_input(start_time))
                end_time = datetime.fromisoformat(sanitize_input(end_time))
            except ValueError:
                return jsonify({
                    'success': False,
                    'message': 'Invalid date format'
                }), 400

            with sentry_sdk.start_span(op="db.query", description="check_conflicts"):
                conflicts = db.session.query(
                    db.exists().where(
                        and_(
                            Reservation.room_id == room_id,
                            Reservation.start_time < end_time,
                            Reservation.end_time > start_time,
                            Reservation.is_deleted == False
                        )
                    )
                ).scalar()

            return jsonify({
                'success': True,
                'message': 'Availability checked successfully',
                'data': {'is_available': not conflicts}
            }), 200

        except Exception as e:
            sentry_sdk.capture_exception(e)
            logger.error(f"Error checking availability: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Error checking availability'
            }), 500

# -------
@conference_room_bp.route('/rooms/<int:room_id>/reserve', methods=['POST'])
@jwt_required()
def reserve_room(room_id):
    with sentry_sdk.start_span(op="http.server", description="reserve_room"):
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'Invalid arguments'
                }), 400

            with sentry_sdk.start_span(op="data.process", description="process_reservation_data"):
                sanitized_data = sanitize_input(data)
                start_time = sanitized_data.get('start_time')
                end_time = sanitized_data.get('end_time')
                title = sanitized_data.get('title', '')
                description = sanitized_data.get('description', '')
                
                user_id = str(get_jwt_identity())
                
                if not all([start_time, end_time]):
                    return jsonify({
                        'success': False,
                        'message': 'Start time and end time are required'
                    }), 400

                try:
                    start_time = datetime.fromisoformat(start_time)
                    end_time = datetime.fromisoformat(end_time)
                except ValueError:
                    return jsonify({
                        'success': False,
                        'message': 'Invalid date format'
                    }), 400

                if start_time >= end_time:
                    return jsonify({
                        'success': False,
                        'message': 'Start time must be before end time'
                    }), 400

            with sentry_sdk.start_span(op="db.query", description="check_conflicts"):
                conflicts = db.session.query(
                    db.exists().where(
                        and_(
                            Reservation.room_id == room_id,
                            Reservation.start_time < end_time,
                            Reservation.end_time > start_time,
                            Reservation.is_deleted == False,
                            Reservation.user_id == str(user_id),
                            Reservation.title == title,
                            Reservation.description == description
                        )
                    )
                ).scalar()

            if conflicts:
                return jsonify({
                    'success': False,
                    'message': 'Time conflict detected'
                }), 409

            with sentry_sdk.start_span(op="db.write", description="create_reservation"):
                reservation = Reservation(
                    room_id=room_id,
                    user_id=user_id,
                    start_time=start_time,
                    end_time=end_time,
                    title=title,
                    description=description
                )
                
                db.session.add(reservation)
                db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Reservation created successfully',
                'data': {
                    'id': reservation.id,
                    'room_id': reservation.room_id,
                    'user_id': reservation.user_id,
                    'start_time': reservation.start_time.isoformat(),
                    'end_time': reservation.end_time.isoformat(),
                    'title': reservation.title,
                    'description': reservation.description,
                }
            }), 201

        except Exception as e:
            sentry_sdk.capture_exception(e)
            logger.error(f"Error creating reservation: {str(e)}")
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error creating reservation'
            }), 500
        


        