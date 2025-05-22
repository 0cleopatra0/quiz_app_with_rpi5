import os
import threading
import time
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

# Environment vars
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'phi3:mini')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))

app = Flask(__name__)
CORS(app)

# In-memory storage only
users = {}  # user_id -> {'intellect': 'normal'}
pending_answers = {}  # (user_id, question) -> {'ready': False, 'answer': ''}

@app.route('/')
def index():
    return jsonify({"message": "Fast LLM API is running."})

@app.route('/ask_async', methods=['POST'])
def ask_async():
    data = request.get_json(force=True, silent=True) or {}
    user_id = data.get('user_id')
    question = data.get('question')
    if not user_id or not question:
        return jsonify({'error': 'user_id and question are required'}), 400

    user = users.get(user_id, {'intellect': 'normal'})
    intellect = user.get('intellect', 'normal')

    instruction = {
        'high': "Explain in detail:",
        'low': "Explain simply:",
    }.get(intellect, "Answer this:")

    prompt = f"{instruction} {question}"
    key = (user_id, question)
    pending_answers[key] = {'ready': False, 'answer': ''}

    def generate_and_store():
        try:
            response = requests.post(
                f"{OLLAMA_HOST}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "num_predict": 256,
                    "stream": False
                },
                timeout=120
            )
            response.raise_for_status()
            answer = response.json().get('response', 'Sorry, no response.')
        except requests.exceptions.RequestException as e:
            answer = f"Error: {e}"
        pending_answers[key] = {'ready': True, 'answer': answer}

    threading.Thread(target=generate_and_store).start()
    return jsonify({"status": "processing"})

@app.route('/check_answer')
def check_answer():
    user_id = request.args.get('user_id')
    question = request.args.get('question')
    key = (user_id, question)
    if not user_id or not question:
        return jsonify({'error': 'user_id and question required'}), 400
    result = pending_answers.get(key, {'ready': False, 'answer': ''})
    return jsonify(result)

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json(force=True, silent=True) or {}
    user_id = data.get('user_id')
    question = data.get('question')
    if not user_id or not question:
        return jsonify({'error': 'user_id and question are required'}), 400

    user = users.get(user_id, {'intellect': 'normal'})
    intellect = user.get('intellect', 'normal')

    instruction = {
        'high': "Explain in detail:",
        'low': "Explain simply:",
    }.get(intellect, "Answer this:")

    prompt = f"{instruction} {question}"

    try:
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "num_predict": 50,
                "stream": False
            },
            timeout=30
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Model request failed: {e}'}), 500

    answer = response.json().get('response', 'Sorry, no response.')
    return jsonify({
        'user_id': user_id,
        'question': question,
        'answer': answer
    })

@app.route('/user/<user_id>', methods=['PUT'])
def set_user_intellect(user_id):
    data = request.get_json(force=True, silent=True) or {}
    intellect = data.get('intellect', 'normal').lower()
    if intellect not in {'low', 'normal', 'high'}:
        return jsonify({'error': 'Intellect must be "low", "normal", or "high".'}), 400
    users[user_id] = {'intellect': intellect}
    return jsonify({'user_id': user_id, 'intellect': intellect})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=False)