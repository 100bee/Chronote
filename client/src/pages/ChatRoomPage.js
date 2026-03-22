// src/pages/ChatRoomPage.js
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import api from '../api/index';
import '../css/chatroom.scss';
import { getNickname, getToken, getUserId } from '../utils/auth';

const FASTAPI_URL = 'http://localhost:8000';

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const nickname = getNickname();
  const myUserId = getUserId();

  useEffect(() => {
    // ✅ 채팅방 제목 - Spring Boot에서 가져오기
    api.get(`/api/chatrooms/${roomId}`)
      .then(res => setRoomTitle(res.data.title))
      .catch(() => setRoomTitle('(제목 없음)'));

    // ✅ 이전 메시지 - FastAPI에서 가져오기
    axios.get(`${FASTAPI_URL}/messages/${roomId}`)
      .then(res => {
        setMessages(res.data.map(msg => ({
          ...msg,
          sender: msg.sender === myUserId ? nickname : msg.sender,
        })));
      })
      .catch(() => {});

    // ✅ STOMP WebSocket 연결
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          const received = JSON.parse(message.body);
          setMessages(prev => [...prev, {
            ...received,
            sender: received.sender === myUserId ? nickname : received.sender,
          }]);
        });
      },
      onDisconnect: () => console.log('🔌 STOMP 연결 해제'),
      onStompError: (frame) => console.error('❌ STOMP 오류:', frame),
    });

    client.activate();
    stompClientRef.current = client;
    return () => client.deactivate();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const token = getToken();
    if (!token) { alert('로그인이 필요합니다.'); return; }

    const newMsg = { roomId, message: input, sender: nickname || '나' };

    // ✅ STOMP 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(newMsg),
      });
    }

    // ✅ FastAPI 저장
    try {
      await axios.post(`${FASTAPI_URL}/messages`, newMsg, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('메시지 저장 실패:', err);
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