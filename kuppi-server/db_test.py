from db import db

test_collection = db["test_collection"]

test_user = {"name": "Test User", "email": "test@gmail.com"}
result = test_collection.insert_one(test_user)

print("Inserted into ID: ", result.inserted_id)