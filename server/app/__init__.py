from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
import os
import logging
from flask_swagger_ui import get_swaggerui_blueprint
from datetime import timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

SWAGGER_URL = "/docs"
API_URL = "/static/swagger.json"

def create_app(config_name=None):
    app = Flask(__name__, static_url_path='/static', static_folder='static')
    
    if config_name:
        app.config.from_object(config_name)
    else:
        app.config.from_object('app.config.DevelopmentConfig')
    
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'].split(','),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.routes import register_routes
    register_routes(app)

    swagger_ui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': 'Access API',
            'dom_id': '#swagger-ui',
            'deepLinking': True,
            'showMutatedRequest': True,
        }
    )
    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

    if os.getenv('SENTRY_DSN') and not os.getenv('FLASK_TESTING'):
        sentry_sdk.init(
            dsn=os.getenv('SENTRY_DSN'),
            integrations=[FlaskIntegration()],
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=os.getenv('FLASK_ENV', 'development')
        )
    else:
        logger.warning("Sentry is not configured or running in test mode")

    return app
