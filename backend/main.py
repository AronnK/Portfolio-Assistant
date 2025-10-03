import os
from dotenv import load_dotenv
from preprocessor import load_parse_pdf, chunkify_text
from rag import Rag

def main():

    load_dotenv()
    
    PDF_FILE_PATH = "Arun Karthic - Resume updated.pdf"
    
    print("--- Welcome to your Personal AI Portfolio Assistant ---")
    
    if not os.path.exists(PDF_FILE_PATH):
        print(f"\nERROR: The file '{PDF_FILE_PATH}' was not found.")
        print("Please make sure your resume PDF is in the same folder as this script,")
        print("or update the PDF_FILE_PATH variable in app.py.")
        return

    raw_text = load_parse_pdf(PDF_FILE_PATH)
    text_chunks = chunkify_text(raw_text)
    
    rag_system = Rag()
    rag_system.set_doc_pipeline(chunks=text_chunks)
    
    print("\n--- Your Assistant is Ready! ---")
    print("Ask questions about your documents. Type 'exit' to quit.")
    
    while True:
        try:
            query = input("\nYour Question: ")
            if query.lower().strip() == 'exit':
                print("Goodbye!")
                break
            
            answer = rag_system.answer_query(query)
            print("\nAssistant's Answer:")
            print(answer)
            
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            print("Please try again.")

if __name__ == "__main__":
    main()
