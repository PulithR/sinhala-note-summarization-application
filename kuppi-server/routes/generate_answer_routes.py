from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.generate_answer_services import generate_answer_service

generate_answer_bp = Blueprint("generate_answer", _name_)

@generate_answer_bp.route("/generate-answer", methods=["POST"])
@jwt_required
def generate_answer():
    data = request.json
    response, status = generate_answer_service(data)
    return jsonify(response),status