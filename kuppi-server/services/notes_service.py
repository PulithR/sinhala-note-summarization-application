from flask_jwt_extended import get_jwt_identity
from bson.objectid import ObjectId
from db import users_collection

def add_note_service(data):
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return {"error": "Title and content are required!"}, 400

    note = {"title": title, "content": content}
    users_collection.update_one({"email": current_user_email}, {"$push": {"notes": note}})
    
    return {"success": True, "note": note}, 201

def get_notes_service():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    notes_preview = [{"_id": str(note["_id"]) if "_id" in note else None, "title": note["title"]} for note in user.get("notes", [])]
    return {"notes": notes_preview}, 200


def get_notes_service():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    notes_preview = [{"_id": str(note["_id"]) if "_id" in note else None, "title": note["title"]} for note in user.get("notes", [])]
    return {"notes": notes_preview}, 200

def delete_note_service(note_id):
    pass

def delete_all_notes_service():
    pass

