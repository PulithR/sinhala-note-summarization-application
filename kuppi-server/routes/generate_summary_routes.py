from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.generate_summary_service import generate_summary_service

generate_summary_bp = Blueprint("generate_summary", __name__)

@generate_summary_bp.route("/generate-summary", methods=["POST"])
@jwt_required()
def generate_summary():
    data = request.json
    response, status = generate_summary_service(data)
    return jsonify(response),status