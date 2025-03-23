from flask_mail import Message
from flask import current_app

# Function to send an email
def send_email(email, subject, content):
    # Create a new email message with the given subject and recipient
    msg = Message(subject, recipients=[email])
    # Set the email content as HTML
    msg.html = content
    try:
        # Access the Flask-Mail extension from the current app context
        mail = current_app.extensions['mail']
        # Send the email
        mail.send(msg)
    except Exception as e:
        # Print an error message if sending fails
        print(f"Error sending email: {e}")
        return False
    # Return True if the email was sent successfully
    return True