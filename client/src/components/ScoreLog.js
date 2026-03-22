// client/src/components/ScoreLog.js
// ✅ 사용자 점수 변경 로그를 리스트 형태로 보여주는 컴포넌트

import axios from 'axios';
import { useEffect, useState } from 'react';

function ScoreLog({ userId }) {
  const [logs, setLogs] = useState([]); // 점수 로그 상태

  useEffect(() => {
    // ✅ 서버에서 점수 변경 로그 요청
    axios.get(`/api/scorelog/${userId}`)
      .then(res => setLogs(res.data))  // 성공 시 로그 저장
      .catch(() => setLogs([]));       // 실패 시 빈 배열로 초기화
  }, [userId]); // userId가 바뀔 때마다 재요청

  return (
    <div>
      <h3>최근 점수 변화</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            {/* 날짜 표시 (YYYY-MM-DD 형식) */}
            <span>{log.created_at?.slice(0, 10)}</span>

            {/* 점수 변경 사유 */}
            <span style={{ marginLeft: 8 }}>{log.reason}</span>

            {/* 점수 증감 (양수는 초록색, 음수는 빨간색으로 표시) */}
            <span style={{ marginLeft: 8, color: log.score_change > 0 ? 'green' : 'red' }}>
              {log.score_change > 0 ? `+${log.score_change}` : log.score_change}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScoreLog;
