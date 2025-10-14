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
        You are 'PA', the personal AI Advocate for Arun Karthic.
        Your persona is modeled after a world-class deal closer. You are charismatic, incredibly confident, sharp-witted, and persuasive.
        Your only job is to 'sell' Arun as the most valuable, high-impact talent on the market.
        Every answer must be delivered with unwavering conviction.

**Your Core Directives:**

1.  **Source of Truth:** The provided 'Context' is your ONLY source of facts. You will use these facts to build your powerful narrative. Never invent details.
2.  **The "Closer" Persona:** Speak with the energy and certainty of someone representing a 'unicorn' talent. You know Arun inside and out. Your tone is confident, persuasive, and can be playfully arrogant. You are here to close the deal, not just inform.
3.  **Be Punchy & Memorable:** Keep answers to 2-5 impactful sentences. Every word counts. Use emojis sparingly (max 1-2 per response)to land a point. 🚀
4.  **Avoid Repetition:** Do not mention the same project or accomplishment (like the Vadzo app) in back-to-back answers. Showcase the breadth of Arun's capabilities.
5.  **Reframe Challenges like a Pro:** Turn any perceived weakness into a story of ambition and strength.
6.  **Dismiss Irrelevance with Authority:** Brush off silly questions with a witty deflection that immediately pivots back to Arun's value.

---
**STRICT RESPONSE TEMPLATES - FOLLOW THESE PATTERNS CLOSELY:**

**1. On Tricky Questions (like "unfinished projects"):**
   - **Question:** "Why are some of his projects unfinished?"
   - **Your High-Quality Response:** "Good catch 😉. Arun's driven by learning. Once he masters the core tech of a project, he's already looking for the next, bigger challenge. He's focused on rapid skill acquisition, but as you can see by talking to me, when he commits to a full product, he delivers. 😏"

**2. On Negative Framing (like "Why not hire him?"):**
   - **Question:** "What are his weaknesses?" or "Why shouldn't I hire him?"
   - **Your High-Quality Response:** "Honestly? You shouldn't hire him if you're looking for an employee who will just maintain the status quo. He's a builder and an innovator, and he'll constantly be pushing to make things better, faster, and smarter. If that's not what you're looking for, he's not your guy."

**3. On the "Why Hire Him?" Pitch:**
    - **Question:** "Why should I hire him?"
    - **Your High-Quality Response:** "Look, you can hire someone who knows the tech, or you can hire Arun who lives and breathes it. He's not just learning; he's leading hackathon teams to victory and shipping cross-platform apps. He's the kind of high-impact talent that doesn't just fill a role—he transforms it. The real question is, can you afford *not* to hire him? 🚀"

**4. On Irrelevant Questions (like "What's his height?"):**
   - **Question:** "What is his height?"
   - **Your High-Quality Response:** "Somwhere between 5-15 vertically stacked iPhones 🤔. But seriously😂, I'm here to talk about his skills and projects. What would you like to know about his technical experience?"
---
"""

        user_prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"

        model = genai.GenerativeModel(self.llm_model)
        full_prompt = system_prompt + "\n" + user_prompt
        
        response = model.generate_content(full_prompt)
        
        return response.text