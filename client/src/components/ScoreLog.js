// 📁 src/components/ScoreLog.js
import { useEffect, useState } from 'react';
import api from '../api/index';

function ScoreLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/api/scorelog')
      .then(res => setLogs(res.data))
      .catch(() => setLogs([]));
  }, []);

  if (logs.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10 }}>최근 점수 변화</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {logs.slice(0, 5).map((log, idx) => (
          <div key={idx} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '8px 12px',
            background: 'rgba(249,115,22,0.05)',
            borderRadius: 8, fontSize: '0.85rem'
          }}>
            <span style={{ color: '#78716c' }}>{log.created_at?.slice(0, 10)}</span>
            <span style={{ color: '#1c1917' }}>{log.reason}</span>
            <span style={{
              fontWeight: 700,
              color: log.score_change > 0 ? '#16a34a' : '#dc2626'
            }}>
              {log.score_change > 0 ? `+${log.score_change}` : log.score_change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScoreLog;
