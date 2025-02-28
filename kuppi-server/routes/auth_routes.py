from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import signup_user_service, login_user_service, verify_signup_otp_service
from models.user_model import users_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup_user():
    data = request.json
    if not data or not all(k in data for k in ["email", "name", "password"]):
        return jsonify({"error": "Email, name, and password are required!"}), 400
    
    response, status = signup_user_service(data["email"], data["name"], data["password"])
    return jsonify(response), status

@auth_bp.route("/verify-signup-otp", methods=["POST"])
def verify_signup_otp():
    data = request.json
    if not data or not all(k in data for k in ["email", "otp"]):
        return jsonify({"error": "Email and OTP are required!"}), 400

    response, status = verify_signup_otp_service(data["email"], data["otp"])
    return jsonify(response), status

@auth_bp.route("/login", methods=["POST"])
def login_user():
    data = request.json
    if not data or not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Email and password are required!"}), 400

    response, status = login_user_service(data["email"], data["password"])
    return jsonify(response), status

@auth_bp.route("/validate-token", methods=["POST"])
@jwt_required()
def validate_token():
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if not user:
        return jsonify({"success": False, "error": "Invalid token or user not found"}), 404

    return jsonify({"user": {"email": user["email"], "name": user["name"]}}), 200
