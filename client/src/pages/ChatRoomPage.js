import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/chatroom.scss'; // 추가된 CSS 파일

const socket = io("http://localhost:3001");

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="chatroom-container">
      <div className="chatroom-header">🗨️ 채팅방 코드: {roomId}</div>

      <div className="chatroom-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender === '사용자' ? 'own' : 'other'}`}>
            <strong>{msg.sender}</strong>: {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatroom-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
