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

    if __name__ == "__main__":
    unittest.main()