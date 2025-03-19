from pymongo import MongoClient
from config import Config
import atexit

# Create MongoDB Client
client = MongoClient(Config.MONGO_URI)
db = client["KuppiDB"]

# Define Collections
users_collection = db["users"]
pending_users_collection = db["pending_users"]
otp_storage_signup_collection = db["otp_storage_signup"]
otp_storage_password_reset_collection = db["otp_storage_password_reset"]

# Close MongoDB connection on exit
atexit.register(client.close)
