from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.notes_service import add_note_service, get_notes_service, get_note_by_id_service, delete_note_service, delete_all_notes_service

notes_bp = Blueprint("notes", __name__)

@notes_bp.route("/notes", methods=["POST"])
@jwt_required()
def add_note():
    data = request.json
    response, status = add_note_service(data)
    return jsonify(response), status

@notes_bp.route("/notes", methods=["GET"])
@jwt_required()
def get_notes():
    response, status = get_notes_service()
    return jsonify(response), status

@notes_bp.route("/notes/<string:note_id>", methods=["GET"])
@jwt_required()
def get_note_by_id(note_id):
    response, status = get_note_by_id_service(note_id)
    return jsonify(response), status

@notes_bp.route("/notes/<string:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    response, status = delete_note_service(note_id)
    return jsonify(response), status

@notes_bp.route("/notes", methods=["DELETE"])
@jwt_required()
def delete_all_notes():
    response, status = delete_all_notes_service()
    return jsonify(response), status
