// src/pages/ChatRoomPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMsg = {
      roomId,
      sender: '사용자',
      message: input
    };
    socket.emit('chatMessage', newMsg);
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>채팅방: {roomId}</h2>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.sender}:</strong> {msg.message}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoomPage;
