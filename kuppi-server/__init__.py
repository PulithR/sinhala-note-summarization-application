from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config
from routes.auth_routes import auth_bp
from routes.notes_routes import notes_bp
from routes.password_reset_routes import pass_reset_bp
from db import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    JWTManager(app)
    mail = Mail(app)  

    app.mongo = db

    app.register_blueprint(auth_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(pass_reset_bp)

    return app
