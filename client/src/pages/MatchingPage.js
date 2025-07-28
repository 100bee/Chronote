<<<<<<< HEAD
// src/pages/MatchingPage.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001"); // ✅ 서버 포트 수정

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
=======
cd// src/pages/MatchingPage.js

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000");

function MatchingPage() {
  const [userInput, setUserInput] = useState('파이썬으로 데이터 분석하는 스터디 찾아요');
  const [result, setResult] = useState('여기에 결과가 표시됩니다.');
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // ... (이전 App.js에 있던 소켓 로직 전부를 그대로 여기에 복사)
    socket.on('connect', () => setIsConnected(true));
    // ...
    return () => {
      socket.off('connect');
      // ...
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
    };
  }, []);

  const handleFindMatch = () => {
<<<<<<< HEAD
    if (!userInput.trim()) return;

    setLoading(true);
    setError(null);

    socket.emit('findMatch', { userText: userInput }, (response) => {
      setLoading(false);

      if (response.success && response.roomId) {
        navigate(`/chat/${response.roomId}`); // ✅ 매칭된 방으로 이동
      } else {
        setError(response.message || '매칭 실패');
      }
=======
    // ... (이전 App.js에 있던 매칭 함수 로직 전부를 그대로 여기에 복사)
    socket.emit('findMatch', { userText: userInput }, (response) => {
      setResult(JSON.stringify(response, null, 2));
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
    });
  };

  return (
<<<<<<< HEAD
    <div style={{ padding: '40px' }}>
      <h1>AI 채팅방 매칭</h1>
      <p>찾고 싶은 스터디 그룹을 입력하세요.</p>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="예: 리액트 초보자들만 있는 스터디!"
        style={{ width: '60%', padding: '10px', marginRight: '10px' }}
      />

      <button onClick={handleFindMatch} disabled={!isConnected || loading}>
        {loading ? '매칭 중...' : isConnected ? '매칭 시작' : '서버 연결 중...'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <strong>⚠ 매칭 실패:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default MatchingPage;
=======
    <>
      <h1>AI 채팅방 매칭 기능 테스트</h1>
      <p>찾고 싶은 스터디 그룹에 대해 자유롭게 입력하고 '매칭 시작' 버튼을 누르세요.</p>
      <div className="input-container">
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={handleFindMatch} disabled={!isConnected}>
          {isConnected ? '매칭 시작' : '서버 연결 중...'}
        </button>
      </div>

      <h2>테스트 결과:</h2>
      <pre id="result">{result}</pre>
    </>
  );
}

export default MatchingPage;
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
