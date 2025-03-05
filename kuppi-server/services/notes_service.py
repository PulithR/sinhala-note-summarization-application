def get_notes_service():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    notes_preview = [{"_id": str(note["_id"]) if "_id" in note else None, "title": note["title"]} for note in user.get("notes", [])]
    return {"notes": notes_preview}, 200

def get_note_by_id_service(note_id):
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    note = next((note for note in user.get("notes", []) if str(note.get("_id")) == note_id), None)

    if not note:
        return {"error": "Note not found"}, 404

    return {"note": note}, 200

def delete_note_service(note_id):
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    users_collection.update_one({"email": current_user_email}, {"$pull": {"notes": {"_id": ObjectId(note_id)}}})
    return {"success": True, "message": "Note deleted successfully!"}, 200

def delete_all_notes_service():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})

    if not user:
        return {"error": "User not found"}, 404

    users_collection.update_one({"email": current_user_email}, {"$set": {"notes": []}})
    return {"success": True, "message": "All notes deleted successfully!"}, 200