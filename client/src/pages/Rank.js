import { useEffect, useState } from 'react';
import ScoreChart from '../components/ScoreChart';
import ScoreLog from '../components/ScoreLog';
import '../css/rankPage.scss';

const RANK_BOUNDS = {
  Bronze: { min: 0, max: 100 },
  Silver: { min: 101, max: 300 },
  Gold: { min: 301, max: 500 },
  Platinum: { min: 501, max: 1000 },
  Diamond: { min: 1001, max: 99999 },
};

const dummyUserInfo = {
  user_id: '1',
  nickname: '테스트유저',
  tier: 'Bronze',
  score: 50,
  nextTier: {
    name: 'Silver',
    requiredScore: 51,
    requiredTodos: 3,
    requiredAttendance: 5,
  },
};

const dummyRanking = [
  { user_id: '1', nickname: '테스트유저', tier: 'Bronze', score: 50 },
  { user_id: '2', nickname: '실버유저', tier: 'Silver', score: 150 },
  { user_id: '3', nickname: '골드유저', tier: 'Gold', score: 400 },
  { user_id: '4', nickname: '플래티넘유저', tier: 'Platinum', score: 700 },
  { user_id: '5', nickname: '다이아유저', tier: 'Diamond', score: 1500 },
];

const Rank = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserInfo(dummyUserInfo);
    setRanking(dummyRanking);
    setLoading(false);
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  const tier = userInfo.tier || 'Bronze';
  const { min, max } = RANK_BOUNDS[tier] || { min: 0, max: 100 };
  let percent = ((userInfo.score - min) / (max - min)) * 100;
  percent = Math.max(0, Math.min(100, percent));

  return (
    <div className="rank-page">
      <div className="rank-left-box">
        <h2>내 정보</h2>
        <div className="user-info">
          <p><strong>ID:</strong> {userInfo.user_id}</p>
          <p>
            <strong>닉네임:</strong> <span className={`nickname ${userInfo.tier?.toLowerCase()}`}>{userInfo.nickname}</span>
          </p>
          <p>
            <strong>현재 랭크:</strong> <span className={`nickname ${userInfo.tier?.toLowerCase()}`}>{userInfo.tier}</span>
          </p>
          <p><strong>보유 점수:</strong> {userInfo.score}점</p>
        </div>

        <div style={{
          border: '1px solid #aaa',
          borderRadius: 10,
          width: 250,
          height: 20,
          background: '#eee',
          margin: '20px 0'
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: '#82ca9d',
            borderRadius: 10
          }} />
        </div>
        <p style={{ fontSize: 13, textAlign: 'center', marginBottom: 8 }}>
          내 티어 내 점수 달성률: {percent.toFixed(1)}%
        </p>

        <ScoreLog userId={userInfo.user_id} />
        <ScoreChart userId={userInfo.user_id} />

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

export default Rank;
