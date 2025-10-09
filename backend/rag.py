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

        self.embedding_model = os.getenv("GOOGLE_EMBEDDING_MODEL", "models/embedding-001")
        self.llm_model = os.getenv("GOOGLE_LLM_MODEL", "gemini-1.5-flash-latest")
    
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
        You are a helpful AI assistant for a professional.
        Your task is to answer questions based *only* on the provided context from their resume and project documents.
        Do not make up information. If the answer is not found in the context, say 'I do not have enough information from the provided documents to answer that.'
        Be concise and professional in your response.
        """

        user_prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"

        model = genai.GenerativeModel(self.llm_model)
        full_prompt = system_prompt + "\n" + user_prompt
        
        response = model.generate_content(full_prompt)
        
        return response.text