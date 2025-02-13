import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user_model import users_db

def signup_user(email, name, password):
    if not email or not password:
        return {"success": False, "error": "Email and password are required!"}, 400

    if email in users_db:
        return {"success": False, "error": "User already exists!"}, 400

    hashed_password = generate_password_hash(password)
    users_db[email] = {"email": email, "password": hashed_password, "name": name, "notes": []}
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(days=10))

    return {"success": True, "token": token, "user": {"email": email, "name": name}}, 201

def login_user(email, password):
    if not email or not password:
        return {"success": False, "error": "Email and password are required!"}, 400

    user = users_db.get(email)
    if user and check_password_hash(user["password"], password):
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
        return {"success": True, "token": token, "user": {"email": user["email"], "name": user["name"]}}, 200

    return {"success": False, "error": "Invalid credentials"}, 401
