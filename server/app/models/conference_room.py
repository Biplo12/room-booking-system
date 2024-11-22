from app import db

class ConferenceRoom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    equipment = db.Column(db.String(255), nullable=True)
    is_deleted = db.Column(db.Boolean, default=False)
    __table_args__ = (
        db.Index('ix_conference_room_name', 'name'),
    )