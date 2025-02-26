# Ollama-chat-interface

## Chatbot UI with Code Snippet Support and Dark Mode

A modern, dynamic chatbot UI built with Flask and Bootstrap 5 that supports code snippet detection and separation, dark mode, and a clean, responsive design.

### Features

- **Modern UI:** Clean and responsive chat interface using Bootstrap 5.
- **Dark Mode:** Toggle dark mode for a better visual experience.
- **Code Snippet Parsing:** Automatically detects code blocks (formatted with triple backticks) and displays them in separate chat bubbles with copy buttons.
- **Loading Indicator:** A spinner is shown while waiting for the chatbot's response.
- **Extensible:** A solid foundation to add more features like syntax highlighting, persistent chat history, and user authentication.

## Future Enhancements

- **Syntax Highlighting:** Integrate libraries like PrismJS or Highlight.js.
- **Persistent Chat History:** Save chat logs using local storage or a backend database.
- **User Authentication:** Implement user accounts for personal chat histories.
- **Real-time Updates:** Use WebSockets for real-time communication.
- **Containerization:** Dockerize the application for easier deployment.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/chatbot-ui.git
   cd chatbot-ui
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

4. **Run the Flask Application:**
   ```bash
   python app.py
   ```
   The application will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Project Structure

```
chatbot-ui/
├── app.py                   # Main Flask application
├── templates/
│   └── index.html           # HTML file containing the 
├── requirements.txt         # Python dependencies
└── README.md                # Project README (this file)
```

## Usage

- Open your browser and navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).
- Type a message in the chat input and press "Send".
- If the bot's response includes code blocks (using triple-backticks), they will be automatically formatted in separate chat bubbles with a copy button.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests with your enhancements or bug fixes.

## License

This project is licensed under the MIT License.
