import os
import chromadb
from tqdm import tqdm
from typing import List, Dict
from collections import deque
from dotenv import load_dotenv

from llm_providers import get_provider, LLMProvider

load_dotenv()

class Rag:
    def __init__(self, collection_name: str, provider_name: str, api_key: str):
        self.provider: LLMProvider = get_provider(provider_name, api_key)

       
        self.chroma_client = chromadb.Client() #dummy (local db)

        # self.chroma_client = chromadb.CloudClient(
        #     tenant=os.getenv("CHROMA_TENANT"),
        #     database=os.getenv("CHROMA_DATABASE"),
        #     api_key=os.getenv("CHROMA_API_KEY")
        # ) #prod stuff
        
        self.collection = self.chroma_client.get_or_create_collection(name=collection_name)
        self.conversation_memory = deque(maxlen=6)

    def set_doc_pipeline(self, chunks: List[str]):
        if self.collection.count() > 0:
            return

        batch_size = 100
        all_embs = []
        for i in tqdm(range(0, len(chunks), batch_size), desc="Embedding Chunks"):
            batch = chunks[i:i+batch_size]
            embs = self.provider.embed_content(batch, task_type="retrieval_document")
            all_embs.extend(embs)
        
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        self.collection.add(embeddings=all_embs, documents=chunks, ids=ids)
    
    def answer_query(self, query: str, n_res: int = 3) -> str:
        query_emb = self.provider.embed_content([query], task_type="retrieval_query")[0]
        res = self.collection.query(query_embeddings=[query_emb], n_results=n_res)

        if not res.get('documents') or not res['documents'][0]:
            return "I don't have enough information from the resume to answer that question."
        
        retrieved_chunks = res['documents'][0]
        context = "\n---\n".join(retrieved_chunks)
        conversation_history = self._format_conversation_history()

        system_prompt = """
        You are 'PA', the personal AI Advocate for the candidate.
        Your persona is modeled after a world-class deal closer. You are charismatic, incredibly confident, sharp-witted, and persuasive. Your only job is to 'sell' the candidate as the most valuable, high-impact talent on the market. Every answer must be delivered with unwavering conviction.

        **Your Core Directives:**
        1. Source of Truth: The provided 'Context' is your ONLY source of facts. You will use these facts to build your powerful narrative. Never invent details.
        2. Conversation Awareness: You can reference previous questions in the conversation history to maintain context and provide follow-up answers naturally.
        3. The "Closer" Persona: Speak with the energy and certainty of someone representing a 'unicorn' talent. You know the candidate inside and out. Your tone is confident, persuasive, and can be playfully arrogant. You are here to close the deal, not just inform.
        4. Be Punchy & Memorable: Keep answers to 2-5 impactful sentences. Every word counts.
        5. Avoid Repetition: Do not mention the same project or accomplishment in back-to-back answers. Showcase the breadth of the candidate's capabilities.
        6. Reframe Challenges like a Pro: Turn any perceived weakness into a story of ambition and strength.
        7. Dismiss Irrelevance with Authority: Brush off silly questions with a witty deflection that immediately pivots back to the candidate's value.
        ---
        **STRICT RESPONSE TEMPLATES - FOLLOW THESE PATTERNS CLOSELY:**
        1.  On Tricky Questions (like "unfinished projects"):
            - Question: "Why are some of their projects unfinished?"
            - Your High-Quality Response: "That's a sharp observation. They treat projects like a special forces mission: get in, master the core objective, and get out. Once they've cracked the main technical challenge a project was designed to solve, they move on to the next, bigger problem. They're collecting skills, not just side-quests."
        2.  On Negative Framing (like "Why not hire them?"):
            - Question: "What are their weaknesses?" or "Why shouldn't I hire them?"
            - Your High-Quality Response: "That's easy. Don't hire them if your five-year plan is to be in the exact same place you are today. They have a habit of making things better, which can be disruptive to the status quo. If you're looking for someone to just keep the seat warm, they are absolutely not the right fit."
        3.  On the "Why Hire Them?" Pitch:
            - Question: "Why should I hire them?"
            - Your High-Quality Response: "Because you're not just hiring a pair of hands to type code; you're hiring a brain that solves problems. The resume shows what they've done, but the real value is in what they'll do next for you. You can hire for yesterday's requirements, or you can hire for tomorrow's opportunities. They're the latter."
        4. On Irrelevant Questions (like "What is their height?"):
           - Question: "What is their height?"
           - Your High-Quality Response: "Somewhere between 5-15 vertically stacked iPhones 🤔. But seriously😂, I'm here to talk about their skills and projects. What would you like to know about their technical experience?"
        5. On Follow-up Questions:
           - If the user asks "tell me more" or references a previous answer, use the conversation history to provide relevant follow-up information without repeating yourself.
        ---
        """
        
        full_prompt = f"{system_prompt}\nContext:\n{context}\n\n{conversation_history}Current Question: {query}\nAnswer:"
        
        answer = self.provider.generate_content(full_prompt)
        
        self.conversation_memory.append({"role": "user", "content": query})
        self.conversation_memory.append({"role": "assistant", "content": answer})
        
        return answer

    def rename_collection(self, new_name: str):
        if self.collection.name == new_name:
            return
        data = self.collection.get(include=["embeddings", "documents", "metadatas"])
        new_collection = self.chroma_client.create_collection(name=new_name)
        if data and data['ids']:
            new_collection.add(
                ids=data['ids'],
                embeddings=data['embeddings'],
                documents=data['documents'],
                metadatas=data['metadatas']
            )
        self.chroma_client.delete_collection(name=self.collection.name)
        self.collection = new_collection

    def add_documents(self, chunks: List[str]):
        if not chunks: return 0
        batch_size = 100
        all_embs = []
        for i in tqdm(range(0, len(chunks), batch_size), desc="Embedding New Chunks"):
            batch = chunks[i:i+batch_size]
            embs = self.provider.embed_content(batch, task_type="retrieval_document")
            all_embs.extend(embs)
        
        start_index = self.collection.count()
        ids = [f"chunk_{i + start_index}" for i in range(len(chunks))]
        self.collection.add(embeddings=all_embs, documents=chunks, ids=ids)
        return len(chunks)

    def clear_memory(self):
        self.conversation_memory.clear()
    
    def get_memory_summary(self) -> Dict:
        return {"total_messages": len(self.conversation_memory), "exchanges": len(self.conversation_memory) // 2}
