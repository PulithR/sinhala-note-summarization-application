from flask_mail import Message
from flask import current_app

def send_email(email, subject, content):
    msg = Message(subject, recipients=[email])
    msg.html = content
    try:
        mail = current_app.extensions['mail']
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    return True