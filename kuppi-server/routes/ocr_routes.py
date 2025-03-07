from flask import Blueprint, request, jsonify
from services.ocr_service import extract_text_from_image

ocr_bp = Blueprint("ocr", __name__)

@ocr_bp.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    result, status_code = extract_text_from_image(image_file)

    return jsonify(result), status_code