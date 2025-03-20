import sys
import os
import unittest
from unittest.mock import patch, MagicMock
import datetime
from werkzeug.security import generate_password_hash
from services.auth_service import (
    signup_user_service,
    verify_signup_otp_service,
    login_user_service,
    OTP_REQUEST_COOLDOWN_SECONDS,
    OTP_EXPIRY_SECONDS,
    MAX_OTP_ATTEMPTS
)

# Add the root directory to the sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from __init__ import create_app  # Now you can import create_app from the root

class TestSignupService(unittest.TestCase):

    @patch("services.auth_service.users_collection")
    @patch("services.auth_service.pending_users_collection")
    @patch("services.auth_service.otp_storage_signup_collection")
    @patch("services.auth_service.send_email")
    @patch("services.auth_service.generate_otp", return_value="123456")
    def test_signup_user_success(
        self, mock_generate_otp, mock_send_email, mock_otp_collection, mock_pending_users_collection, mock_users_collection
    ):
        mock_users_collection.find_one.return_value = None
        mock_otp_collection.find_one.return_value = None
        mock_send_email.return_value = True

        response, status_code = signup_user_service("test@example.com", "Test User", "password123")

        self.assertEqual(status_code, 200)
        self.assertTrue(response["success"])
        mock_otp_collection.update_one.assert_called_once()
        mock_send_email.assert_called_once()

    @patch("services.auth_service.users_collection")
    def test_signup_user_already_exists(self, mock_users_collection):
        mock_users_collection.find_one.return_value = {"email": "test@example.com"}

        response, status_code = signup_user_service("test@example.com", "Test User", "password123")

        self.assertEqual(status_code, 400)
        self.assertIn("error", response)

    @patch("services.auth_service.users_collection")
    @patch("services.auth_service.otp_storage_signup_collection")
    def test_signup_user_cooldown(self, mock_otp_collection, mock_users_collection):
        mock_users_collection.find_one.return_value = None
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "timestamp": datetime.datetime.now(),
        }

        response, status_code = signup_user_service("test@example.com", "Test User", "password123")

        self.assertEqual(status_code, 429)
        self.assertIn("error", response)

    @patch("services.auth_service.users_collection")
    @patch("services.auth_service.otp_storage_signup_collection")
    @patch("services.auth_service.send_email")
    @patch("services.auth_service.generate_otp", return_value="123456")
    def test_signup_user_email_failure(self, mock_generate_otp, mock_send_email, mock_otp_collection, mock_users_collection):
        mock_users_collection.find_one.return_value = None
        mock_otp_collection.find_one.return_value = None
        mock_send_email.return_value = False  # Simulate email send failure

        response, status_code = signup_user_service("test@example.com", "Test User", "password123")

        self.assertEqual(status_code, 500)
        self.assertIn("error", response)
        mock_otp_collection.delete_one.assert_called_once()  # Ensure this is called when email fails

    # @patch("services.auth_service.otp_storage_signup_collection")
    # def test_verify_signup_otp_success(self, mock_otp_collection):
    #     mock_otp_collection.find_one.return_value = {
    #         "email": "test@example.com",
    #         "otp": "123456",
    #         "timestamp": datetime.datetime.now() - datetime.timedelta(seconds=5),  # Ensure this is within the valid range
    #         "attempts": 0,
    #     }

    #     response, status_code = verify_signup_otp_service("test@example.com", "123456")

    #     self.assertEqual(status_code, 200)
    #     self.assertTrue(response["success"])
    #     mock_otp_collection.delete_one.assert_called_once()


    @patch("services.auth_service.otp_storage_signup_collection")
    def test_verify_signup_otp_expired(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now() - datetime.timedelta(seconds=OTP_EXPIRY_SECONDS + 1),
            "attempts": 0,
        }

        response, status_code = verify_signup_otp_service("test@example.com", "123456")

        self.assertEqual(status_code, 400)
        self.assertIn("error", response)
        mock_otp_collection.delete_one.assert_called_once()

    @patch("services.auth_service.otp_storage_signup_collection")
    def test_verify_signup_otp_too_many_attempts(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now(),
            "attempts": MAX_OTP_ATTEMPTS,
        }

        response, status_code = verify_signup_otp_service("test@example.com", "123456")

        self.assertEqual(status_code, 403)
        self.assertIn("error", response)
        mock_otp_collection.delete_one.assert_called_once()

    @patch("services.auth_service.otp_storage_signup_collection")
    def test_verify_signup_otp_invalid(self, mock_otp_collection):
        mock_otp_collection.find_one.return_value = {
            "email": "test@example.com",
            "otp": "123456",
            "timestamp": datetime.datetime.now(),
            "attempts": 1,
        }

        response, status_code = verify_signup_otp_service("test@example.com", "654321")

        self.assertEqual(status_code, 400)
        self.assertIn("error", response)
        mock_otp_collection.update_one.assert_called_once()

    @patch("services.auth_service.users_collection")
    def test_login_user_success(self, mock_users_collection):
        app = create_app()  # Create app instance for context
        with app.app_context():
            mock_users_collection.find_one.return_value = {
                "email": "test@example.com",
                "password": generate_password_hash("correctpassword"),
                "name": "Test User"  # Add name here
            }

            response, status_code = login_user_service("test@example.com", "correctpassword")
            self.assertEqual(status_code, 200)
            self.assertTrue(response["success"])

    @patch("services.auth_service.users_collection")
    def test_login_user_invalid_credentials(self, mock_users_collection):
        mock_users_collection.find_one.return_value = {"email": "test@example.com", "password": "wrongpassword"}

        response, status_code = login_user_service("test@example.com", "incorrectpassword")

        self.assertEqual(status_code, 401)
        self.assertIn("error", response)

if __name__ == "__main__":
    unittest.main()
