from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import pdfplumber
import os

app = FastAPI()

# Load model ONCE
model = SentenceTransformer("all-MiniLM-L6-v2")


def chunk_text(text, chunk_size=400):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks


# ---------- PDF → chunks + embeddings ----------
@app.post("/embed")
async def embed(file: UploadFile = File(...)):
    # 1. Extract text from PDF
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    if not text.strip():
        return {"error": "No text extracted from PDF"}

    # 2. Chunk text
    chunks = chunk_text(text)

    # 3. Generate embeddings
    embeddings = model.encode(chunks)

    # 4. Prepare response
    response = []
    for i in range(len(chunks)):
        response.append({
            "text": chunks[i],
            "embedding": embeddings[i].tolist()
        })

    return {
        "chunkCount": len(response),
        "chunks": response
    }


# ---------- QUESTION → embedding ----------
class Query(BaseModel):
    text: str


@app.post("/embed-text")
async def embed_text(query: Query):
    embedding = model.encode([query.text])[0]
    return {
        "embedding": embedding.tolist()
    }


# ---------- REQUIRED FOR RENDER / PROD ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=False
    )
