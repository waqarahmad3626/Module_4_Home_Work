import os
import pickle
import PyPDF2
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from config import client, MODEL_NAME
from audio_transcriber import transcribe_audio

# Load embedding model once
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Global vectorstore
vectorstore = {
    "texts": [],
    "embeddings": []
}


# ===============================
# INGEST DOCUMENTS (PDF + MP3)
# ===============================
def ingest_all_documents():
    global vectorstore

    print("🔎 Scanning for documents...")

    folder_path = "documents"
    vectorstore = {"texts": [], "embeddings": []}

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        text = None

        # ===== Process MP3 =====
        if filename.lower().endswith(".mp3"):
            print(f"🎵 Processing audio: {filename}")
            text = transcribe_audio(file_path)

        # ===== Process PDF =====
        elif filename.lower().endswith(".pdf"):
            print(f"📄 Processing PDF: {filename}")
            text = ""
            try:
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted
            except Exception as e:
                print(f"❌ Error reading {filename}: {e}")
                continue

        else:
            continue

        # Skip empty text
        if not text or len(text.strip()) == 0:
            print(f"⚠ Skipping {filename} (no readable text)")
            continue

        # Generate embedding
        embedding = embedding_model.encode(text)

        vectorstore["texts"].append(text)
        vectorstore["embeddings"].append(embedding)

    print(f"✅ Total documents stored: {len(vectorstore['texts'])}")

    # Save vectorstore
    with open("vectorstore.pkl", "wb") as f:
        pickle.dump(vectorstore, f)

    print("💾 Vectorstore saved to disk.")


# ===============================
# LOAD VECTORSTORE
# ===============================
def load_vectorstore():
    global vectorstore

    if not os.path.exists("vectorstore.pkl"):
        print("⚠ No existing vectorstore found. Building new one...")
        ingest_all_documents()
        return

    with open("vectorstore.pkl", "rb") as f:
        vectorstore = pickle.load(f)

    print("✅ Vectorstore loaded from disk.")
    print(f"📚 Documents in memory: {len(vectorstore['texts'])}")


# ===============================
# ASK QUESTION
# ===============================
def ask_question(question):
    global vectorstore

    if len(vectorstore["embeddings"]) == 0:
        return "❌ No documents available. Please ingest documents first."

    # Encode question
    question_embedding = embedding_model.encode(question)

    # Compute similarity
    similarities = cosine_similarity(
        [question_embedding],
        vectorstore["embeddings"]
    )[0]

    # Get best match
    best_index = similarities.argmax()
    context = vectorstore["texts"][best_index]

    # Generate response using Gemini
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=f"""
Answer the question using ONLY the context below.

Context:
{context}

Question:
{question}
"""
    )

    return response.text