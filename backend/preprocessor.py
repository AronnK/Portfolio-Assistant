import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter as rcts
from typing import List

def load_parse_pdf(file_path: str) -> str: 

    doc = fitz.open(file_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text() 
    doc.close()

    return full_text

def chunkify_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:

    splitter = rcts(
        chunk_size = chunk_size,
        chunk_overlap = chunk_overlap,
        length_function = len,
        add_start_index = True,
    )

    chunks = splitter.split_text(text)
    return chunks

