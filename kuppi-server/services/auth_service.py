import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from services.otp_service import generate_otp
from services.email_service import send_email
from db import users_collection, pending_users_collection, otp_storage_signup_collection

# Constants for OTP handling
MAX_OTP_ATTEMPTS = 3  # Maximum number of incorrect OTP attempts allowed
OTP_EXPIRY_SECONDS = 600  # OTP validity duration in seconds (10 minutes)
OTP_REQUEST_COOLDOWN_SECONDS = 60  # Cooldown time before requesting a new OTP (1 minute)

# Service to handle user signup
def signup_user_service(email, name, password):
    # Validate input fields
    if not email or not password or not name:
        return {"error": "Email, name, and password are required!"}, 400
    
    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return {"error": "User already exists!"}, 400
    
    # Check if the user is requesting OTP too frequently
    otp_data = otp_storage_signup_collection.find_one({"email": email})
    if otp_data and (datetime.datetime.now() - otp_data.get("timestamp")).total_seconds() < OTP_REQUEST_COOLDOWN_SECONDS:
        return {"error": "Please wait before requesting another OTP."}, 429
    
    # Generate a new OTP
    otp = generate_otp()
    
    try:
        # Save OTP details in the database
        otp_storage_signup_collection.update_one(
            {"email": email},
            {"$set": {"otp": otp, "timestamp": datetime.datetime.now(), "attempts": 0}},
            upsert=True
        )
        
        # Save pending user details in the database
        pending_users_collection.update_one(
            {"email": email},
            {"$set": {"email": email, "name": name, "password": generate_password_hash(password)}},
            upsert=True
        )
        
        # Prepare the email content for OTP
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
        
        # Attempt to send the OTP email
        if not send_email(email, subject, content):
            # Clean up database entries if email sending fails
            otp_storage_signup_collection.delete_one({"email": email})
            pending_users_collection.delete_one({"email": email})
            return {"error": "Failed to send OTP. Please try again."}, 500
        
        # Successfully sent OTP
        return {"success": True, "message": "OTP sent to your email. Please verify to complete registration."}, 200
    except Exception as e:
        # Handle any unexpected errors and clean up
        otp_storage_signup_collection.delete_one({"email": email})
        pending_users_collection.delete_one({"email": email})
        return {"error": f"An error occurred: {str(e)}"}, 500

# Service to verify the OTP during signup
def verify_signup_otp_service(email, otp):
    # Retrieve OTP data for the given email
    otp_data = otp_storage_signup_collection.find_one({"email": email})
    if not otp_data:
        return {"error": "No OTP found for this email."}, 400
    
    # Check if the OTP has expired
    if (datetime.datetime.now() - otp_data["timestamp"]).total_seconds() > OTP_EXPIRY_SECONDS:
        otp_storage_signup_collection.delete_one({"email": email})
        return {"error": "OTP has expired. Please request a new one."}, 400
    
    # Check if the maximum number of attempts has been exceeded
    if otp_data["attempts"] >= MAX_OTP_ATTEMPTS:
        otp_storage_signup_collection.delete_one({"email": email})
        return {"error": "Too many incorrect attempts. Request a new OTP."}, 403
    
    # Validate the provided OTP
    if otp != otp_data["otp"]:
        otp_storage_signup_collection.update_one({"email": email}, {"$inc": {"attempts": 1}})
        return {"error": "Invalid OTP. Please try again."}, 400
    
    # Retrieve and delete pending user data
    user_data = pending_users_collection.find_one_and_delete({"email": email})
    if not user_data:
        return {"error": "User data not found."}, 400
    
    # Add the user to the main users collection
    users_collection.insert_one({
        "email": user_data["email"],
        "password": user_data["password"],
        "name": user_data["name"],
        "notes": []  # Initialize with an empty notes list
    })
    
    # Clean up OTP data after successful verification
    otp_storage_signup_collection.delete_one({"email": email})
    
    # Generate a JWT token for the user
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(days=10))
    
    # Return success response with the token and user details
    return {"success": True, "token": token, "user": {"email": email, "name": user_data["name"]}}, 201

# Service to handle user login
def login_user_service(email, password):
    # Validate input fields
    if not email or not password:
        return {"error": "Email and password are required!"}, 400
    
    # Retrieve user data from the database
    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return {"error": "Invalid email or password."}, 401
    
    # Generate a JWT token for the user
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
    
    # Return success response with the token and user details
    return {"success": True, "token": token, "user": {"email": user["email"], "name": user["name"]}}, 200
