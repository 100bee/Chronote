// src/pages/MatchingPage.js
// ✅ AI 기반 스터디 채팅방 매칭 페이지
// 사용자가 스터디 조건을 입력하면 서버로 소켓 요청을 보내 매칭된 채팅방으로 이동한다.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/matchPage.scss'; // 💡 반드시 스타일 포함

// ✅ 소켓 연결 (백엔드 서버 주소로 연결)
const socket = io("http://localhost:3001");

function MatchingPage() {
  const [userInput, setUserInput] = useState('파이썬으로 데이터 분석하는 스터디 찾아요'); // 사용자가 입력한 매칭 조건
  const [isConnected, setIsConnected] = useState(socket.connected); // 소켓 연결 상태
  const [loading, setLoading] = useState(false);  // 매칭 요청 중인지 여부
  const [error, setError] = useState(null);       // 에러 메시지
  const navigate = useNavigate(); // 라우팅을 위한 훅

  // ✅ 소켓 연결/해제 이벤트 감지
  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));     // 연결 성공 시
    socket.on('disconnect', () => setIsConnected(false)); // 연결 끊김 시

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // ✅ 매칭 버튼 클릭 시 서버로 매칭 요청
  const handleFindMatch = () => {
    if (!userInput.trim()) return;

    setLoading(true);   // 로딩 중 표시
    setError(null);     // 이전 에러 초기화

    // 서버로 'findMatch' 이벤트 전송, 응답 콜백 처리
    socket.emit('findMatch', { userText: userInput }, (response) => {
      setLoading(false);

      if (response.success && response.roomId) {
        navigate(`/chat/${response.roomId}`); // 매칭된 채팅방으로 이동
      } else {
        setError(response.message || '매칭 실패'); // 실패 메시지 표시
      }
    });
  };

  return (
    <div className="match-page">
      {/* ✅ 왼쪽 영역: 입력 및 매칭 버튼 */}
      <div className="match-left">
        <h1>AI 채팅방 매칭</h1>
        <p>찾고 싶은 스터디 그룹을 입력하세요.</p>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="예: 리액트 초보자들만 있는 스터디!"
        />

        <button onClick={handleFindMatch} disabled={!isConnected || loading}>
          {loading
            ? '매칭 중...'
            : isConnected
              ? '매칭 시작'
              : '서버 연결 중...'}
        </button>

        {/* 에러 메시지 표시 */}
        {error && <div className="error-msg">⚠ {error}</div>}
      </div>

      {/* ✅ 오른쪽 영역: 일러스트 또는 로고 */}
      <div className="match-right">
        <img
          src="/favicon3.png"
          alt="매칭 일러스트"
          className="match-image"
        />
      </div>
    </div>
  );
}

export default MatchingPage;
