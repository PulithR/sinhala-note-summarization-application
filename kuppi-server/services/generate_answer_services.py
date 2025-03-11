from google import genai
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)

def generate_answer_service(data):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=data.get("question")
        )
        return {"answer": response.text}, 200  
    except Exception as e:
        return {"error": str(e)}, 500
