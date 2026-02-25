# 🚀 Waqar Chat AI – RAG-Based Full Stack AI Application
A full-stack AI application built using Retrieval Augmented Generation (RAG).

This project allows users to upload documents (PDF / MP3), index them using embeddings, and interact with them through a modern ChatGPT-style interface.

## 📌 Features
📄 PDF document ingestion

🎧 Audio (MP3) transcription

🧠 Embedding-based similarity search

🤖 Gemini-powered response generation

💬 Multi-chat system

🗂 Rename & delete chats

🌙 Dark mode toggle

💾 Chat persistence (30 days)

🎨 Modern ChatGPT-style UI (React + Bootstrap)

## 🏗 Project Architecture
Frontend (React)
        ⬇
FastAPI Backend
        ⬇
Embedding Model (Sentence Transformers)
        ⬇
Vector Store (pickle)
        ⬇
Similarity Search (Cosine Similarity)
        ⬇
Gemini LLM API
        ⬇
## Response Returned to Frontend
🧠 Backend Setup (FastAPI + RAG)
📁 Step 1: Create Backend Folder

## cmd Command
```bash
mkdir gemini-chat-backend
cd gemini-chat-backend

## 🐍 Step 2: Create Virtual Environment
`python -m venv venv`
## Activate Environment
### Windows
(venv\Scripts\activate)

### Mac/Linux
(source venv/bin/activate)
📦 Step 3: Install Required Libraries
pip install fastapi uvicorn python-dotenv
pip install sentence-transformers
pip install scikit-learn
pip install PyPDF2
pip install openai-whisper
pip install google-generativeai
pip install python-multipart
Or Create requirements.txt
fastapi
uvicorn
python-dotenv
sentence-transformers
scikit-learn
PyPDF2
openai-whisper
google-generativeai
python-multipart
Then run:

pip install -r requirements.txt
🔐 Step 4: Create .env File
Create a file named:

.env
Add your Gemini API key:

GEMINI_API_KEY=your_actual_api_key_here
MODEL_NAME=gemini-1.5-flash
🧩 Step 5: Load Environment Variables (config.py)
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

genai.configure(api_key=API_KEY)
client = genai.GenerativeModel(MODEL_NAME)
📂 Step 6: Add Documents
Create a folder:

documents/
Add your:

PDF files

MP3 files

▶️ Step 7: Run Backend
uvicorn main:app --reload
Backend runs at:

http://127.0.0.1:8000
🔁 How Backend Works
Reads documents

Extracts text

Converts text → embeddings

Stores embeddings in vectorstore.pkl

When a question is asked:

Convert question → embedding

Perform cosine similarity

Retrieve best matching chunk

Send context + question to Gemini

Return generated answer

💻 Frontend Setup (React + Bootstrap)
📁 Step 1: Create React App
npx create-react-app waqar-chat-frontend
cd waqar-chat-frontend
📦 Step 2: Install Required Libraries
npm install bootstrap
npm install bootstrap-icons
npm install react-markdown
npm install uuid
🧩 Step 3: Import Bootstrap
In src/index.js:

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
🔗 Step 4: Connect to Backend
In App.js:

fetch("http://127.0.0.1:8000/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: input }),
});
▶️ Step 5: Run Frontend
npm start
App runs at:

http://localhost:3000
🧠 How Model “Training” Works
This project does NOT fine-tune the LLM.

Instead, it uses Retrieval Augmented Generation (RAG):

Documents are embedded

Embeddings are stored

User question is embedded

Most similar chunk is retrieved

Retrieved chunk is sent to Gemini

Gemini generates contextual answer

No retraining required.

📊 Why RAG Instead of Fine-Tuning?
Fine-Tuning	RAG
Expensive	Cost-effective
Static knowledge	Uses fresh documents
Needs retraining	Just re-index documents
Hard to update	Easy to update
🛠 Commands Summary
Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
npx create-react-app waqar-chat-frontend
npm install bootstrap bootstrap-icons react-markdown uuid
npm start
🔮 Future Improvements
MongoDB persistent storage

User authentication

Cloud deployment

Streaming responses

Hybrid search (Vector + BM25)

👨‍💻 Author
Waqar Ahmad
AI Full Stack Developer

⭐ If You Like This Project
Give it a ⭐ on GitHub!
