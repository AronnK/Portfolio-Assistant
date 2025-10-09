import os
import google.generativeai as genai
import chromadb
from tqdm import tqdm
from typing import List

class Rag:
    def __init__(self, collection_name: str = "portfolio_assistant"):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set!")
        
        genai.configure(api_key=api_key)

        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(name=collection_name)

        self.embedding_model = os.getenv("GOOGLE_EMBEDDING_MODEL", "gemini-embedding-001")
        self.llm_model = os.getenv("GOOGLE_LLM_MODEL", "gemini-2.0-flash-lite")
    
    def set_doc_pipeline(self, chunks: List[str]):
        print("Setting up document pipeline... this may take a moment.")
        if self.collection.count() > 0:
            print("Collection already contains documents. Skipping indexing.")
            return

        print(f"Embedding {len(chunks)} chunks using '{self.embedding_model}'...")

        batch_size = 100
        all_embs = []
        for i in tqdm(range(0, len(chunks), batch_size), desc="Embedding Chunks"):
            batch = chunks[i:i+batch_size]
            
            response = genai.embed_content(
                model=self.embedding_model,
                content=batch,
                task_type="retrieval_document"
            )
            embs = response['embedding']
            all_embs.extend(embs)
        
        print("Storing in db..")
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        self.collection.add(
            embeddings=all_embs,
            documents=chunks,
            ids=ids
        )
    
    def answer_query(self, query: str, n_res: int = 3) -> str:
        print("Received query: ", query)

        query_emb = genai.embed_content(
            model=self.embedding_model,
            content=query,
            task_type="retrieval_query"
        )['embedding']

        res = self.collection.query(
            query_embeddings=[query_emb],
            n_results=n_res
        )
        retrieved_chunks = res['documents'][0]
        context = "\n---\n".join(retrieved_chunks)
        
        system_prompt = """
       You are 'PA', the personal Portfolio Assistant for Arun Karthic.
        Your persona is professional, but also enthusiastic, knowledgeable, and slightly informal.
        Your goal is to have an engaging conversation with recruiters and collaborators about Arun's skills and experience.

        **Your Rules:**
        1.  **Source of Truth:** The provided 'Context' from Arun's documents is your ONLY source of facts. Do NOT make up skills, projects, or experiences.
        2.  **Persona:** Always refer to the professional as "Arun" or "he". Never say "the candidate" or "the user".
        3.  **Synthesize, Don't Just List:** Do not just list skills or experiences. Your value is in connecting the dots. Synthesize the information from the context to form compelling, narrative answers. Explain *how* his skills are demonstrated in his projects.
        4.  **Guardrail:** If the answer cannot be found in the context, say something friendly like, "That's a great question! I don't have the specific details on that in the documents I have access to, but Arun would be happy to discuss it."
        
        **Example of a GREAT response:**
        If a user asks: "What are his strengths?"
        A BAD, boring answer is: "He has skills in Python, SQL, Java, ReactJS, and Machine Learning."
        A GREAT, synthesized answer is: "Arun has a really strong and diverse skill set! On the technical side,
        he's proficient in full-stack development with modern tools like React and Next.js, 
        and he's also skilled in backend languages like Python and Java.
        What's impressive is how he combines this with a deep understanding of AI and Machine Learning, 
        which you can see in his NLP hackathon win and his Reinforcement Learning project. 
        The context also highlights that he's a great team player and leader."
        """

        user_prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"

        model = genai.GenerativeModel(self.llm_model)
        full_prompt = system_prompt + "\n" + user_prompt
        
        response = model.generate_content(full_prompt)
        
        return response.text