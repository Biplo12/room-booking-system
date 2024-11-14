from app import db
from datetime import datetime

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('conference_room.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)

    room = db.relationship('ConferenceRoom', backref=db.backref('reservations', lazy=True)) 

    __table_args__ = (
        db.Index('ix_reservation_room_id', 'room_id'),
        db.Index('ix_reservation_start_time', 'start_time'),
    )