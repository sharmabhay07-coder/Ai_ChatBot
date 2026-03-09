import { useState, useRef, useEffect } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SYSTEM_PROMPT = "You are Hasty, a friendly and helpful AI assistant. Keep replies clear and concise.";

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Hasty, your AI assistant. How can I help you today?", time: timeNow() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text, time: timeNow() }]);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setLoading(true);

    historyRef.current.push({ role: 'user', content: text });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...historyRef.current
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Request failed');

      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";
      historyRef.current.push({ role: 'assistant', content: reply });
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: timeNow() }]);

    } catch (err) {
      historyRef.current.pop();

      const msg = err.message.toLowerCase();
      let friendlyError = `Error: ${err.message}`;
      if (msg.includes('quota') || msg.includes('rate') || msg.includes('429')) {
        friendlyError = '⏳ Rate limit hit. Please wait a moment and try again.';
      } else if (msg.includes('401') || msg.includes('api key')) {
        friendlyError = '🔑 Invalid API key. Please check your .env file.';
      } else if (msg.includes('network') || msg.includes('fetch')) {
        friendlyError = '📡 Network error. Please check your connection.';
      }

      setMessages(prev => [...prev, { role: 'bot', text: friendlyError, time: timeNow(), error: true }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="screen">
      <div className="chat-window">

        <div className="chat-header">
          <div className="avatar">🤖</div>
          <div className="header-info">
            <span className="header-name">Hasty</span>
            <span className="header-status">
              <span className="status-dot" /> Online
            </span>
          </div>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`row ${msg.role}`}>
              {msg.role === 'bot' && <div className="bot-avatar">🤖</div>}
              <div className={`bubble ${msg.error ? 'error' : ''}`}>
                <p>{msg.text}</p>
                <span className="time">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="row bot">
              <div className="bot-avatar">🤖</div>
              <div className="bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="input-bar">
          <textarea
            ref={inputRef}
            className="input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Write a message..."
            rows={1}
            disabled={loading}
          />
          <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}