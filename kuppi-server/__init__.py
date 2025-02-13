from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth_routes import auth_bp

def create_app():
    app = Flask(_name_)
    app.config.from_object(Config)

    CORS(app)
    JWTManager(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)

    return app