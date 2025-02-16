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

def verify_otp(email, otp):
    otp_data = otp_storage.get(email)
    if not otp_data:
        return jsonify({"error": "No OTP found for this email"}), 400

    time_diff = datetime.datetime.now() - otp_data["timestamp"]
    if time_diff.total_seconds() > 600:
        del otp_storage[email]
        return jsonify({"error": "OTP has expired"}), 400

    if otp != otp_data["otp"]:
        otp_data["attempts"] += 1
        return jsonify({"error": "Invalid OTP"}), 400

    user_data = pending_users.get(email)
    if not user_data:
        return jsonify({"error": "User data not found"}), 400
    
    users_db[email] = {
        "email": user_data["email"],
        "password": user_data["password"],
        "name": user_data["name"],
        "notes": []
    }

    del otp_storage[email]
    del pending_users[email]

    token = create_access_token(identity=email, expires_delta=datetime.timedelta(days=10))

    return jsonify({
        "success": True,
        "token": token,
        "user": {"email": email, "name": user_data["name"]}
    }), 201

def login_user(email, password):
    if not email or not password:
        return {"success": False, "error": "Email and password are required!"}, 400

    user = users_db.get(email)
    if user and check_password_hash(user["password"], password):
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
        return {"success": True, "token": token, "user": {"email": user["email"], "name": user["name"]}}, 200

    return {"success": False, "error": "Invalid credentials"}, 401
