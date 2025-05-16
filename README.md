# Personal Chatbot

A modern, personal-use chatbot interface with a React frontend and Flask backend. Features include custom themes, background image support, persistent chat history, a sidebar for saved chats, and a polished, user-friendly UI.

## Features
- **Modern UI**: Clean, responsive design inspired by top chat apps.
- **Theme System**: Choose between dark, light, and solarized themes.
- **Custom Background**: Upload and blur your own background image (persists across sessions).
- **Persistent Chat History**: Chat history is saved in your browser (localStorage).
- **Sidebar for Saved Chats**: Save, load, and delete chat sessions. Sidebar is toggled by a hamburger icon.
- **Message Alignment**: User messages right, bot messages left, all text left-aligned in bubbles.
- **Polished Controls**: Sidebar, clear button, and theme/background controls are always visible and reposition dynamically.
- **Accessible Trash Icon**: Delete icon for saved chats is always accessible and only appears on hover.
- **Descriptive Tab Title**: Browser tab title is set to "Personal Chatbot".

## Project Structure

```
ollamaboi/
├── ollama-react-frontend/   # React frontend
│   ├── public/
│   └── src/
├── Ollama-chat-interface/   # Flask backend
│   ├── app.py
│   ├── requirements.txt
│   └── templates/
├── LICENSE                  # Project license (see below)
├── README.md                # This file
└── .gitignore
```

## Setup & Usage

### Frontend (React)
1. `cd ollama-react-frontend`
2. `npm install`
3. `npm start`

### Backend (Flask)
1. `cd Ollama-chat-interface`
2. (Optional) Create a virtual environment: `python -m venv venv && source venv/bin/activate` (Linux/macOS) or `venv\Scripts\activate` (Windows)
3. `pip install -r requirements.txt`
4. `python app.py`

The React app runs on [http://localhost:3000](http://localhost:3000) and the Flask backend on [http://localhost:5000](http://localhost:5000).

## License
This project is licensed under the MIT License. See the `LICENSE` file at the project root for details.

## Notes
- All chat and theme data is stored in the browser (no server-side persistence).
- For development, ensure both frontend and backend are running.
- You can further customize the UI via `src/App.css` and `src/App.js`.

---

For any issues or suggestions, please open an issue or PR!
