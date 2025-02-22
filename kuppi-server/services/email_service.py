from flask_mail import Message
from flask import current_app

def send_email(email, otp):
    print(otp)
    msg = Message('Your OTP for Registration',
                      recipients=[email])
    msg.html = f"""
    <div style="max-width: 600px; margin: 40px auto; padding: 25px 20px; 
        border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
        background-color: #000000; text-align: center; font-family: Arial, sans-serif; border: 2px solid #000000;" >

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
    try:
        mail = current_app.extensions['mail']
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    return True
