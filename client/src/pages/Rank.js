// src/pages/Rank.js
// ✅ 랭킹 페이지
// 내 랭크 및 점수, 티어 진행률, 다음 티어 조건, 전체 사용자 순위를 시각화해 보여주는 페이지

import axios from 'axios';
import { useEffect, useState } from 'react';
import ScoreChart from '../components/ScoreChart'; // 일별 점수 변화 차트
import ScoreLog from '../components/ScoreLog'; // 점수 변화 로그
import '../css/rankPage.scss'; // 랭크 스타일

// ✅ 티어별 점수 범위 정의
const RANK_BOUNDS = {
  Bronze:   { min: 0, max: 100 },
  Silver:   { min: 101, max: 300 },
  Gold:     { min: 301, max: 500 },
  Platinum: { min: 501, max: 1000 },
  Diamond:  { min: 1001, max: 99999 },
};

const Rank = () => {
  const [userInfo, setUserInfo] = useState(null); // 현재 로그인된 사용자 정보
  const [ranking, setRanking] = useState([]);     // 전체 사용자 랭킹 리스트
  const [loading, setLoading] = useState(true);   // 로딩 상태

  // ✅ 로그인된 사용자 정보 + 전체 랭킹 불러오기
  useEffect(() => {
    const fetchRankData = async () => {
      try {
        const token = localStorage.getItem('token');

        // 내 정보 요청
        const userRes = await axios.get('http://localhost:3001/api/rank/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 전체 랭킹 요청
        const rankRes = await axios.get('http://localhost:3001/api/rank');

        setUserInfo(userRes.data);
        setRanking(rankRes.data);
      } catch (err) {
        console.error('랭크 데이터 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankData();
  }, []);

  // ✅ 예외 처리: 로딩 중 또는 사용자 정보 없음
  if (loading) return <div>로딩중...</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  // ✅ 현재 티어 및 점수 기반 진행률 계산
  const tier = userInfo.tier || 'Bronze';
  const { min, max } = RANK_BOUNDS[tier] || { min: 0, max: 100 };
  let percent = ((userInfo.score - min) / (max - min)) * 100;
  percent = Math.max(0, Math.min(100, percent)); // 0~100 사이로 고정

  return (
    <div className="rank-page">
      {/* ✅ 왼쪽 박스: 내 정보, 점수 로그, 티어 진행률, 다음 조건 */}
      <div className="rank-left-box">
        <h2>내 정보</h2>
        <div className="user-info">
          <p><strong>ID:</strong> {userInfo.user_id}</p>
          <p>
            <strong>닉네임:</strong>{' '}
            <span className={`nickname ${tier.toLowerCase()}`}>{userInfo.nickname}</span>
          </p>
          <p>
            <strong>현재 랭크:</strong>{' '}
            <span className={`nickname ${tier.toLowerCase()}`}>{tier}</span>
          </p>
          <p><strong>보유 점수:</strong> {userInfo.score}점</p>
        </div>

        {/* ✅ 티어 진행률 바 */}
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

        {/* ✅ 점수 변화 로그 및 일별 점수 차트 */}
        <ScoreLog userId={userInfo.user_id} />
        <ScoreChart userId={userInfo.user_id} />

        <hr />

        {/* ✅ 다음 랭크 승급 조건 */}
        <div className="next-rank">
          <h3>다음 랭크 조건</h3>
          <ul>
            <li>
              다음 랭크:{' '}
              <span className={`nickname ${userInfo.nextTier?.name?.toLowerCase()}`}>
                <strong>{userInfo.nextTier?.name}</strong>
              </span>
            </li>
            <li>필요 점수: <strong>+{userInfo.nextTier?.requiredScore}점</strong></li>
            <li>할 일 완료 {userInfo.nextTier?.requiredTodos || 3}개 이상</li>
            <li>연속 출석 {userInfo.nextTier?.requiredAttendance || 5}일</li>
          </ul>
        </div>
      </div>

      {/* ✅ 오른쪽 박스: 전체 사용자 랭킹 */}
      <div className="rank-right-box">
        <h2>전체 사용자 랭킹</h2>
        <ol className="ranking-list">
          {ranking.map((user, idx) => (
            <li key={user.user_id || user.id}>
              {idx + 1}위 -{' '}
              <span className={`nickname ${user.tier?.toLowerCase()}`}>{user.nickname}</span>
              (<span className={`nickname ${user.tier?.toLowerCase()}`}>{user.tier}</span>) - {user.score}점
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Rank;
