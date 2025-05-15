# 🚀 Ollama Chatbot Interface (Fullstack)

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-Frontend-61dafb?logo=react)
![Flask](https://img.shields.io/badge/Flask-Backend-000?logo=flask)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

> **A personal-use chatbot interface with a Python (Flask) backend and a React frontend.**
> 
> **No registration, no cloud, just you and your local AI!**

---

## ✨ Features
- 🧑‍💻 **Single-user chat**: No registration or multi-user logic.
- 💎 **Modern UI**: React-based, clean, and responsive.
- ↔️ **Message alignment**: User messages right, bot messages left.
- ⚡ **Streaming backend**: Real-time responses from the Flask API.
- 🛠️ **Easy setup**: Simple install and run instructions for both backend and frontend.

---

## 📁 Project Structure
```
Ollama-chat-interface/      # Flask backend
  app.py                   # Main backend API
  requirements.txt         # Python dependencies
ollama-react-frontend/     # React frontend
  package.json             # Frontend dependencies
  src/                     # React source code
```

---

## 🏁 Quick Start

### 1️⃣ Backend (Flask)
1. **Install Python 3.8+ and pip.**
2. **Create a virtual environment (optional but recommended):**
   ```pwsh
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. **Install dependencies:**
   ```pwsh
   pip install -r requirements.txt
   ```
4. **Start the backend:**
   ```pwsh
   python app.py
   ```
   The backend will run at [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 2️⃣ Frontend (React)
1. **Open a new terminal and navigate to `ollama-react-frontend`:**
   ```pwsh
   cd ollama-react-frontend
   ```
2. **Install dependencies:**
   ```pwsh
   npm install
   ```
3. **Start the frontend:**
   ```pwsh
   npm start
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## ⚙️ Requirements
- Python 3.8+
- Node.js 16+
- Ollama running locally ([Get Ollama](https://ollama.com))

---

## 💡 Tips
- Make sure the backend is running before starting the frontend.
- Ollama must be running locally for the chatbot to generate responses.
- You can change the model in `app.py` by editing the `MODEL_NAME` variable.

---

## 📜 License
MIT

---

> Made with ❤️ for personal productivity and fun!
