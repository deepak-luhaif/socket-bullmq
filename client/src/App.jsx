import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // backend URL

export default function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('previous-messages', (oldMessages) => {
      setMessages(oldMessages);
    });

    return () => {
      socket.off('message');
      socket.off('previous-messages');
    };
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    const msgData = { username, message };
    socket.emit('message', msgData);
    setMessage('');
  };

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter your name to join chat:</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={() => setJoined(true)}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {username} 👋</h2>

      <div
        style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid gray',
          marginBottom: 10,
          padding: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder='Type your message'
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
