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
```

## 🐍 Step 2: Create Virtual Environment
```bash
python -m venv venv
```
## Activate Environment
### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux
```bash
source venv/bin/activate
```
## 📦 Step 3: Install Required Libraries
```bash
pip install fastapi uvicorn python-dotenv
pip install chromadb
pip install sentence-transformers
pip install scikit-learn
pip install PyPDF2
pip install openai-whisper
pip install google-generativeai
pip install python-multipart
```
 requirements.txt has been created just execute it
fastapi
uvicorn
chromadb
python-dotenv
sentence-transformers
scikit-learn
PyPDF2
openai-whisper
google-generativeai
python-multipart
Then run:

```bash
pip install -r requirements.txt
```

## 🔐 Step 4: Create .env File
Create a file named:

.env

Add your Gemini API key:

GEMINI_API_KEY=your_actual_api_key_here

MODEL_NAME=gemini-1.5-flash

## 🧩 Step 5: Load Environment Variables (config.py)

```python
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

genai.configure(api_key=API_KEY)
client = genai.GenerativeModel(MODEL_NAME)
```

## 📂 Step 6: Add Documents

Create a folder:

documents/

Add your all files:

PDF files

MP3 files

## ▶️ Step 7: Run Backend to generate Model data

Open VS Code editor
move to the folder gemini-chat-backend 

```bash
python main.py
```
once Model generated then run this command in terminal in order to run API server
```bash
uvicorn main:app --reload
```
Backend runs at:

### -> http://127.0.0.1:8000

## 🔁 How Backend Works
1) Reads documents

2) Extracts text

3) Converts text → embeddings

4) Stores embeddings in vectorstore.pkl

5) When a question is asked:

6) Convert question → embedding

7) Perform cosine similarity

8) Retrieve best matching chunk

9) Send context + question to Gemini

10) Return generated answer

# 💻 Frontend Setup (React + Bootstrap)

## 📁 Step 1: Create React App

```bash
cd gemini-chat-frontend
```

## 📦 Step 2: Install Required Libraries
```bash
npm install
npm install bootstrap
npm install bootstrap-icons
npm install react-markdown
npm install uuid
```

▶️ Step 5: Run Frontend
npm start
App runs at:

### -> http://localhost:3000

## 🧠 How Model “Training” Works
1) This project does NOT fine-tune the LLM.

2) Instead, it uses Retrieval Augmented Generation (RAG):

3) Documents are embedded

4) Embeddings are stored

5) User question is embedded

6) Most similar chunk is retrieved

7) Retrieved chunk is sent to Gemini

8) Gemini generates contextual answer

9) No retraining required.

## 📊 Why RAG Instead of Fine-Tuning?
Fine-Tuning	RAG
Expensive	Cost-effective
Static knowledge	Uses fresh documents
Needs retraining	Just re-index documents
Hard to update	Easy to update

## 🛠 Commands Summary
### Backend
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
## Frontend
```bashpx create-react-app waqar-chat-frontend
npm install npm install bootstrap bootstrap-icons react-markdown uuid
npm start
```
## 🔮 Future Improvements

User authentication

Cloud deployment

Streaming responses

Hybrid search (Vector + BM25)

## 💾 Chat Persistence (History Storage)
This project includes chat history persistence for 30 days.

## 🧠 How Chat History Works
The application does not use a database like MongoDB yet.

## Instead, it uses:

✅ Local file-based storage

✅ JSON / Pickle files

✅ Browser localStorage (Frontend)

✅ In-memory caching (FastAPI session)


👨‍💻 Author
Waqar Ahmad
Full Stack Developer

⭐ If You Like This Project
Give it a ⭐ on GitHub!
