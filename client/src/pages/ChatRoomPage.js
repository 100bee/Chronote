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
  const [roomTitle, setRoomTitle] = useState(''); // ✅ 채팅방 제목 상태
  const messagesEndRef = useRef(null);
  const nickname = localStorage.getItem("nickname");
  const myUserId = localStorage.getItem("user_id");

  // ✅ 방 입장 + 제목/이전메시지 불러오기 + 소켓 리스너 등록
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    // ✅ 채팅방 제목 불러오기
    const fetchRoomTitle = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/chatrooms/${roomId}`);
        setRoomTitle(res.data.title);
      } catch (err) {
        console.error('❌ 채팅방 제목 불러오기 실패:', err);
        setRoomTitle('(제목 없음)');
      }
    };

    // ✅ FastAPI에서 이전 메시지 불러오기
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/messages/${roomId}`);
        const fetched = res.data;

        const processed = fetched.map(msg => ({
          ...msg,
          sender: msg.sender === myUserId ? nickname : msg.sender
        }));

        setMessages(processed);
      } catch (err) {
        console.error('❌ 메시지 불러오기 실패:', err);
      }
    };

    fetchRoomTitle();
    fetchMessages();

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

    socket.emit('chatMessage', {
      ...newMsg,
      sender: nickname || '나',
    });

    setMessages(prev => [...prev, { ...newMsg, sender: nickname || '나' }]);

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
      <div className="chatroom-header">
        🗨️ 채팅방: {roomTitle} ({roomId})
      </div>

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
