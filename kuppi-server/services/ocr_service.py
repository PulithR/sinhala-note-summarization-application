import pytesseract
from PIL import Image
import io
from config import Config

# Set the Tesseract path
pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_PATH

def extract_text_from_image(image_file):
    """Extracts text from an uploaded image file."""
    try:
        image = Image.open(io.BytesIO(image_file.read()))
        extracted_text = pytesseract.image_to_string(image, lang="sin")
        return {"text": extracted_text}, 200
    except Exception as e:
        return {"error": str(e)}, 500
