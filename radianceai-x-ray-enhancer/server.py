
import os
import base64
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "moondream" # Specifically using moondream as requested

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_radiology_prompt():
    return (
        "You are a professional radiologist. Analyze this medical X-ray scan. "
        "Provide your analysis in STRICT JSON format with the following keys: "
        "'findings' (detailed text), 'summary' (one sentence), "
        "'recommendations' (an array of strings), 'severity' (one of: low, moderate, high, critical), "
        "and 'confidence' (a number between 0 and 1). "
        "Focus on detecting fractures, fluid, or structural anomalies."
    )

@app.route('/analyze/ollama', methods=['POST'])
def analyze_ollama():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "No image provided"}), 400

    try:
        # 1. Process and Save the image
        image_b64 = data['image']
        if 'base64,' in image_b64:
            header, image_b64 = image_b64.split('base64,')
        
        filename = data.get('filename', f"scan_{os.urandom(4).hex()}.png")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_b64))

        # 2. Call Ollama with Moondream
        payload = {
            "model": MODEL_NAME,
            "prompt": get_radiology_prompt(),
            "images": [image_b64],
            "stream": False,
            "format": "json"
        }

        print(f"Sending request to Ollama ({MODEL_NAME})...")
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        
        if response.status_code != 200:
            return jsonify({"error": f"Ollama error: {response.text}"}), 500

        ollama_response = response.json()
        analysis_text = ollama_response.get('response', '{}')
        
        # Parse the JSON string from Ollama's response
        try:
            analysis_data = json.loads(analysis_text)
        except json.JSONDecodeError:
            # Fallback if the model returns malformed JSON
            analysis_data = {
                "findings": analysis_text,
                "summary": "Analysis completed with formatting errors.",
                "recommendations": ["Consult a human radiologist for verification."],
                "severity": "moderate",
                "confidence": 0.5
            }

        return jsonify({
            "status": "success",
            "saved_path": filepath,
            "analysis": analysis_data
        }), 200

    except Exception as e:
        print(f"Backend error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def simple_upload():
    """Backup endpoint for just saving files without AI analysis"""
    data = request.json
    try:
        image_data = data['image'].split('base64,')[1]
        filename = data.get('filename', 'manual_save.png')
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_data))
        return jsonify({"message": "Saved", "path": filepath}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"RadianceX Backend running on http://localhost:5000")
    print(f"Targeting Ollama model: {MODEL_NAME}")
    app.run(port=5000, debug=True)
