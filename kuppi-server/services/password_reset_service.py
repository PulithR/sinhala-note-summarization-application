import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user_model import users_db, otp_storage_password_reset
from services.otp_service import generate_otp
from services.email_service import send_email

MAX_OTP_ATTEMPTS = 3
OTP_EXPIRY_SECONDS = 600  # 10 minutes
OTP_REQUEST_COOLDOWN_SECONDS = 60  # 1 minute

def request_password_reset_service():
  """Handles password reset requests by generating an OTP and sending it via email."""
  if email not in users_db:
      return {"error": "User not found."}, 404

  otp_data = otp_storage_password_reset.get(email)
  if otp_data and (datetime.datetime.now() - otp_data.get("timestamp", datetime.datetime.min)).total_seconds() < OTP_REQUEST_COOLDOWN_SECONDS:
      return {"error": "Please wait before requesting another OTP."}, 429

  otp = generate_otp()
  otp_storage_password_reset[email] = {
      "otp": otp,
      "timestamp": datetime.datetime.now(),
      "attempts": 0
  }

  subject = "Your Password Reset OTP"
  content = f"""
      <p>You requested a password reset. Use the OTP below to proceed:</p>
      <h2>{otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
  """

  if not send_email(email, subject, content):
      del otp_storage_password_reset[email]  # Cleanup if email fails
      return {"error": "Failed to send OTP. Please try again."}, 500

  return {"success": True, "message": "OTP sent to your email."}, 200



def verify_password_reset_otp_service():
  pass


def reset_password_service():
  pass