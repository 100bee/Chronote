import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/chatroom.scss';

const socket = io("http://localhost:3001");

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const nickname = localStorage.getItem("nickname");

  // ✅ 방 입장 및 소켓 리스너 설정
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [roomId]);

  // ✅ 채팅창 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = async () => {
    if (input.trim() === '') return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const newMsg = {
      roomId,
      message: input,
    };

    // ✅ 실시간 전송 (프론트에는 임시로 '나' 표시)
    socket.emit('chatMessage', {
      ...newMsg,
      sender: nickname || '나',
    });

    setMessages(prev => [...prev, { ...newMsg, sender: nickname || '나' }]);

    // ✅ FastAPI 서버에 JWT 인증 포함 메시지 저장
    try {
      await axios.post('http://localhost:8000/messages', newMsg, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    } catch (err) {
      console.error('📛 FastAPI 메시지 저장 실패:', err);
    }

    setInput('');
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">🗨️ 채팅방 코드: {roomId}</div>

      <div className="chatroom-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender === nickname ? 'own' : 'other'}`}
          >
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
