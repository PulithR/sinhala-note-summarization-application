from flask_jwt_extended import get_jwt_identity
from db import users_collection
from bson import ObjectId
import datetime

def add_note_service(data):
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return {"error": "Title and content are required"}, 400

    new_note = {
        "_id": ObjectId(),  
        "title": title,
        "content": content,
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }

    users_collection.update_one(
        {"email": current_user_email},
        {"$push": {"notes": new_note}}
    )

    return {"success": True, "message": "Note added successfully!"}, 201

def get_notes_service():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    notes_preview = [{"_id": str(note["_id"]) if "_id" in note else None, "title": note["title"], "content": " ".join(note["content"].split(" ")[:10])} for note in user.get("notes", [])]
    return {"notes": notes_preview}, 200

def get_note_by_id_service(note_id):
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    try:
        object_id = ObjectId(note_id)
    except Exception as e:
        return {"error": "Invalid note ID format"}, 400

    note = next((note for note in user.get("notes", []) if str(note.get("_id")) == note_id), None)

    if not note:
        return {"error": "Note not found"}, 404

    note["_id"] = str(note["_id"])
    return {"note": note}, 200

def delete_note_service(note_id):
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    try:
        object_id = ObjectId(note_id)
    except Exception as e:
        return {"error": "Invalid note ID format"}, 400

    users_collection.update_one({"email": current_user_email}, {"$pull": {"notes": {"_id": object_id}}})

    return {"success": True, "message": "Note deleted successfully!"}, 200

def delete_all_notes_service():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    users_collection.update_one({"email": current_user_email}, {"$set": {"notes": []}})
    return {"success": True, "message": "All notes deleted successfully!"}, 200
