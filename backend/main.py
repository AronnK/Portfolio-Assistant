import os
import uuid
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

from preprocessor import load_parse_pdf, chunkify_text
from rag import Rag

load_dotenv()
app = Flask(__name__)
CORS(app)

rag_systems = {}

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    temp_path = f"./temp_{uuid.uuid4()}.pdf"
    file.save(temp_path)
    raw_text = load_parse_pdf(temp_path)
    os.remove(temp_path)

    print("Sending resume text to Gemini for structuring...")
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        You are an expert resume parser. Analyze the following resume text and convert it into a structured JSON object.
        The JSON object should have keys for sections like "EDUCATION", "PROJECTS", "SKILLS", "EXPERIENCE", "INTERNSHIPS", "HACKATHONS", "CERTIFICATIONS".
        
        For each section, the value should be an array of objects. Each object represents an item. Combine related lines into a single item. For example, a degree and its university are one item. A project title and its description are one item.
        
        Each object must have the following keys:
        - "title": The main title (e.g., project name, degree, job title).
        - "subtitle": The secondary line (e.g., company name, university).
        - "date": The date range, if present.
        - "description": The bullet points or paragraph describing the item. Combine all description lines into a single string.
        
        Extract information accurately. If a field is not present, omit the key. The final output must be only the JSON object, with no other text or markdown formatting.
        Resume Text: --- {raw_text} ---
        """
        response = model.generate_content(prompt)
        json_response_string = response.text.strip().replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(json_response_string)
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
    return jsonify({"answer": answer})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
