// 📁 src/components/ScoreChart.js
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/index';

function ScoreChart() {
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    api.get('/api/scorelog/daily')
      .then(res => setDaily(res.data))
      .catch(() => setDaily([]));
  }, []);

  if (daily.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10 }}>최근 7일 점수 변화</h3>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={daily}>
          <CartesianGrid stroke="#f0ede9" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="daily_score" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreChart;
