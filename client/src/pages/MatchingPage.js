// src/pages/MatchingPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findMatch } from '../api/match';
import '../css/matchPage.scss';

function MatchingPage() {
  const [userInput, setUserInput] = useState('파이썬으로 데이터 분석하는 스터디 찾아요');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFindMatch = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await findMatch(userInput);
      const { best_match_room_id, message } = res.data;
      if (best_match_room_id) {
        navigate(`/chat/${best_match_room_id}`);
      } else {
        setError(message || '매칭 실패');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
          onKeyDown={(e) => e.key === 'Enter' && handleFindMatch()}
          placeholder="예: 리액트 초보자들만 있는 스터디!"
        />
        <button onClick={handleFindMatch} disabled={loading}>
          {loading ? '매칭 중...' : '매칭 시작'}
        </button>
        {error && <div className="error-msg">⚠ {error}</div>}
      </div>
      <div className="match-right">
        <img src="/favicon3.png" alt="매칭 일러스트" className="match-image" />
      </div>
    </div>
  );
}

export default MatchingPage;
