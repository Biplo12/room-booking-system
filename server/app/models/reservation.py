from app import db
from datetime import datetime

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('conference_room.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    is_deleted = db.Column(db.Boolean, default=False)

    room = db.relationship('ConferenceRoom', backref=db.backref('reservations', lazy=True)) 

    __table_args__ = (
        db.Index('ix_reservation_room_id', 'room_id'),
        db.Index('ix_reservation_start_time', 'start_time'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'user_id': self.user_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'title': self.title,
            'description': self.description
        }