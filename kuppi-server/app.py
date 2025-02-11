import datetime
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)

# Secret key for encoding JWT tokens
app.config['JWT_SECRET_KEY'] = 'kuppi#server#sdgp#G50#2025_sk'

# JWTManager
jwt = JWTManager(app)

# Dictionary for testing purposes
users_db = {}

# Signup route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required!"}), 400

    # Check if user already exists
    if email in users_db:
        return jsonify({"error": "User already exists!"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Store user data
    users_db[email] = {"email": email, "password": hashed_password, "name": name, "notes": []}

    # Create JWT token with expiration
    token = create_access_token(identity=email, expires_delta=datetime.timedelta(days=10))

    return jsonify({"success": True, "token": token, "user": {"email": email, "name": name}}), 201


# Login route (authenticate existing user)
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    user = users_db.get(email)

    if user and check_password_hash(user["password"], password):
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
        return jsonify({"success": True, "token": token, "user": {"email": user["email"], "name": user["name"]}}), 200

    return jsonify({"error": "Invalid credentials"}), 401


# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

