import unittest
from unittest.mock import patch, MagicMock
import datetime
from services.password_reset_service import (
    request_password_reset_service,
    verify_password_reset_otp_service,
    reset_password_service,
    OTP_REQUEST_COOLDOWN_SECONDS,
    OTP_EXPIRY_SECONDS,
    MAX_OTP_ATTEMPTS
)

class TestPasswordResetService(unittest.TestCase):

    @patch("services.password_reset_service.users_collection")
    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    @patch("services.password_reset_service.send_email")
    @patch("services.password_reset_service.generate_otp", return_value="123456")
    def test_request_password_reset_success(
        self, mock_generate_otp, mock_send_email, mock_otp_collection, mock_users_collection
    ):
        mock_users_collection.find_one.return_value = {"email": "test@example.com"}
        mock_otp_collection.find_one.return_value = None
        mock_send_email.return_value = True

        response, status_code = request_password_reset_service("test@example.com")

        self.assertEqual(status_code, 200)
        self.assertTrue(response["success"])
        mock_otp_collection.update_one.assert_called_once()
        mock_send_email.assert_called_once()

    @patch("services.password_reset_service.users_collection")
    def test_request_password_reset_user_not_found(self, mock_users_collection):
        mock_users_collection.find_one.return_value = None

        response, status_code = request_password_reset_service("notfound@example.com")

        self.assertEqual(status_code, 404)
        self.assertIn("error", response)

    @patch("services.password_reset_service.users_collection")
    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    def test_request_password_reset_cooldown(self, mock_otp_collection, mock_users_collection):
        mock_users_collection.find_one.return_value = {"email": "test@example.com"}
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "timestamp": datetime.datetime.now(),
        }

        response, status_code = request_password_reset_service("test@example.com")

        self.assertEqual(status_code, 429)
        self.assertIn("error", response)

    @patch("services.password_reset_service.users_collection")
    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    @patch("services.password_reset_service.send_email", return_value=False)
    def test_request_password_reset_email_failure(self, mock_send_email, mock_otp_collection, mock_users_collection):
        mock_users_collection.find_one.return_value = {"email": "test@example.com"}
        mock_otp_collection.find_one.return_value = None

        response, status_code = request_password_reset_service("test@example.com")

        self.assertEqual(status_code, 500)
        self.assertIn("error", response)
        mock_otp_collection.delete_one.assert_called_once()

    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    def test_verify_password_reset_otp_success(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now(),
            "attempts": 0,
        }

        response, status_code = verify_password_reset_otp_service("test@example.com", "123456")

        self.assertEqual(status_code, 200)
        self.assertTrue(response["success"])
        mock_otp_collection.delete_one.assert_called_once()

    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    def test_verify_password_reset_otp_expired(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now() - datetime.timedelta(seconds=OTP_EXPIRY_SECONDS + 1),
            "attempts": 0,
        }

        response, status_code = verify_password_reset_otp_service("test@example.com", "123456")

        self.assertEqual(status_code, 400)
        self.assertIn("error", response)
        mock_otp_collection.delete_one.assert_called_once()

    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    def test_verify_password_reset_otp_too_many_attempts(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now(),
            "attempts": MAX_OTP_ATTEMPTS,
        }

        response, status_code = verify_password_reset_otp_service("test@example.com", "123456")

        self.assertEqual(status_code, 403)
        self.assertIn("error", response)
        mock_otp_collection.delete_one.assert_called_once()

    @patch("services.password_reset_service.otp_storage_password_reset_collection")
    def test_verify_password_reset_otp_invalid(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now(),
            "attempts": 1,
        }

        response, status_code = verify_password_reset_otp_service("test@example.com", "654321")

        self.assertEqual(status_code, 400)
        self.assertIn("error", response)
        mock_otp_collection.update_one.assert_called_once()

    @patch("services.password_reset_service.users_collection")
    def test_reset_password_success(self, mock_users_collection):
        mock_users_collection.find_one.return_value = {"email": "test@example.com"}

        response, status_code = reset_password_service("test@example.com", "new_password123")

        self.assertEqual(status_code, 200)
        self.assertTrue(response["success"])
        mock_users_collection.update_one.assert_called_once()

    @patch("services.password_reset_service.users_collection")
    def test_reset_password_user_not_found(self, mock_users_collection):
        mock_users_collection.find_one.return_value = None

        response, status_code = reset_password_service("notfound@example.com", "new_password123")

        self.assertEqual(status_code, 404)
        self.assertIn("error", response)

if __name__ == "__main__":
    unittest.main()
