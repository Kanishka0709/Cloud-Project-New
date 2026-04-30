from flask import Flask, request, jsonify
import os
from google import genai

app = Flask(__name__)

# Set your Gemini API key as an environment variable before running this script
# export GEMINI_API_KEY=your-gemini-api-key

def gemini_generate(user_message):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    model = "gemini-2.5-pro"
    contents = [
        {"role": "user", "parts": [{"text": user_message}]}
    ]
    generate_content_config = {"response_mime_type": "text/plain"}
    response = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response += chunk.text
    return response

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'reply': "No message provided."}), 400
    try:
        reply = gemini_generate(user_message)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'reply': f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5001) 