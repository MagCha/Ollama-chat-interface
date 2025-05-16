import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
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
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const THEMES = {
  dark: {
    name: 'Dark',
    background: '#121212',
    chatBackground: '#1e1e1e',
    header: '#23242a', // Match sidebar color
    userBubble: '#1a73e8',
    botBubble: '#2e2e2e',
    text: '#e0e0e0',
    input: '#2e2e2e',
    border: '#444',
    accent: '#007bff',
  },
  light: {
    name: 'Light',
    background: '#f7f7f7',
    chatBackground: '#fff',
    header: '#007bff',
    userBubble: '#007bff',
    botBubble: '#f1f0f0',
    text: '#333',
    input: '#f1f0f0',
    border: '#ccc',
    accent: '#007bff',
  },
  solarized: {
    name: 'Solarized',
    background: '#fdf6e3',
    chatBackground: '#eee8d5',
    header: '#b58900',
    userBubble: '#268bd2',
    botBubble: '#93a1a1',
    text: '#657b83',
    input: '#eee8d5',
    border: '#b58900',
    accent: '#cb4b16',
  },
};

function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chatHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert time strings back to Date objects
        return parsed.map(msg => ({...msg, time: msg.time ? new Date(msg.time) : new Date()}));
      }
    } catch {}
    return [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('bgImage') || '');
  const [savedChats, setSavedChats] = useState(() => {
    try {
      const saved = localStorage.getItem('savedChats');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const themeObj = THEMES[theme] || THEMES.dark;
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = '';
    // Remove document.body.style.background logic to avoid conflicts
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bgImage', bgImage);
  }, [bgImage]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [loading]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Save savedChats to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedChats', JSON.stringify(savedChats));
  }, [savedChats]);

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

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const saveCurrentChat = () => {
    if (messages.length === 0) return;
    const chatTitle = prompt('Enter a name for this chat:', `Chat ${savedChats.length + 1}`);
    if (!chatTitle) return;
    setSavedChats(chats => [...chats, { title: chatTitle, messages }]);
  };

  const loadChat = idx => {
    const chat = savedChats[idx];
    if (chat) setMessages(chat.messages);
  };

  const deleteChat = idx => {
    setSavedChats(chats => chats.filter((_, i) => i !== idx));
  };

  const startNewChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <>
      {bgImage && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            zIndex: -1,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: `url('${bgImage}') center/cover no-repeat fixed`,
            filter: 'blur(8px) brightness(0.9)',
            pointerEvents: 'none',
          }}
        />,
        document.body
      )}
      <div className="App" style={{position: 'relative', minHeight: '100vh', minWidth: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'row'}}>
        {/* Sidebar toggle button - always visible, fixed in header */}
        <div style={{position: 'fixed', top: 15, left: sidebarOpen ? 235 : 15, zIndex: 20, transition: 'left 0.2s'}}> {/* Move right when sidebar is open */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: themeObj.header,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
            }}
            aria-label={sidebarOpen ? 'Hide saved chats' : 'Show saved chats'}
          >
            {/* Hamburger icon */}
            <span style={{display: 'block', width: 22, height: 18, position: 'relative'}}>
              <span style={{position: 'absolute', height: 3, width: '100%', background: '#fff', borderRadius: 2, top: 0, left: 0}}></span>
              <span style={{position: 'absolute', height: 3, width: '100%', background: '#fff', borderRadius: 2, top: 7.5, left: 0}}></span>
              <span style={{position: 'absolute', height: 3, width: '100%', background: '#fff', borderRadius: 2, top: 15, left: 0}}></span>
            </span>
          </button>
        </div>
        {/* Clear button - fixed next to sidebar toggle, always visible and moves with sidebar */}
        <div style={{position: 'fixed', top: 15, left: sidebarOpen ? 285 : 65, zIndex: 19, transition: 'left 0.2s'}}>
          <button onClick={clearChat} style={{background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: 8, padding: '2px 10px', cursor: 'pointer'}}>Clear</button>
        </div>
        {/* Sidebar for saved chats */}
        {sidebarOpen && (
          <nav className="sidenav">
            <div className="sidebar-header">Saved Chats</div>
            <div className="sidebar-actions">
              <button onClick={saveCurrentChat}>Save Current</button>
              <button onClick={startNewChat}>New Chat</button>
            </div>
            <div className="saved-chats-list">
              {savedChats.length === 0 && (
                <div className="no-saved-chats">No saved chats</div>
              )}
              {savedChats.length > 0 && (
                savedChats.map((chat, idx) => (
                  <div
                    key={idx}
                    className={
                      'saved-chat-item' + (messages === chat.messages ? ' active' : '')
                    }
                    onClick={() => loadChat(idx)}
                    title={chat.title}
                  >
                    <span className="saved-chat-title">{chat.title}</span>
                    <button
                      className="trash-icon-btn"
                      onClick={e => { e.stopPropagation(); deleteChat(idx); }}
                      title="Delete"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 7.5V14.5M10 7.5V14.5M13.5 7.5V14.5M3.5 4.5H16.5M8.5 4.5V3.5C8.5 2.94772 8.94772 2.5 9.5 2.5H10.5C11.0523 2.5 11.5 2.94772 11.5 3.5V4.5M4.5 4.5V16.5C4.5 17.0523 4.94772 17.5 5.5 17.5H14.5C15.0523 17.5 15.5 17.0523 15.5 16.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </nav>
        )}
        {/* Main chat area */}
        <div className="chat-container" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          background: 'transparent',
          borderRadius: 0,
          boxShadow: 'none',
          width: sidebarOpen ? 'calc(100vw - 220px)' : '100vw', // Shrink when sidebar is open
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          marginLeft: sidebarOpen ? 220 : 0, // Push main area to the right when sidebar is open
          transition: 'width 0.2s, margin-left 0.2s',
        }}>
          <div className="chat-header" style={{background: themeObj.header, color: '#fff', padding: 15, textAlign: 'center', position: 'relative', minHeight: 60}}>
            <h4 style={{margin: 0}}>Chatbot UI</h4>
            <div style={{position: 'absolute', left: (sidebarOpen ? 340 : 120), top: 15, display: 'flex', alignItems: 'center', transition: 'left 0.2s'}}>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                style={{borderRadius: 6, border: 'none', padding: '2px 8px', fontSize: 14, background: themeObj.input, color: themeObj.text, outline: 'none', cursor: 'pointer', marginRight: 10}}
                aria-label="Select theme"
              >
                {Object.entries(THEMES).map(([key, t]) => (
                  <option key={key} value={key}>{t.name}</option>
                ))}
              </select>
              <label style={{fontSize: 14, color: '#fff', cursor: 'pointer', marginRight: 10}}>
                <input
                  type="file"
                  accept="image/*"
                  style={{display: 'none'}} 
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setBgImage(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span style={{textDecoration: 'underline'}}>Set Background</span>
              </label>
              {bgImage && (
                <button
                  onClick={() => setBgImage('')}
                  style={{background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: 8, padding: '2px 10px', cursor: 'pointer', fontSize: 14, marginRight: 10}}
                >
                  Remove Background
                </button>
              )}
            </div>
          </div>
          <div ref={chatBodyRef} className="chat-body" style={{
            flex: 1,
            padding: 20,
            overflowY: 'auto',
            color: themeObj.text,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            // Remove alignItems here
          }}>
            {messages.length === 0 && (
              <div style={{textAlign: 'center', color: '#888', marginTop: 100}}>
                <h5>Welcome! 👋</h5>
                <div>Ask me anything about code, AI, or more.</div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.sender}`}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start', // Always align to top for both
                  marginBottom: 15,
                  width: '100%',
                }}
              >
                <div
                  className="message-content"
                  style={{
                    // Remove marginLeft: 'auto' and marginRight: 'auto' for both
                    padding: '10px 15px',
                    borderRadius: 20,
                    maxWidth: '70%',
                    background: msg.sender === 'user' ? themeObj.userBubble : themeObj.botBubble,
                    color: msg.error ? '#fff' : (msg.sender === 'user' ? '#fff' : themeObj.text),
                    border: msg.error ? '2px solid #e74c3c' : undefined,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    overflowX: 'auto',
                    boxSizing: 'border-box',
                    textAlign: 'left', // Ensure all text, including newlines/paragraphs, is left-aligned
                  }}
                >
                  {msg.error ? (
                    <span style={{ color: '#e74c3c' }}>{msg.text}</span>
                  ) : msg.sender === 'bot' ? (
                    parseBotResponse(msg.text)
                  ) : (
                    <span>{msg.text}</span>
                  )}
                  <div style={{ fontSize: 12, color: msg.error ? '#e74c3c' : '#aaa', marginTop: 4, textAlign: 'right' }}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot" style={{display: 'flex', justifyContent: 'flex-start', marginBottom: 15}}>
                <div className="message-content" style={{padding: '10px 15px', borderRadius: 20, maxWidth: '70%', background: themeObj.botBubble, color: themeObj.text, fontStyle: 'italic', display: 'flex', alignItems: 'center'}}>
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
          <div className="chat-footer" style={{padding: 15, background: themeObj.input}}>
            <div className="input-group" style={{display: 'flex'}}>
              <input
                type="text"
                className="form-control"
                style={{
                  flex: 1,
                  borderRadius: 20,
                  border: `1px solid ${themeObj.border}`,
                  padding: '8px 12px',
                  background: themeObj.input,
                  color: themeObj.text,
                  minWidth: 0,
                  transition: 'width 0.2s',
                  width: '100%',
                  // No need to set width here, parent container handles it
                }}
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={loading}
                ref={inputRef}
              />
              <button
                className="btn btn-primary"
                style={{marginLeft: 8, borderRadius: 20, background: themeObj.accent, color: '#fff', border: 'none', padding: '8px 20px'}}
                onClick={sendMessage}
                disabled={loading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
