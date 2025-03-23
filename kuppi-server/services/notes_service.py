from flask_jwt_extended import get_jwt_identity
from db import users_collection
from bson import ObjectId
import datetime

# Service to add a new note for the current user
def add_note_service(data):
    # Get the email of the currently authenticated user
    current_user_email = get_jwt_identity()
    # Find the user in the database using their email
    user = users_collection.find_one({"email": current_user_email})

    # If the user is not found, return an error response
    if not user:
        return {"error": "User not found"}, 404

    # Extract the title and content of the note from the request data
    title = data.get("title")
    content = data.get("content")

    # Ensure both title and content are provided
    if not title or not content:
        return {"error": "Title and content are required"}, 400

    # Create a new note object with a unique ID and timestamp
    new_note = {
        "_id": ObjectId(),  
        "title": title,
        "content": content,
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }

    # Add the new note to the user's notes array in the database
    users_collection.update_one(
        {"email": current_user_email},
        {"$push": {"notes": new_note}}
    )

    # Return a success response
    return {"success": True, "message": "Note added successfully!"}, 201

# Service to get a preview of all notes for the current user
def get_notes_service():
    # Get the email of the currently authenticated user
    current_user_email = get_jwt_identity()
    # Find the user in the database using their email
    user = users_collection.find_one({"email": current_user_email})

    # If the user is not found, return an error response
    if not user:
        return {"error": "User not found"}, 404

    # Create a preview of notes with only the ID and title
    notes_preview = [{"_id": str(note["_id"]) if "_id" in note else None, "title": note["title"]} for note in user.get("notes", [])]
    # Return the notes preview
    return {"notes": notes_preview}, 200

# Service to get a specific note by its ID
def get_note_by_id_service(note_id):
    # Get the email of the currently authenticated user
    current_user_email = get_jwt_identity()
    # Find the user in the database using their email
    user = users_collection.find_one({"email": current_user_email})

    # If the user is not found, return an error response
    if not user:
        return {"error": "User not found"}, 404

    # Validate the note ID format
    try:
        object_id = ObjectId(note_id)
    except Exception as e:
        return {"error": "Invalid note ID format"}, 400

    # Find the note with the matching ID in the user's notes
    note = next((note for note in user.get("notes", []) if str(note.get("_id")) == note_id), None)

    # If the note is not found, return an error response
    if not note:
        return {"error": "Note not found"}, 404

    # Convert the note ID to a string for the response
    note["_id"] = str(note["_id"])
    # Return the note details
    return {"note": note}, 200

# Service to delete a specific note by its ID
def delete_note_service(note_id):
    # Get the email of the currently authenticated user
    current_user_email = get_jwt_identity()
    # Find the user in the database using their email
    user = users_collection.find_one({"email": current_user_email})

    # If the user is not found, return an error response
    if not user:
        return {"error": "User not found"}, 404

    # Validate the note ID format
    try:
        object_id = ObjectId(note_id)
    except Exception as e:
        return {"error": "Invalid note ID format"}, 400

    # Remove the note with the matching ID from the user's notes
    users_collection.update_one({"email": current_user_email}, {"$pull": {"notes": {"_id": object_id}}})

    # Return a success response
    return {"success": True, "message": "Note deleted successfully!"}, 200

# Service to delete all notes for the current user
def delete_all_notes_service():
    # Get the email of the currently authenticated user
    current_user_email = get_jwt_identity()
    # Find the user in the database using their email
    user = users_collection.find_one({"email": current_user_email})

    # If the user is not found, return an error response
    if not user:
        return {"error": "User not found"}, 404

    # Clear all notes for the user by setting the notes array to an empty list
    users_collection.update_one({"email": current_user_email}, {"$set": {"notes": []}})
    # Return a success response
    return {"success": True, "message": "All notes deleted successfully!"}, 200
