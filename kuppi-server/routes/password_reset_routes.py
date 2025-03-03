from flask import Blueprint, jsonify, request
from services.password_reset_service import request_password_reset_service, verify_password_reset_otp_service, reset_password_service

pass_reset_bp = Blueprint("pass_reset", __name__)

@pass_reset_bp.route("/request-pass-reset", methods=["POST"])
def request_password_reset():
    data = request.json
    response, status = request_password_reset_service()
    return jsonify(response), status

@pass_reset_bp.route("/verify-pass-reset-otp", methods=["POST"])
def verify_pass_reset_otp():
    data = request.json
    response, status = request_password_reset_service()
    return jsonify(response), status

@pass_reset_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    response, status = reset_password_service()
    return jsonify(response), status