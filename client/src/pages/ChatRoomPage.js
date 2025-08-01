// src/pages/ChatRoomPage.js
// ✅ 실시간 채팅방 페이지: socket.io를 통해 특정 roomId에 입장하여 채팅 주고받기

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/chatroom.scss'; // 채팅방 스타일

// ✅ 서버에 연결된 소켓 클라이언트 생성
const socket = io("http://localhost:3001");

const ChatRoomPage = () => {
  const { roomId } = useParams();              // URL 파라미터에서 roomId 추출
  const [messages, setMessages] = useState([]); // 채팅 메시지 배열
  const [input, setInput] = useState('');       // 입력창 내용
  const messagesEndRef = useRef(null);          // 자동 스크롤용 ref

  // ✅ 방 입장 및 새 메시지 수신 처리
  useEffect(() => {
    socket.emit('joinRoom', roomId); // 서버에 방 참가 요청

    // 서버로부터 새로운 메시지 수신 시 처리
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]); // 메시지 추가
    });

    // 언마운트 시 리스너 정리
    return () => {
      socket.off('newMessage');
    };
  }, [roomId]);

  // ✅ 새로운 메시지가 추가될 때 스크롤을 아래로 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMsg = {
      roomId,
      sender: '사용자',   // 추후 실제 로그인 사용자 이름으로 대체 가능
      message: input
    };

    socket.emit('chatMessage', newMsg); // 서버로 메시지 전송
    setMessages(prev => [...prev, newMsg]); // 로컬 메시지 추가
    setInput(''); // 입력창 초기화
  };

  return (
    <div className="chatroom-container">
      {/* ✅ 채팅방 상단: 방 번호 표시 */}
      <div className="chatroom-header">🗨️ 채팅방 코드: {roomId}</div>

      {/* ✅ 채팅 메시지 영역 */}
      <div className="chatroom-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender === '사용자' ? 'own' : 'other'}`} // 내가 보낸 메시지는 오른쪽
          >
            <strong>{msg.sender}</strong>: {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 스크롤 anchor */}
      </div>

      {/* ✅ 입력창 + 전송 버튼 */}
      <div className="chatroom-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // 엔터 입력 처리
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
