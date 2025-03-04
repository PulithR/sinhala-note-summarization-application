from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client["KuppiDB"]

users_collection = db["users"]
pending_users_collection = db["pending_users"]
otp_storage_signup_collection = db["otp_storage_signup"]
otp_storage_password_reset_collection = db["otp_storage_password_reset"]