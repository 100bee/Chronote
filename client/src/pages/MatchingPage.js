// src/pages/MatchingPage.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/matchPage.scss'; // 💡 반드시 scss도 함께 추가

const socket = io("http://localhost:3001");

function MatchingPage() {
  const [userInput, setUserInput] = useState('파이썬으로 데이터 분석하는 스터디 찾아요');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleFindMatch = () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setError(null);

    socket.emit('findMatch', { userText: userInput }, (response) => {
      setLoading(false);
      if (response.success && response.roomId) {
        navigate(`/chat/${response.roomId}`);
      } else {
        setError(response.message || '매칭 실패');
      }
    });
  };

  return (
    <div className="match-page">
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
          {loading ? '매칭 중...' : isConnected ? '매칭 시작' : '서버 연결 중...'}
        </button>

        {error && <div className="error-msg">⚠ {error}</div>}
      </div>

      <div className="match-right">
        <img
          src="/favicon3.png" // 임시 이미지
          alt="매칭 일러스트"
          className="match-image"
        />
      </div>
    </div>
  );
}

export default MatchingPage;
