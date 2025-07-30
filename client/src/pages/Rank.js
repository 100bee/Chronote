// client/src/pages/RankPage.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/rankPage.scss';

const RankPage = () => {
  // 상태 변수
  const [userInfo, setUserInfo] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 내 정보 (로그인 기반 API로 수정)
        const userRes = await axios.get('/api/userinfo');
        setUserInfo(userRes.data);

        // 랭킹 리스트
        const rankRes = await axios.get('/api/rank');
        setRanking(rankRes.data);
      } catch (err) {
        console.error('랭킹 페이지 데이터 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="rank-page">
      <div className="rank-left-box">
        <h2>내 정보</h2>
        <div className="user-info">
          <p><strong>ID:</strong> {userInfo.user_id}</p>
          <p>
            <strong>닉네임:</strong>
            <span className={`nickname ${userInfo.tier?.toLowerCase()}`}>{userInfo.nickname}</span>
          </p>
          <p>
            <strong>현재 랭크:</strong>
            <span className={`nickname ${userInfo.tier?.toLowerCase()}`}>{userInfo.tier}</span>
          </p>
          <p><strong>보유 점수:</strong> {userInfo.score}점</p>
        </div>
        <hr />
        <div className="next-rank">
          <h3>다음 랭크 조건</h3>
          <ul>
            <li>
              다음 랭크: <span className={`nickname ${userInfo.nextTier?.name?.toLowerCase()}`}>
                <strong>{userInfo.nextTier?.name}</strong>
              </span>
            </li>
            <li>필요 점수: <strong>+{userInfo.nextTier?.requiredScore}점</strong></li>
            <li>할 일 완료 {userInfo.nextTier?.requiredTodos || 3}개 이상</li>
            <li>연속 출석 {userInfo.nextTier?.requiredAttendance || 5}일</li>
          </ul>
        </div>
      </div>

      <div className="rank-right-box">
        <h2>전체 사용자 랭킹</h2>
        <ol className="ranking-list">
          {ranking.map((user, idx) => (
            <li key={user.user_id || user.id}>
              {idx + 1}위 - <span className={`nickname ${user.tier?.toLowerCase()}`}>{user.nickname}</span>
              (<span className={`nickname ${user.tier?.toLowerCase()}`}>{user.tier}</span>) - {user.score}점
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RankPage;
