import unittest
from unittest.mock import patch, MagicMock
from services.notes_service import (
    add_note_service,
    get_notes_service,
    get_note_by_id_service,
    delete_note_service,
    delete_all_notes_service
)
from bson import ObjectId

class TestNotesService(unittest.TestCase):

    def setUp(self):
        self.email = "test@example.com"
        self.user = {"email": self.email, "notes": []}
        self.note_id = "5f9f1b0b9b9b9b9b9b9b0001"
        self.title = "Test Note"
        self.content = "This is a test note."
        self.data = {"title": self.title, "content": self.content}
        self.object_id = ObjectId(self.note_id)

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_add_note_service_success(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = self.user

        response, status = add_note_service(self.data)

        self.assertEqual(status, 201)
        self.assertEqual(response["success"], True)
        self.assertEqual(response["message"], "Note added successfully!")
        mock_users_collection.update_one.assert_called_once()

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_add_note_service_user_not_found(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = None

        response, status = add_note_service(self.data)

        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "User not found")

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_add_note_service_missing_data(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = self.user

        response, status = add_note_service({"title": self.title})

        self.assertEqual(status, 400)
        self.assertEqual(response["error"], "Title and content are required")

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_get_notes_service_success(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = {
            "email": self.email,
            "notes": [{"_id": self.object_id, "title": self.title}]
        }

        response, status = get_notes_service()

        self.assertEqual(status, 200)
        self.assertEqual(response["notes"], [{"_id": self.note_id, "title": self.title}])

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_get_notes_service_user_not_found(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = None

        response, status = get_notes_service()

        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "User not found")

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_get_note_by_id_service_success(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = {
            "email": self.email,
            "notes": [{"_id": self.object_id, "title": self.title, "content": self.content}]
        }

        response, status = get_note_by_id_service(self.note_id)

        self.assertEqual(status, 200)
        self.assertEqual(response["note"]["_id"], self.note_id)
        self.assertEqual(response["note"]["title"], self.title)
        self.assertEqual(response["note"]["content"], self.content)

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_get_note_by_id_service_user_not_found(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = None

        response, status = get_note_by_id_service(self.note_id)

        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "User not found")

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_get_note_by_id_service_note_not_found(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = {"email": self.email, "notes": []}

        response, status = get_note_by_id_service(self.note_id)

        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "Note not found")

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_get_note_by_id_service_invalid_id(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = {"email": self.email, "notes": []}

        response, status = get_note_by_id_service("invalid_id")

        self.assertEqual(status, 400)
        self.assertEqual(response["error"], "Invalid note ID format")

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_delete_note_service_success(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = {
            "email": self.email,
            "notes": [{"_id": self.object_id, "title": self.title, "content": self.content}]
        }

        response, status = delete_note_service(self.note_id)

        self.assertEqual(status, 200)
        self.assertEqual(response["success"], True)
        self.assertEqual(response["message"], "Note deleted successfully!")
        mock_users_collection.update_one.assert_called_once()

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_delete_all_notes_service_success(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = {
            "email": self.email,
            "notes": [{"_id": self.object_id, "title": self.title, "content": self.content}]
        }

        response, status = delete_all_notes_service()

        self.assertEqual(status, 200)
        self.assertEqual(response["success"], True)
        self.assertEqual(response["message"], "All notes deleted successfully!")
        mock_users_collection.update_one.assert_called_once()

    @patch("services.notes_service.users_collection")
    @patch("services.notes_service.get_jwt_identity")
    def test_delete_all_notes_service_user_not_found(self, mock_get_jwt_identity, mock_users_collection):
        mock_get_jwt_identity.return_value = self.email
        mock_users_collection.find_one.return_value = None

        response, status = delete_all_notes_service()

        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "User not found")

if __name__ == "__main__":
    unittest.main()

