from flask_mail import Message
from flask import current_app

def send_email(email, otp):
    msg = Message('Subject', recipients=[email])
    msg.body = f'message {otp}'
    try:
        mail = current_app.get('mail')
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    return True