from flask import Blueprint, jsonify, request
from services.password_reset_service import request_password_reset_service, verify_password_reset_otp_service, reset_password_service

pass_reset_bp = Blueprint("pass_reset", _name_)

@pass_reset_bp.route("/request-pass-reset", methods=["POST"])
def request_password_reset():
    data = request.json
    if "email" not in data:
        return jsonify({"error": "Email is required!"}), 400
    response, status = request_password_reset_service(data["email"])
    return jsonify(response), status

@pass_reset_bp.route("/verify-pass-reset-otp", methods=["POST"])
def verify_pass_reset_otp():
    data = request.json
    if not data or not all(k in data for k in ["email", "otp"]):
        return jsonify({"error": "Email and OTP are required!"}), 400


    response, status = verify_password_reset_otp_service(data["email"], data["otp"])
    return jsonify(response), status

@pass_reset_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    if not data:
        return jsonify({"error": "new password are required!"}), 400


    response, status = reset_password_service(data["email"], data["newPassword"])
    return jsonify(response), status