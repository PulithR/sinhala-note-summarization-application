import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from services.otp_service import generate_otp
from services.email_service import send_email
from db import users_collection, pending_users_collection, otp_storage_signup_collection

MAX_OTP_ATTEMPTS = 3
OTP_EXPIRY_SECONDS = 600  # 10 minutes
OTP_REQUEST_COOLDOWN_SECONDS = 60  # 1 minute


def signup_user_service(email, name, password):
    if not email or not password or not name:
        return {"error": "Email, name, and password are required!"}, 400
    
    if users_collection.find_one({"email": email}):
        return {"error": "User already exists!"}, 400
    
    otp_data = otp_storage_signup_collection.find_one({"email": email})
    if otp_data and (datetime.datetime.now() - otp_data.get("timestamp")).total_seconds() < OTP_REQUEST_COOLDOWN_SECONDS:
        return {"error": "Please wait before requesting another OTP."}, 429
    
    otp = generate_otp()
    
    otp_storage_signup_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "timestamp": datetime.datetime.now(), "attempts": 0}},
        upsert=True
    )
    
    pending_users_collection.update_one(
        {"email": email},
        {"$set": {"email": email, "name": name, "password": generate_password_hash(password)}},
        upsert=True
    )
    
    subject = "Your OTP for Kuppi Registration"
    content = f"""
            <div style="max-width: 600px; margin: 40px auto; padding: 25px 20px; 
            border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
            background-color: #000000; text-align: center; font-family: Arial, sans-serif; border: 2px solid #ffffff;" >

                <h1 style="background-color: #2581eb; color: #ffffff; 
                        padding: 20px; border-radius: 12px; 
                        margin: 20px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                        font-size: 24px; font-weight: bold;">
                    Hello from Kuppi
                </h1>

                <p style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 40px;">
                    Use the OTP below to complete your registration.
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
        otp_storage_signup_collection.delete_one({"email": email})
        pending_users_collection.delete_one({"email": email})
        return {"error": "Failed to send OTP. Please try again."}, 500
    
    return {"success": True, "message": "OTP sent to your email. Please verify to complete registration."}, 200


def verify_signup_otp_service(email, otp):
    otp_data = otp_storage_signup_collection.find_one({"email": email})
    if not otp_data:
        return {"error": "No OTP found for this email."}, 400
    
    if (datetime.datetime.now() - otp_data["timestamp"]).total_seconds() > OTP_EXPIRY_SECONDS:
        otp_storage_signup_collection.delete_one({"email": email})
        return {"error": "OTP has expired. Please request a new one."}, 400
    
    if otp_data["attempts"] >= MAX_OTP_ATTEMPTS:
        otp_storage_signup_collection.delete_one({"email": email})
        return {"error": "Too many incorrect attempts. Request a new OTP."}, 403
    
    if otp != otp_data["otp"]:
        otp_storage_signup_collection.update_one({"email": email}, {"$inc": {"attempts": 1}})
        return {"error": "Invalid OTP. Please try again."}, 400
    
    user_data = pending_users_collection.find_one_and_delete({"email": email})
    if not user_data:
        return {"error": "User data not found."}, 400
    
    users_collection.insert_one({
        "email": user_data["email"],
        "password": user_data["password"],
        "name": user_data["name"],
        "notes": []
    })
    
    otp_storage_signup_collection.delete_one({"email": email})
    
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(days=10))
    
    return {"success": True, "token": token, "user": {"email": email, "name": user_data["name"]}}, 201

def login_user_service(email, password):
    if not email or not password:
        return {"error": "Email and password are required!"}, 400
    
    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return {"error": "Invalid email or password."}, 401
    
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
    
    return {"success": True, "token": token, "user": {"email": user["email"], "name": user["name"]}}, 200