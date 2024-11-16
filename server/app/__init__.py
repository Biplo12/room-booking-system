from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class='app.config.DevelopmentConfig'):
    if os.getenv('SENTRY_DSN') and not os.getenv('FLASK_TESTING'): # If running tests, don't initialize Sentry
        sentry_sdk.init(
            dsn=os.getenv('SENTRY_DSN'),
            integrations=[FlaskIntegration()],
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=os.getenv('FLASK_ENV', 'development')
        )
    else:
        logger.warning("Sentry is not configured or running in test mode")

    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.routes import register_routes
    register_routes(app)

    return app
