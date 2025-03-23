from google import genai  # Importing the genai module from the google package
from config import Config  # Importing the Config class to access configuration settings

# Creating a client instance for the genai API using the provided API key
client = genai.Client(api_key=Config.GEMINI_API_KEY)

# Function to generate an answer based on the input data
def generate_answer_service(data):
    try:
        # Using the genai client to generate content based on the question provided in the input data
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # Specifying the model to use for content generation
            contents=data.get("question")  # Extracting the question from the input data
        )
        # Returning the generated answer along with a success status code
        return {"answer": response.text}, 200  
    except Exception as e:
        # Handling any exceptions that occur and returning an error message with a failure status code
        return {"error": str(e)}, 500
