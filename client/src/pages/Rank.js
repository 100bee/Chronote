// 📁 src/pages/Rank.js
import { useEffect, useState } from 'react';
import { getRanking, getUserInfo } from '../api/rank';
import ScoreChart from '../components/ScoreChart';
import ScoreLog from '../components/ScoreLog';
import '../css/rankPage.scss';

const RANK_BOUNDS = {
  브론즈:   { min: 0,    max: 100  },
  실버:     { min: 101,  max: 300  },
  골드:     { min: 301,  max: 600  },
  플래티넘:  { min: 601,  max: 1000 },
  다이아:   { min: 1001, max: 2000 },
  마스터:   { min: 2001, max: 99999},
};

const Rank = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserInfo(), getRanking()])
      .then(([userRes, rankRes]) => {
        setUserInfo(userRes.data);
        setRanking(rankRes.data);
      })
      .catch(err => console.error('랭크 데이터 로딩 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#78716c' }}>
      로딩중...
    </div>
  );
  if (!userInfo) return <div style={{ padding: 40, color: '#78716c' }}>유저 정보를 불러오지 못했습니다.</div>;

  const tier = userInfo.tier || '브론즈';
  const { min, max } = RANK_BOUNDS[tier] || { min: 0, max: 100 };
  const percent = Math.max(0, Math.min(100, ((userInfo.score - min) / (max - min)) * 100));

  return (
    <div className="rank-page">
      <div className="rank-left-box">
        <h2>내 정보</h2>
        <div className="user-info">
          <p><strong>이메일</strong> {userInfo.userId}</p>
          <p><strong>닉네임</strong> <span className={`nickname ${tier}`}>{userInfo.nickname}</span></p>
          <p><strong>현재 랭크</strong> <span className={`nickname ${tier}`}>{tier}</span></p>
          <p><strong>보유 점수</strong> {userInfo.score}점</p>
        </div>

        <div className="tier-bar-wrap">
          <div className="tier-bar-bg">
            <div className="tier-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="tier-bar-label">티어 내 달성률 {percent.toFixed(1)}%</div>
        </div>

        <ScoreLog />
        <ScoreChart />

        <hr />

        <div className="next-rank">
          <h3>다음 랭크 조건</h3>
          {userInfo.nextTier ? (
            <ul>
              <li>다음 랭크: <strong>{userInfo.nextTier.name}</strong></li>
              <li>필요 점수: <strong>+{userInfo.nextTier.requiredScore}점</strong></li>
            </ul>
          ) : (
            <p style={{ color: '#f97316', fontWeight: 600 }}>🏆 최고 랭크 달성!</p>
          )}
        </div>
      </div>

      <div className="rank-right-box">
        <h2>전체 사용자 랭킹</h2>
        <ol className="ranking-list">
          {ranking.map((user, idx) => (
            <li key={user.userId || idx}>
              <span className="rank-num">{idx + 1}위</span>
              <span className={`nickname ${user.tier}`}>{user.nickname}</span>
              <span style={{ color: '#78716c', fontSize: '0.85rem', marginLeft: 'auto' }}>{user.score}점</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Rank;
