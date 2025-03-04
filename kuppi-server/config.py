import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465  
    MAIL_USE_TLS = False  
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_USERNAME') 
    MONGO_URI = os.getenv('MONGO_URI')
