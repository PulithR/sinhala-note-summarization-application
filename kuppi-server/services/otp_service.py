import random  # Importing the random module to generate random numbers

def generate_otp():
    # Generate a 6-digit random number and convert it to a string
    return str(random.randint(100000, 999999))