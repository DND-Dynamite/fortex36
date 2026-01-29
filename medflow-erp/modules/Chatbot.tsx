import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const OllamaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const botMessage: Message = { 
        role: 'bot', 
        content: data.response 
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setMessages((prev) => [...prev, { role: 'bot', content: "Error: Could not connect to the backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.chatContainer}>
        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.user : styles.bot)
              }}
            >
              <b>{msg.role === 'user' ? 'You: ' : 'AI: '}</b>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask something securely..."
            style={styles.input}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading}
            style={styles.button}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS Styles (keeping your original design)
const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: '#1e1e1e',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    height: '100vh',
    boxSizing: 'border-box'
  },
  chatContainer: {
    width: '100%',
    maxWidth: '800px',
    background: '#2d2d2d',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
  },
  messages: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
    borderBottom: '1px solid #444',
  },
  message: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    lineHeight: '1.5',
  },
  user: {
    background: '#3a3a3a',
    alignSelf: 'flex-end',
  },
  bot: {
    background: '#4a4a4a',
  },
  inputArea: {
    display: 'flex',
    padding: '20px',
    gap: '10px',
  },
  input: {
    flexGrow: 1,
    padding: '12px',
    borderRadius: '5px',
    border: 'none',
    background: '#3d3d3d',
    color: 'white',
  },
  button: {
    padding: '10px 20px',
    background: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default OllamaChat;