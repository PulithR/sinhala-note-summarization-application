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