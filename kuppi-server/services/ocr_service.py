import pytesseract
from PIL import Image
import io
from config import Config

# Set the Tesseract path to the one specified in the configuration
pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_PATH

def extract_text_from_image(image_file):
    """Extracts text from an uploaded image file."""
    try:
        # Open the uploaded image file from its binary content
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Use Tesseract to extract text from the image, specifying Sinhala language
        extracted_text = pytesseract.image_to_string(image, lang="sin")
        
        # Return the extracted text along with a success status code
        return {"text": extracted_text}, 200
    except Exception as e:
        # Handle any errors that occur during processing and return an error message
        return {"error": str(e)}, 500
