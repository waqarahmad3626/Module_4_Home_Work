import os
from rag_pipeline import ingest_all_documents, ask_question, load_vectorstore

if __name__ == "__main__":

    if not os.path.exists("vectorstore.pkl"):
        print("Building vector database...")
        ingest_all_documents()
    else:
        print("Loading existing vector database...")
        load_vectorstore()

    while True:
        question = input("\nAsk a question (or type exit): ")

        if question.lower() == "exit":
            break

        answer = ask_question(question)
        print("\nAnswer:\n", answer)