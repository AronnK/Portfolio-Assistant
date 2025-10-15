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
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    print(f"CRITICAL: Failed to configure Google AI. Check your GOOGLE_API_KEY. Error: {e}")

parse_cache = {}

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
    with open(temp_path, 'wb') as f: f.write(file_content)
    raw_text = load_parse_pdf(temp_path)
    os.remove(temp_path)

    try:
        model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
        prompt = f"""
            You are a highly sophisticated AI resume parser. Your primary function is to meticulously analyze raw text from a resume and convert it into a structured JSON object.

            **Goal:** Extract key information and structure it according to the specified JSON schema below.

            **JSON Output Schema:**

            The final output MUST be a single JSON object with the following structure. Pay close attention to the data types and required/optional fields.

            {{
            "personal_details": {{
                "name": "string | null",
                "email": "string | null",
                "phone": "string | null",
                "links": [
                {{
                    "type": "linkedin | github | portfolio | other",
                    "url": "string"
                }}
                ]
            }},
            "summary": "string | null",
            "EDUCATION": [
                {{
                "title": "string",
                "subtitle": "string | null",
                "date": "string | null",
                "description": "string | null"
                }}
            ],
            "EXPERIENCE": [
                {{
                "title": "string",
                "subtitle": "string | null",
                "date": "string | null",
                "description": "string"
                }}
            ],
            "PROJECTS": [
                {{
                "title": "string",
                "subtitle": "string | null",
                "date": "string | null",
                "description": "string"
                }}
            ],
            "SKILLS": [
                {{
                "title": "string",
                "description": "string | null"
                }}
            ],
            "CERTIFICATIONS": [
                {{
                "title": "string",
                "subtitle": "string | null",
                "date": "string | null"
                }}
            ]
            }}

            **Strict Instructions & Edge Case Handling:**

            1.  **JSON ONLY:** The output MUST be a single, valid JSON object and nothing else. Do not wrap it in markdown backticks (` ```json `) or add any explanatory text before or after the JSON.
            2.  **Extract Personal Details:** At the top of the resume, find the candidate's full name, email address, phone number, and any URLs for LinkedIn, GitHub, or personal portfolios. Populate the `personal_details` object with this information.
            3.  **Intelligent Mapping:** Intelligently map resume sections to the correct keys. For example, "Work History" or "Internships" should be mapped to the "EXPERIENCE" array. "Technical Skills" or "Languages" should be mapped to the "SKILLS" array.
            4.  **Consolidate Information:** Combine related lines. Bullet points describing a single job (`- Led a team...`, `- Developed a feature...`) should be merged into one `description` field with `\\n` as the separator between points.
            5.  **Handle Missing Data:** If a section (like "CERTIFICATIONS") is not present in the resume, omit the key entirely from the JSON. If an optional field within an item (like `date`) is missing, omit that key for that specific item. Do not invent data.

            --- RESUME TEXT START ---
            {raw_text}
            --- RESUME TEXT END ---
            """
        response = model.generate_content(prompt)
        json_response_string = response.text.strip().replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(json_response_string)
        parse_cache[file_hash] = parsed_json
        return jsonify(parsed_json)
    except Exception as e:
        print(f"Error during AI parsing: {e}")
        return jsonify({"error": f"Failed to parse resume using AI: {e}"}), 500

@app.route('/api/build-bot', methods=['POST'])
def build_bot():
    if 'resumeFile' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    try:
        provider_name = request.form.get('provider_name', 'google')
        api_key = request.form.get('api_key') or os.getenv("GOOGLE_API_KEY")
        temp_collection_name = f"temp-{uuid.uuid4()}"
        enrichments = json.loads(request.form.get('enrichments', '{}'))
        parsed_data = json.loads(request.form.get('parsedData', '{}'))

        full_text_content = ""
        
        if 'personal_details' in parsed_data and isinstance(parsed_data['personal_details'], dict):
            pd = parsed_data['personal_details']
            full_text_content += "PERSONAL DETAILS:\n"
            if pd.get('name'): 
                full_text_content += f"Name: {pd['name']}\n"
            if pd.get('email'): 
                full_text_content += f"Email: {pd['email']}\n"
            if pd.get('phone'): 
                full_text_content += f"Phone: {pd['phone']}\n"
            if pd.get('links') and isinstance(pd['links'], list):
                for link in pd['links']:
                    if isinstance(link, dict):
                        full_text_content += f"{link.get('type', 'Link').title()}: {link.get('url', '')}\n"
        
        if 'summary' in parsed_data and isinstance(parsed_data['summary'], str):
            full_text_content += f"\nPROFESSIONAL SUMMARY:\n{parsed_data['summary']}\n"

        for section, items in parsed_data.items():
            if not isinstance(items, list):
                continue
            
            if len(items) == 0:
                continue
                
            full_text_content += f"\n\n=== {section.upper()} ===\n"
            
            for i, item in enumerate(items):
                if not isinstance(item, dict):
                    continue
                
                item_key = f"{section}-{i}"
                
                full_text_content += f"\n--- Entry {i+1} ---\n"
                full_text_content += f"Title: {item.get('title', 'N/A')}\n"
                
                if item.get('subtitle'): 
                    full_text_content += f"Organization/Institution: {item.get('subtitle')}\n"
                if item.get('date'): 
                    full_text_content += f"Duration: {item.get('date')}\n"
                if item.get('description'): 
                    full_text_content += f"Description: {item.get('description')}\n"
                
                if enrichments.get(item_key):
                    full_text_content += f"Additional Context: {enrichments[item_key]}\n"
        
        all_chunks = chunkify_text(full_text_content)
        rag_system = Rag(
            collection_name=temp_collection_name, 
            provider_name=provider_name, 
            api_key=api_key
        )
        rag_system.set_doc_pipeline(chunks=all_chunks)
        
        print(f"Bot built successfully: {temp_collection_name}")
        return jsonify({
            "message": "Temporary bot built successfully", 
            "collection_name": temp_collection_name
        })
        
    except Exception as e:
        print(f"Error building bot: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to build bot: {str(e)}"}), 500


@app.route('/api/collections/finalize', methods=['POST'])
def finalize_collection():
    data = request.get_json()
    source_name = data.get('temp_collection_name')
    target_name = data.get('permanent_collection_name')
    provider_name = data.get('provider_name', 'google')
    api_key = data.get('api_key') or os.getenv("GOOGLE_API_KEY")

    if not source_name or not target_name:
        return jsonify({"error": "Missing source or target collection name"}), 400
    try:
        rag_system = Rag(collection_name=source_name, provider_name=provider_name, api_key=api_key)
        rag_system.rename_collection(new_name=target_name)
        return jsonify({"message": "Collection finalized", "new_collection_name": target_name})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/add-to-bot', methods=['POST'])
def add_to_bot():
    data = request.get_json()
    collection_name = data.get('collection_name')
    new_text = data.get('text')
    provider_name = data.get('provider_name', 'google')
    api_key = data.get('api_key') or os.getenv("GOOGLE_API_KEY")

    if not collection_name or not new_text:
        return jsonify({"error": "Missing collection_name or text"}), 400
    
    rag_system = Rag(collection_name=collection_name, provider_name=provider_name, api_key=api_key)
    num_added = rag_system.add_documents(chunks=chunkify_text(new_text))
    return jsonify({"message": f"Successfully added {num_added} new documents."})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    collection_name = data.get('collection_name')
    query = data.get('query')
    provider_name = data.get('provider_name', 'google')
    api_key = data.get('api_key') or os.getenv("GOOGLE_API_KEY")

    if not collection_name or not query:
        return jsonify({"error": "Missing collection_name or query"}), 400
    
    rag_system = Rag(collection_name=collection_name, provider_name=provider_name, api_key=api_key)
    answer = rag_system.answer_query(query)
    memory_info = rag_system.get_memory_summary()
    return jsonify({"answer": answer, "memory": memory_info})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)