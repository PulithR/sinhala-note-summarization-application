from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import signup_user, login_user
from models.user_model import users_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    response, status = signup_user(data.get("email"), data.get("name"), data.get("password"))
    return jsonify(response), status

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    response, status = login_user(data.get("email"), data.get("password"))
    return jsonify(response), status

@auth_bp.route("/validate-token", methods=["POST"])
@jwt_required()
def validate_token():
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if user:
        return jsonify({"user": {"email": user["email"], "name": user["name"]}}), 200

    return jsonify({"success": False, "error": "Invalid token or user not found"}), 404