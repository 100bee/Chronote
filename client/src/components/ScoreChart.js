// client/src/components/ScoreChart.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

function ScoreChart({ userId }) {
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    axios.get(`/api/scorelog/daily/${userId}`)
      .then(res => setDaily(res.data))
      .catch(() => setDaily([]));
  }, [userId]);

  return (
    <div>
      <h3>최근 7일 점수 변화</h3>
      <LineChart width={300} height={150} data={daily}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="daily_score" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
export default ScoreChart;
