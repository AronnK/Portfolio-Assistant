from abc import ABC, abstractmethod
from typing import List
import os
from dotenv import load_dotenv

try:
    import google.generativeai as genai
except ImportError:
    genai = None

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    from groq import Groq
except ImportError:
    Groq = None

load_dotenv()

class LLMProvider(ABC):
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("API key is required for the LLM provider.")
        self.api_key = api_key

    @abstractmethod
    def generate_content(self, prompt: str) -> str:
        """Generates a text response from a given prompt."""
        pass

    @abstractmethod
    def embed_content(self, chunks: List[str], task_type: str) -> List[List[float]]:
        """Creates embeddings for a list of text chunks."""
        pass

class GoogleProvider(LLMProvider):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        if not genai:
            raise ImportError("google-generativeai is not installed. Please run 'pip install google-generativeai'")
        genai.configure(api_key=self.api_key)
        self.llm_model = genai.GenerativeModel("models/gemini-1.5-flash")
        self.embedding_model = "models/embedding-001"

    def generate_content(self, prompt: str) -> str:
        response = self.llm_model.generate_content(prompt)
        return response.text

    def embed_content(self, chunks: List[str], task_type: str) -> List[List[float]]:
        response = genai.embed_content(
            model=self.embedding_model,
            content=chunks,
            task_type=task_type
        )
        return response['embedding']

class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        if not OpenAI:
            raise ImportError("openai is not installed. Please run 'pip install openai'")
        self.client = OpenAI(api_key=self.api_key)
        self.llm_model = "gpt-4o"
        self.embedding_model = "text-embedding-3-small"

    def generate_content(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content or ""

    def embed_content(self, chunks: List[str], task_type: str) -> List[List[float]]:
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=chunks
        )
        return [embedding.embedding for embedding in response.data]

class GroqProvider(LLMProvider):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        if not Groq:
            raise ImportError("groq is not installed. Please run 'pip install groq'")
        self.client = Groq(api_key=self.api_key)
        self.llm_model = "llama3-8b-8192"
        # Groq doesn't have an embedding model. We fall back to OpenAI's.
        # This requires an OpenAI API key to be available in the environment.
        if not OpenAI:
            raise ImportError("openai is not installed (required for Groq embedding fallback). Please run 'pip install openai'")
        self.embedding_fallback = OpenAIProvider(api_key=os.getenv("OPENAI_API_KEY", ""))

    def generate_content(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content or ""

    def embed_content(self, chunks: List[str], task_type: str) -> List[List[float]]:
        print("Note: Groq does not have an embedding model. Using OpenAI's as a fallback.")
        return self.embedding_fallback.embed_content(chunks, task_type)

def get_provider(provider_name: str, api_key: str) -> LLMProvider:
    provider_name = provider_name.lower()
    if provider_name == "google":
        return GoogleProvider(api_key=api_key)
    elif provider_name == "openai":
        return OpenAIProvider(api_key=api_key)
    elif provider_name == "groq":
        return GroqProvider(api_key=api_key)
    else:
        raise ValueError(f"Unsupported LLM provider: {provider_name}")
