import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user_model import users_db, otp_storage_password_reset
from services.otp_service import generate_otp
from services.email_service import send_email

MAX_OTP_ATTEMPTS = 3
OTP_EXPIRY_SECONDS = 600  # 10 minutes
OTP_REQUEST_COOLDOWN_SECONDS = 60 

def request_password_reset_service():
  pass


def verify_password_reset_otp_service():
  pass


def reset_password_service():
  pass