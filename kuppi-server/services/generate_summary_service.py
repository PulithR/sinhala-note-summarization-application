from google import genai
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)

def generate_summary_service(data):
    try:
        user_content = data.get("content")

        prompt = (
            "You are a helpful AI that provides concise summaries of text. "
            "Summarize the following content in a clear and informative way(summarize the content in the provided language itself):\n\n"
            f"{user_content}"
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return {"summary": response.text}, 200
    except Exception as e:
        return {"error": str(e)}, 500
