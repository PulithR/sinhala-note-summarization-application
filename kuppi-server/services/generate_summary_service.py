from google import genai
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)

def generate_summary_service(data):
    try:
        user_content = data.get("content")
        percentage = data.get("percentage", 50)  # Default to 50% if not provided
        style = data.get("style", "casual")  # Default to casual if not provided
        
        # Map style to descriptive text
        style_descriptions = {
            "casual": "conversational and easy to understand",
            "formal": "professional and straightforward",
            "academic": "scholarly with precise terminology"
        }
        
        style_description = style_descriptions.get(style, style_descriptions["casual"])
        
        # Create a prompt that includes length and style parameters
        prompt = (
            "You are a helpful AI that provides concise summaries of text. "
            f"Summarize the following content in a {style_description} style. "
            f"The summary should be approximately {percentage}% of the original length "
            "(summarize the content in the provided language itself):\n\n"
            f"{user_content}"
        )
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        return {"summary": response.text}, 200
    except Exception as e:
        return {"error": str(e)}, 500