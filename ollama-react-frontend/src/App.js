import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

function preprocessMarkdown(text) {
  if (Array.isArray(text)) text = text.join('\n');
  // Only fix bold/italic with spaces and normalize line endings
  let fixed = text
    .replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**')
    .replace(/\*\s+([^*]+?)\s+\*/g, '*$1*')
    .replace(/__\s+([^_]+?)\s+__/g, '__$1__')
    .replace(/_\s+([^_]+?)\s+_/g, '_$1_');
  fixed = fixed.replace(/\r\n?/g, '\n');
  return fixed;
}

const components = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = Array.isArray(children) ? children.join('') : String(children);
    return !inline ? (
      <pre style={{background: '#222', color: '#eee', padding: 8, borderRadius: 4, overflowX: 'auto', margin: '12px 0', maxWidth: '100%'}}>
        <code
          className={className}
          dangerouslySetInnerHTML={{
            __html: match ? hljs.highlight(codeString, { language: match[1] }).value : hljs.highlightAuto(codeString).value
          }}
          style={{fontFamily: 'monospace', fontSize: 14, wordBreak: 'break-word', display: 'block'}}
          {...props}
        />
      </pre>
    ) : (
      <code className={className} style={{background: '#222', color: '#eee', borderRadius: 3, padding: '2px 4px'}} {...props}>{codeString}</code>
    );
  }
};

function parseBotResponse(text) {
  text = preprocessMarkdown(text);
  if (text.includes('<think>') && text.includes('</think>')) {
    const mainAnswer = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const thinkingMatch = text.match(/<think>([\s\S]*?)<\/think>/);
    const thinkingPart = thinkingMatch ? thinkingMatch[1].trim() : '';
    return [
      mainAnswer && <ReactMarkdown key="main" components={components}>{mainAnswer}</ReactMarkdown>,
      thinkingPart && (
        <details key="think" style={{marginTop: 8}}>
          <summary style={{cursor: 'pointer', color: '#007bff'}}>Show Thinking</summary>
          <pre style={{background: '#222', color: '#eee', padding: 8, borderRadius: 4, overflowX: 'auto', maxWidth: '100%'}}>{thinkingPart}</pre>
        </details>
      )
    ];
  }
  return <ReactMarkdown components={components}>{text}</ReactMarkdown>;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function App() {
  const [messages, setMessages] = useState([]); // {sender, text, time, error}
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [loading]);

  // Optionally, for highlight.js:
  // useEffect(() => { hljs.highlightAll(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const now = new Date();
    setMessages(msgs => [...msgs, { sender: 'user', text: input, time: now }]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      const data = await response.json();
      setMessages(msgs => [...msgs, { sender: 'bot', text: data.response, time: new Date() }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error: ' + e.message, time: new Date(), error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = e => {
    if (e.key === 'Enter' && (e.ctrlKey || !e.shiftKey)) {
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="App" style={{minHeight: '100vh', minWidth: '100vw', background: darkMode ? '#121212' : '#f7f7f7', display: 'flex', flexDirection: 'column'}}>
      <div className="chat-container" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        background: darkMode ? '#1e1e1e' : '#fff',
        borderRadius: 0,
        boxShadow: 'none',
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}>
        <div className="chat-header" style={{background: darkMode ? '#333' : '#007bff', color: '#fff', padding: 15, textAlign: 'center', position: 'relative'}}>
          <h4 style={{margin: 0}}>Chatbot UI</h4>
          <button
            onClick={() => setDarkMode(dm => !dm)}
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 24,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={clearChat} style={{position: 'absolute', top: 15, left: 15, background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: 8, padding: '2px 10px', cursor: 'pointer'}}>Clear</button>
        </div>
        <div ref={chatBodyRef} className="chat-body" style={{
          flex: 1,
          padding: 20,
          overflowY: 'auto',
          color: darkMode ? '#e0e0e0' : '#333',
          minHeight: 0,
        }}>
          {messages.length === 0 && (
            <div style={{textAlign: 'center', color: '#888', marginTop: 100}}>
              <h5>Welcome! 👋</h5>
              <div>Ask me anything about code, AI, or more.</div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`} style={{display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 15}}>
              <div className="message-content" style={{
                padding: '10px 15px',
                borderRadius: 20,
                maxWidth: '70%',
                background: msg.sender === 'user' ? (darkMode ? '#1a73e8' : '#007bff') : (darkMode ? '#2e2e2e' : '#f1f0f0'),
                color: msg.error ? '#fff' : (msg.sender === 'user' ? '#fff' : (darkMode ? '#e0e0e0' : '#333')),
                border: msg.error ? '2px solid #e74c3c' : undefined,
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                overflowX: 'auto',
                boxSizing: 'border-box',
              }}>
                {msg.error ? <span style={{color: '#e74c3c'}}>{msg.text}</span> : (msg.sender === 'bot' ? parseBotResponse(msg.text) : <span>{msg.text}</span>)}
                <div style={{fontSize: 12, color: msg.error ? '#e74c3c' : '#aaa', marginTop: 4, textAlign: 'right'}}>{formatTime(msg.time)}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message bot" style={{display: 'flex', justifyContent: 'flex-start', marginBottom: 15}}>
              <div className="message-content" style={{padding: '10px 15px', borderRadius: 20, maxWidth: '70%', background: darkMode ? '#2e2e2e' : '#f1f0f0', color: darkMode ? '#e0e0e0' : '#333', fontStyle: 'italic', display: 'flex', alignItems: 'center'}}>
                <span>Bot is typing</span>
                <span className="typing-dots" style={{display: 'inline-block', marginLeft: 6}}>
                  <span className="dot" style={{animation: 'blink 1s infinite 0s'}}>.</span>
                  <span className="dot" style={{animation: 'blink 1s infinite 0.2s'}}>.</span>
                  <span className="dot" style={{animation: 'blink 1s infinite 0.4s'}}>.</span>
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="chat-footer" style={{padding: 15, background: darkMode ? '#2e2e2e' : '#f1f0f0'}}>
          <div className="input-group" style={{display: 'flex'}}>
            <input
              type="text"
              className="form-control"
              style={{flex: 1, borderRadius: 20, border: '1px solid #ccc', padding: '8px 12px'}}
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              ref={inputRef}
            />
            <button
              className="btn btn-primary"
              style={{marginLeft: 8, borderRadius: 20, background: '#007bff', color: '#fff', border: 'none', padding: '8px 20px'}}
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
