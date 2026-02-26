import chromadb
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.Client()
collection = client.get_or_create_collection("rag_collection")

def store_chunks(chunks):
    embeddings = embedding_model.encode(chunks).tolist()
    
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"id_{i}" for i in range(len(chunks))]
    )

def retrieve(query, k=3):
    query_embedding = embedding_model.encode([query]).tolist()
    
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=k
    )
    
    return results["documents"][0]