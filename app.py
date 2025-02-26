from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

# Ollama API endpoint
OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"
# Choose the model you want to use (adjust as needed)
MODEL_NAME = "qwen2.5-coder:7b"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    
    payload = {
        "model": MODEL_NAME,
        "prompt": user_message
    }
    
    try:
        # Use stream=True to process a streaming response
        response = requests.post(OLLAMA_API_URL, json=payload, stream=True)
        response.raise_for_status()
        
        full_response = ""
        # Iterate over all lines returned by the API
        for line in response.iter_lines():
            if line:
                try:
                    json_line = json.loads(line.decode("utf-8"))
                    piece = json_line.get("response", "")
                    full_response += piece
                except Exception as e:
                    print("Error processing line:", e)
        bot_response = full_response if full_response else "No response from model."
    except Exception as e:
        bot_response = f"Error: {e}"
    
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
