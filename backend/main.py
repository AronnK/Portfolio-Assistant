import os
import uuid
import json
import hashlib
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

from preprocessor import load_parse_pdf, chunkify_text
from rag import Rag

load_dotenv()
app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://portfolio-assistant-one.vercel.app",
            "https://*.vercel.app"
        ]
    }
})

try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"CRITICAL: Failed to configure Google AI. Error: {e}")

parse_cache = {}

@app.route('/')
def home():
    return jsonify({
        "status": "Portfolio AI Assistant API",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/api/parse-resume",
            "/api/build-bot",
            "/api/chat",
            "/api/collections/finalize",
            "/api/add-to-bot"
        ]
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "timestamp": str(uuid.uuid4())})

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    temp_path = None
    try:
        if 'resume' not in request.files:
            print("No resume file in request")
            return jsonify({"error": "No resume file provided"}), 400
        
        file = request.files['resume']
        if not file or file.filename == '':
            print("Empty file or no filename")
            return jsonify({"error": "Invalid file"}), 400
        
        file_content = file.read()
        file_size = len(file_content)
        file_hash = hashlib.md5(file_content).hexdigest()
        
        if file_hash in parse_cache:
            return jsonify(parse_cache[file_hash])
        
        temp_path = f"/tmp/temp_{uuid.uuid4()}.pdf"
        
        with open(temp_path, 'wb') as f:
            f.write(file_content)
        
        if not os.path.exists(temp_path):
            raise FileNotFoundError(f"Failed to create temp file at {temp_path}")
        
        raw_text = load_parse_pdf(temp_path)
        
        if not raw_text or len(raw_text.strip()) == 0:
            raise ValueError("No text could be extracted from the PDF")
        
        os.remove(temp_path)
        temp_path = None
        model = genai.GenerativeModel("models/gemini-2.0-flash-exp")
        
        prompt = f"""You are a highly sophisticated AI resume parser. Extract key information and return ONLY a valid JSON object.

        **JSON Output Schema:**
        {{
        "personal_details": {{
            "name": "string | null",
            "email": "string | null",
            "phone": "string | null",
            "links": [{{"type": "linkedin | github | portfolio | other", "url": "string"}}]
        }},
        "summary": "string | null",
        "EDUCATION": [{{"title": "string", "subtitle": "string | null", "date": "string | null", "description": "string | null"}}],
        "EXPERIENCE": [{{"title": "string", "subtitle": "string | null", "date": "string | null", "description": "string"}}],
        "PROJECTS": [{{"title": "string", "subtitle": "string | null", "date": "string | null", "description": "string"}}],
        "SKILLS": [{{"title": "string", "description": "string | null"}}],
        "CERTIFICATIONS": [{{"title": "string", "subtitle": "string | null", "date": "string | null"}}]
        }}

        **CRITICAL RULES:**
        1. Output ONLY valid JSON, no markdown, no backticks, no explanations
        2. Extract personal details from the top of the resume
        3. Map sections intelligently (Work History → EXPERIENCE, Technical Skills → SKILLS)
        4. Merge bullet points into description fields with \\n separator
        5. Omit missing sections entirely

        --- RESUME TEXT START ---
        {raw_text}
        --- RESUME TEXT END ---"""
        
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            raise ValueError("Gemini returned empty response")
        
        json_response_string = response.text.strip()
        
        if json_response_string.startswith("```json"):
            json_response_string = json_response_string[7:]
        elif json_response_string.startswith("```"):
            json_response_string = json_response_string[3:]
        if json_response_string.endswith("```"):
            json_response_string = json_response_string[:-3]

        
        json_response_string = json_response_string.strip()
        
        if not json_response_string:
            raise ValueError("JSON string empty after cleaning")
        
        parsed_json = json.loads(json_response_string)
        
        if not isinstance(parsed_json, dict):
            raise ValueError(f"Expected dict, got {type(parsed_json)}")
        
        print(f"Parsed JSON successfully. Keys: {list(parsed_json.keys())}")
        
        parse_cache[file_hash] = parsed_json
        
        return jsonify(parsed_json)
        
    except json.JSONDecodeError as e:
        print(f"JSON DECODE ERROR: {e}")
        print(f"Error position: line {e.lineno}, column {e.colno}")
        print(f"Problematic string: {e.doc[:500] if hasattr(e, 'doc') else 'N/A'}")
        traceback.print_exc()
        
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            "error": f"Failed to parse AI response as JSON: {str(e)}",
            "details": {
                "line": e.lineno,
                "column": e.colno,
                "message": e.msg
            }
        }), 500
        
    except FileNotFoundError as e:
        print(f"FILE ERROR: {e}")
        traceback.print_exc()
        return jsonify({"error": f"File handling error: {str(e)}"}), 500
        
    except ValueError as e:
        print(f"VALUE ERROR: {e}")
        traceback.print_exc()
        
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({"error": str(e)}), 500
        
    except Exception as e:
        print(f"UNEXPECTED ERROR: {type(e).__name__}: {e}")
        traceback.print_exc()
        
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            "error": f"Failed to parse resume: {str(e)}",
            "error_type": type(e).__name__
        }), 500

@app.route('/api/build-bot', methods=['POST'])
def build_bot():
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
            full_text_content += f"\n\n=== PROFESSIONAL SUMMARY ===\n{parsed_data['summary']}\n"

        for section, items in parsed_data.items():
            if section.lower() in ['personal_details', 'summary'] or not isinstance(items, list) or not items:
                continue
                
            full_text_content += f"\n\n=== {section.upper()} ===\n"
            
            for i, item in enumerate(items):
                item_key = f"{section}-{i}"
                full_text_content += f"\n--- Entry {i+1} ---\n"

                if isinstance(item, dict):
                    full_text_content += f"Title: {item.get('title', 'N/A')}\n"
                    if item.get('subtitle'):
                        full_text_content += f"Organization/Institution: {item.get('subtitle')}\n"
                    if item.get('date'):
                        full_text_content += f"Duration: {item.get('date')}\n"
                    if item.get('description'):
                        full_text_content += f"Description: {item.get('description')}\n"
                elif isinstance(item, str):
                    full_text_content += f"Skill/Item: {item}\n"
                
                if enrichments.get(item_key):
                    full_text_content += f"Additional Context: {enrichments[item_key]}\n"
        
        print(f"Generated {len(full_text_content)} chars of content")
        
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
        print(f"Error building bot: {type(e).__name__}: {e}")
        traceback.print_exc()
        return jsonify({
            "error": f"Failed to build bot: {str(e)}",
            "error_type": type(e).__name__
        }), 500

@app.route('/api/collections/finalize', methods=['POST'])
def finalize_collection():
    try:
        data = request.get_json()
        source_name = data.get('temp_collection_name')
        target_name = data.get('permanent_collection_name')
        provider_name = data.get('provider_name', 'google')
        api_key = data.get('api_key') or os.getenv("GOOGLE_API_KEY")

        if not source_name or not target_name:
            return jsonify({"error": "Missing source or target collection name"}), 400
        
        
        rag_system = Rag(collection_name=source_name, provider_name=provider_name, api_key=api_key)
        rag_system.rename_collection(new_name=target_name)
        
        print(f"Collection finalized successfully")
        return jsonify({"message": "Collection finalized", "new_collection_name": target_name})
        
    except Exception as e:
        print(f"Error finalizing collection: {type(e).__name__}: {e}")
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

@app.route('/api/add-to-bot', methods=['POST'])
def add_to_bot():
    try:
        data = request.get_json()
        collection_name = data.get('collection_name')
        new_text = data.get('text')
        provider_name = data.get('provider_name', 'google')
        api_key = data.get('api_key') or os.getenv("GOOGLE_API_KEY")

        if not collection_name or not new_text:
            return jsonify({"error": "Missing collection_name or text"}), 400
        
        
        rag_system = Rag(collection_name=collection_name, provider_name=provider_name, api_key=api_key)
        num_added = rag_system.add_documents(chunks=chunkify_text(new_text))
        
        print(f"Added {num_added} documents")
        return jsonify({"message": f"Successfully added {num_added} new documents."})
        
    except Exception as e:
        print(f"Error adding to bot: {type(e).__name__}: {e}")
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        collection_name = data.get('collection_name')
        query = data.get('query')
        provider_name = data.get('provider_name', 'google')
        api_key = data.get('api_key') or os.getenv("GOOGLE_API_KEY")

        if not collection_name or not query:
            return jsonify({"error": "Missing collection_name or query"}), 400
        
        print(f"Chat query for: {collection_name}")
        
        rag_system = Rag(collection_name=collection_name, provider_name=provider_name, api_key=api_key)
        answer = rag_system.answer_query(query)
        memory_info = rag_system.get_memory_summary()
        
        print(f"Query answered")
        return jsonify({"answer": answer, "memory": memory_info})
        
    except Exception as e:
        print(f"Chat error: {type(e).__name__}: {e}")
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    print(f"🚀 Starting Flask app on port {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
