import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from db import users_collection, otp_storage_password_reset_collection
from services.otp_service import generate_otp
from services.email_service import send_email

MAX_OTP_ATTEMPTS = 3
OTP_EXPIRY_SECONDS = 600  # 10 minutes
OTP_REQUEST_COOLDOWN_SECONDS = 60 


def request_password_reset_service(email):
    """Handles password reset requests by generating an OTP and sending it via email."""
    user = users_collection.find_one({"email": email})
    if not user:
        return {"error": "User not found."}, 404

    otp_data = otp_storage_password_reset_collection.find_one({"email": email})
    if otp_data and (datetime.datetime.now() - otp_data.get("timestamp", datetime.datetime.min)).total_seconds() < OTP_REQUEST_COOLDOWN_SECONDS:
        return {"error": "Please wait before requesting another OTP."}, 429

    otp = generate_otp()
    otp_storage_password_reset_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "timestamp": datetime.datetime.now(), "attempts": 0}},
        upsert=True
    )

    subject = "Your Password Reset OTP"
    content = f"""
            <div style="max-width: 600px; margin: 40px auto; padding: 25px 20px; 
            border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
            background-color: #000000; text-align: center; font-family: Arial, sans-serif; border: 2px solid #ffffff;">

                <h1 style="background-color: #2581eb; color: #ffffff; 
                        padding: 20px; border-radius: 12px; 
                        margin: 20px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                        font-size: 24px; font-weight: bold;">
                    Password Reset Request
                </h1>

                <p style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 40px;">
                    You requested a password reset. Use the OTP below to proceed.
                </p>

                <div style="display: inline-block; background-color: #f4f4f4; 
                            padding: 15px 30px; border-radius: 12px; 
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                            font-size: 32px; font-weight: bold; color: #2c3e50; margin: 20px 0;">
                    {otp}
                </div>

                <p style="font-size: 16px; color: #cfdadb; margin-top: 20px;">
                    This OTP will expire in <strong>10 minutes</strong>.
                </p>

                <hr style="border: none; border-top: 1px solid #444;">

                <p style="font-size: 14px; color: #cfdadb;">
                    If you did not request this OTP, please ignore this email.
                </p>
            </div>
            """

    if not send_email(email, subject, content):
        otp_storage_password_reset_collection.delete_one({"email": email})  # Cleanup if email fails
        return {"error": "Failed to send OTP. Please try again."}, 500

    return {"success": True, "message": "OTP sent to your email."}, 200

   
def verify_password_reset_otp_service(email, otp):
    """Verifies the OTP for password reset."""
    otp_data = otp_storage_password_reset_collection.find_one({"email": email})
    if not otp_data:
        return {"error": "No OTP found for this email."}, 400

    if (datetime.datetime.now() - otp_data["timestamp"]).total_seconds() > OTP_EXPIRY_SECONDS:
        otp_storage_password_reset_collection.delete_one({"email": email})
        return {"error": "OTP has expired. Please request a new one."}, 400

    if otp_data["attempts"] >= MAX_OTP_ATTEMPTS:
        otp_storage_password_reset_collection.delete_one({"email": email})
        return {"error": "Too many incorrect attempts. Request a new OTP."}, 403

    if otp != otp_data["otp"]:
        otp_storage_password_reset_collection.update_one(
            {"email": email}, {"$inc": {"attempts": 1}}
        )
        return {"error": "Invalid OTP. Please try again."}, 400

    otp_storage_password_reset_collection.delete_one({"email": email})  # OTP verified, remove from storage
    return {"success": True, "message": "OTP verified. You can now reset your password."}, 200


def reset_password_service(email, new_password):
    """Resets the user's password after OTP verification."""
    user = users_collection.find_one({"email": email})
    if not user:
        return {"error": "User not found."}, 404

    hashed_password = generate_password_hash(new_password)
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

    return {"success": True, "message": "Password reset successful."}, 200