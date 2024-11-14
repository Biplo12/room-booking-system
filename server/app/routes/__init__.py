from .conference_room_routes import conference_room_bp
from .auth_routes import auth_bp
from app.config import API_PREFIX

def register_routes(app):
    app.register_blueprint(conference_room_bp, url_prefix=API_PREFIX)
    app.register_blueprint(auth_bp, url_prefix=API_PREFIX)
