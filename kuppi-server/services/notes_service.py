from flask_jwt_extended import get_jwt_identity
from models.user_model import users_db

def add_note_service(data):
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if not user:
        return {"error": "User not found"}, 404

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return {"error": "Title and content are required!"}, 400

    note_id = len(user["notes"]) + 1
    note = {"id": note_id, "title": title, "content": content}
    user["notes"].append(note)

    return {"success": True, "note": note}, 201

def get_notes_service():
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if not user:
        return {"error": "User not found"}, 404

    notes_preview = [{"id": note["id"], "title": note["title"]} for note in user["notes"]]
    return {"notes": notes_preview}, 200

def get_note_by_id_service(note_id):
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if not user:
        return {"error": "User not found"}, 404

    note = next((note for note in user["notes"] if note["id"] == note_id), None)

    if not note:
        return {"error": "Note not found"}, 404

    return {"note": note}, 200

def delete_note_service(note_id):
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if not user:
        return {"error": "User not found"}, 404

    note = next((note for note in user["notes"] if note["id"] == note_id), None)

    if not note:
        return {"error": "Note not found"}, 404

    user["notes"].remove(note)
    return {"success": True, "message": "Note deleted successfully!"}, 200

def delete_all_notes_service():
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)

    if not user:
        return {"error": "User not found"}, 404

    # Clear all notes
    user["notes"] = []
    return {"success": True, "message": "All notes deleted successfully!"}, 200