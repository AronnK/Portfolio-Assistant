import os
import openai
import chromadb
from tqdm import tqdm
from typing import List

class Rag:
    def __init__(self, collection_name: str = "portfolio_assistant"):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set!")
        self.openai_client = openai.OpenAI(api_key = api_key)

        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(name=collection_name)

        self.embedding_model = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
        self.llm_model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    def set_doc_pipeline(self, chunks: List[str]):

        print("Setting up document pipeline... this may take a moment.")

        if self.collection.count() > 0:
            print("Collection already contains documents. Skipping indexing.")
            return

        print(f"Embedding {len(chunks)} chunks using '{self.embedding_model}..'")

        batch_size = 100
        all_embs = []
        for i in tqdm(range(0, len(chunks), batch_size), desc = "Embedding Chunks"):
            batch = chunks[i:i+batch_size]
            response = self.openai_client.embeddings.create(
                input = batch,
                model = self.embedding_model
            )
            embs = [item.embedding for item in response.data]
            all_embs.extend(embs)
        
        print("Storing in db..")

        ids = [f"chunk_{i}" for i in range(len(chunks))]

        self.collection.add(
            embeddings = all_embs,
            documents = chunks,
            ids = ids
        )
    
    def answer_query(self, query: str, n_res: int = 3) -> str:

        print("Received query: ", query)

        query_emb = self.openai_client.embeddings.create(
            input = [query],
            model = self.embedding_model
        ).data[0].embedding

        res = self.collection.query(
            query_embeddings = [query_emb],
            n_results = n_res
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

        response = self.openai_client.chat.completions.create(
            model = self.llm_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature = 0.7,
        )
        return response.choices[0].message.content
