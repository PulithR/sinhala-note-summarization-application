from google import genai
from config import Config

# Initialize the genai client with the API key from the configuration
client = genai.Client(api_key=Config.GEMINI_API_KEY)

def generate_summary_service(data):
    try:
        # Extract the content to summarize from the input data
        user_content = data.get("content")
        
        # Get the percentage for the summary length, defaulting to 50% if not provided
        percentage = data.get("percentage", 50)
        
        # Get the desired style of the summary, defaulting to "casual" if not provided
        style = data.get("style", "casual")
        
        # Define descriptions for different summary styles
        style_descriptions = {
            "casual": "conversational and easy to understand",
            "formal": "professional and straightforward",
            "academic": "scholarly with precise terminology"
        }
        
        # Get the description for the selected style, defaulting to "casual" if the style is not recognized
        style_description = style_descriptions.get(style, style_descriptions["casual"])
        
        # Construct the prompt for the AI model, including the style and length parameters
        prompt = (
            "You are a helpful AI that provides concise summaries of text. "
            f"Summarize the following content in a {style_description} style. "
            f"The summary should be approximately {percentage}% of the original length "
            "(summarize the content in the provided language itself):\n\n"
            f"{user_content}"
        )
        
        # Use the genai client to generate the summary based on the prompt
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Return the generated summary along with a success status code
        return {"summary": response.text}, 200
    except Exception as e:
        # Handle any exceptions and return an error message with a failure status code
        return {"error": str(e)}, 500