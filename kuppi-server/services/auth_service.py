import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user_model import users_db, pending_users, otp_storage
from services.otp_service import generate_otp
from services.email_service import send_email

MAX_OTP_ATTEMPTS = 3
OTP_EXPIRY_SECONDS = 600  # 10 minutes
OTP_REQUEST_COOLDOWN_SECONDS = 60  # 1 minute


def signup_user_service(email, name, password):
    """Handles user signup, generates OTP, and sends it via email."""
    if not email or not password or not name:
        return {"error": "Email, name, and password are required!"}, 400

    if email in users_db:
        return {"error": "User already exists!"}, 400

    # Check OTP cooldown
    otp_data = otp_storage.get(email)
    if otp_data and (datetime.datetime.now() - otp_data.get("timestamp", datetime.datetime.min)).total_seconds() < OTP_REQUEST_COOLDOWN_SECONDS:
        return {"error": "Please wait before requesting another OTP."}, 429

    # Generate and store OTP
    otp = generate_otp()
    otp_storage[email] = {
        "otp": otp,
        "timestamp": datetime.datetime.now(),
        "attempts": 0
    }

    # Store pending user data securely
    pending_users[email] = {
        "email": email,
        "name": name,
        "password": generate_password_hash(password)
    }

    # Send OTP via email
    if not send_email(email, otp):
        del pending_users[email]  # Cleanup if email sending fails
        return {"error": "Failed to send OTP. Please try again."}, 500

    return {
        "success": True,
        "message": "OTP sent to your email. Please verify to complete registration."
    }, 200


def verify_otp_service(email, otp):
    """Verifies OTP, completes registration, and returns JWT token if successful."""
    otp_data = otp_storage.get(email)
    if not otp_data:
        return {"error": "No OTP found for this email."}, 400

    # Check OTP expiry
    if (datetime.datetime.now() - otp_data["timestamp"]).total_seconds() > OTP_EXPIRY_SECONDS:
        del otp_storage[email]
        return {"error": "OTP has expired. Please request a new one."}, 400

    # Check OTP attempts
    if otp_data["attempts"] >= MAX_OTP_ATTEMPTS:
        del otp_storage[email]
        return {"error": "Too many incorrect attempts. Request a new OTP."}, 403

    # Validate OTP
    if otp != otp_data["otp"]:
        otp_data["attempts"] += 1
        return {"error": "Invalid OTP. Please try again."}, 400

    # Retrieve user data from pending users
    user_data = pending_users.pop(email, None)
    if not user_data:
        return {"error": "User data not found."}, 400

    # Move user from pending to active users
    users_db[email] = {
        "email": user_data["email"],
        "password": user_data["password"],
        "name": user_data["name"],
        "notes": []
    }

    del otp_storage[email]  # OTP verified, remove from storage

    # Generate JWT token
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(days=10))

    return {
        "success": True,
        "token": token,
        "user": {"email": email, "name": user_data["name"]}
    }, 201


def login_user_service(email, password):
    """Handles user login and returns a JWT token if credentials are valid."""
    if not email or not password:
        return {"error": "Email and password are required!"}, 400

    user = users_db.get(email)
    if not user or not check_password_hash(user["password"], password):
        return {"error": "Invalid email or password."}, 401

    # Generate JWT token
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))

    return {
        "success": True,
        "token": token,
        "user": {"email": user["email"], "name": user["name"]}
    }, 200
