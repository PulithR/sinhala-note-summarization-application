from flask import request, jsonify
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user_model import users_db
from models.user_model import pending_users
from models.user_model import otp_storage
from services.otp_service import generate_otp
from services.email_service import send_email

def signup_user(email, name, password):
    data = request.json
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    if email in users_db:
        return jsonify({"error": "User already exists!"}), 400

    # Generate and store OTP
    otp = generate_otp()
    otp_storage[email] = {
        "otp": otp,
        "timestamp": datetime.datetime.now(),
        "attempts": 0
    }

    # Store pending user data
    pending_users[email] = {
        "email": email,
        "name": name,
        "password": generate_password_hash(password)
    }

    # Send OTP via email
    if not send_email(email, otp):
        return jsonify({"error": "Failed to send OTP"}), 500

    return jsonify({
        "success": True,
        "message": "OTP sent to your email. Please verify to complete registration."
    }), 200

def login_user(email, password):
    if not email or not password:
        return {"success": False, "error": "Email and password are required!"}, 400

    user = users_db.get(email)
    if user and check_password_hash(user["password"], password):
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
        return {"success": True, "token": token, "user": {"email": user["email"], "name": user["name"]}}, 200

    return {"success": False, "error": "Invalid credentials"}, 401
