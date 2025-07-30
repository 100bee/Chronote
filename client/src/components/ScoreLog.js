// client/src/components/ScoreLog.js
import axios from 'axios';
import { useEffect, useState } from 'react';

function ScoreLog({ userId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`/api/scorelog/${userId}`)
      .then(res => setLogs(res.data))
      .catch(() => setLogs([]));
  }, [userId]);

  return (
    <div>
      <h3>최근 점수 변화</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <span>{log.created_at?.slice(0, 10)}</span>
            <span style={{ marginLeft: 8 }}>{log.reason}</span>
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
