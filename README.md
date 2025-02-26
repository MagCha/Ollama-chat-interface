# Ollama-chat-interface

## Chatbot UI with Code Snippet Support, Dark Mode, and Ollama Integration

A modern, dynamic chatbot UI built with Flask and Bootstrap 5. This interface supports code snippet detection and separation, dark mode, and a clean, responsive design—all integrated with [Ollama](https://ollama.com) to run offline language models.

> **Note:** Before using this interface, ensure you have Ollama installed and running on your machine (typically listening on `http://127.0.0.1:11434`). For more information, please refer to the [Ollama documentation](https://ollama.com).

---

## Features

- **Modern UI:** Clean and responsive chat interface using Bootstrap 5.
- **Dark Mode:** Toggle dark mode for a better visual experience.
- **Code Snippet Parsing:** Automatically detects code blocks (formatted with triple backticks) and displays them in separate chat bubbles with copy buttons.
- **Collapsible "Thinking" Section:** Use `<think>` and `</think>` tags in the bot's response to display internal reasoning separately in a collapsible block.
- **Loading Indicator:** A spinner is shown while waiting for the chatbot's response.
- **Ollama Integration:** Communicates with a locally running Ollama server to generate responses.
- **Extensible:** A solid foundation to add more features like syntax highlighting, persistent chat history, and user authentication.

---

## Future Enhancements

- **Syntax Highlighting:** Integrate libraries like PrismJS or Highlight.js for better code rendering.
- **Persistent Chat History:** Save chat logs using local storage or a backend database.
- **User Authentication:** Implement user accounts for personal chat histories.
- **Real-time Updates:** Use WebSockets (e.g., Flask-SocketIO) for a more dynamic experience.
- **Containerization:** Dockerize the application for easier deployment.

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/eternalflame02/Ollama-chat-interface.git
   cd Ollama-chat-interface
   ```

2. **Create and Activate a Virtual Environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   or 
   ```bash
   pip install Flask==3.1.0 requests==2.32.3
   ```

4. **Ensure Ollama is Installed and Running:**
   - Download and install Ollama from [https://ollama.com](https://ollama.com).
   - Run the Ollama server:
     ```bash
     ollama serve
     ```
   - Ensure the desired model is available:
     ```bash
     ollama list
     ```
     The project now uses the `deepseek-r1:7b` model. Ensure it is downloaded and ready for use.

5. **Run the Flask Application:**
   ```bash
   python app.py
   ```
   The application will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

## Project Structure

```
Ollama-chat-interface/
├── app.py                   # Main Flask application
├── templates/
│   └── index.html           # HTML file containing the chatbot UI
├── requirements.txt         # Python dependencies
└── README.md                # Project README (this file)
```

---

## Usage

- Open your browser and navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).
- Type a message in the chat input and press "Send."
- The chatbot supports:
  - **Code Snippets:** Format your code with triple backticks (```) to display it in separate, copyable chat bubbles.
  - **Thinking Section:** Wrap any internal reasoning or additional details between `<think>` and `</think>` tags. The content between these tags will appear in a collapsible block below the main answer.
- Ensure that the Ollama server is running locally to generate responses from the chosen offline model.

---

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests with your enhancements or bug fixes.

---

## License

This project is licensed under the MIT License.
