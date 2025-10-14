import os
import uuid
import json
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

from preprocessor import load_parse_pdf, chunkify_text
from rag import Rag

load_dotenv()
app = Flask(__name__)
CORS(app)

parse_cache = {}
rag_systems = {}

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    file_content = file.read()
    
    file_hash = hashlib.md5(file_content).hexdigest()
    if file_hash in parse_cache:
        print("Returning cached parsing result.")
        return jsonify(parse_cache[file_hash])

    temp_path = f"./temp_{uuid.uuid4()}.pdf"
    with open(temp_path, 'wb') as f:
        f.write(file_content)
    raw_text = load_parse_pdf(temp_path)
    os.remove(temp_path)

    print("Sending resume text to Gemini for structuring (Cache Miss)...")
    try:
        model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
        prompt = f"""
        You are an expert resume parser. Analyze the following resume text and convert it into a structured JSON object.
        The JSON object should have keys for sections like "EDUCATION", "PROJECTS", "SKILLS", "EXPERIENCE", "INTERNSHIPS", "HACKATHONS", "CERTIFICATIONS".
        For each section, the value should be an array of objects. Each object represents an item. Combine related lines into a single item.
        Each object must have "title", and can optionally have "subtitle", "date", and "description".
        The final output must be only the JSON object, with no other text or markdown formatting.
        Resume Text: --- {raw_text} ---
        """
        response = model.generate_content(prompt)
        json_response_string = response.text.strip().replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(json_response_string)
        parse_cache[file_hash] = parsed_json
        print("Successfully parsed resume with Gemini.")
        return jsonify(parsed_json)
    except Exception as e:
        print(f"Error during AI parsing: {e}")
        return jsonify({"error": "Failed to parse resume using AI."}), 500

@app.route('/api/build-bot', methods=['POST'])
def build_bot():
    if 'resumeFile' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    resume_file = request.files['resumeFile']
    enrichments = json.loads(request.form.get('enrichments', '{}'))
    parsed_data = json.loads(request.form.get('parsedData', '{}'))

    full_text_content = ""
    for section, items in parsed_data.items():
        full_text_content += f"\n\nSection: {section}\n"
        for i, item in enumerate(items):
            item_key = f"{section}-{i}"
            full_text_content += f"\n- Title: {item.get('title', 'N/A')}"
            if item.get('subtitle'): full_text_content += f"\n  Subtitle: {item.get('subtitle')}"
            if item.get('date'): full_text_content += f"\n  Date: {item.get('date')}"
            if item.get('description'): full_text_content += f"\n  Description: {item.get('description')}"
            if enrichments.get(item_key):
                full_text_content += f"\n  Additional User Context: {enrichments[item_key]}"
    
    all_chunks = chunkify_text(full_text_content)
    chatbot_id = str(uuid.uuid4())
    collection_name = f"chatbot_{chatbot_id}"
    
    rag_system = Rag(collection_name=collection_name)
    rag_system.set_doc_pipeline(chunks=all_chunks)
    
    rag_systems[chatbot_id] = rag_system
    
    print(f"Successfully built and indexed bot with ID: {chatbot_id}")
    return jsonify({"message": "Bot built successfully", "chatbot_id": chatbot_id})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    chatbot_id, query = data.get('chatbot_id'), data.get('query')

    if not chatbot_id or not query:
        return jsonify({"error": "Missing chatbot_id or query"}), 400
        
    rag_system = rag_systems.get(chatbot_id)
    if not rag_system:
        return jsonify({"error": "Invalid chatbot_id or bot not found"}), 404
        
    answer = rag_system.answer_query(query)
    memory_info = rag_system.get_memory_summary()
    
    return jsonify({"answer": answer, "memory": memory_info})

@app.route('/api/chat/reset', methods=['POST'])
def reset_chat():
    data = request.get_json()
    chatbot_id = data.get('chatbot_id')
    
    if not chatbot_id:
        return jsonify({"error": "Missing chatbot_id"}), 400
        
    rag_system = rag_systems.get(chatbot_id)
    if not rag_system:
        return jsonify({"error": "Invalid chatbot_id or bot not found"}), 404
    
    rag_system.clear_memory()
    print(f"Cleared memory for chatbot ID: {chatbot_id}")
    return jsonify({"message": "Conversation memory cleared successfully"})

@app.route('/api/chat/memory/<chatbot_id>', methods=['GET'])
def get_memory(chatbot_id):
    rag_system = rag_systems.get(chatbot_id)
    if not rag_system:
        return jsonify({"error": "Invalid chatbot_id or bot not found"}), 404
    
    memory_info = rag_system.get_memory_summary()
    return jsonify(memory_info)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)