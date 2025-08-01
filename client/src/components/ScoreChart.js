// client/src/components/ScoreChart.js
// ✅ 사용자 점수의 최근 7일 변화 추이를 선 그래프로 시각화하는 컴포넌트

import axios from 'axios';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'; // 📊 차트 구성 요소들

function ScoreChart({ userId }) {
  const [daily, setDaily] = useState([]); // 일별 점수 데이터 상태

  useEffect(() => {
    // ✅ 서버에서 사용자 일별 점수 데이터 불러오기
    axios.get(`/api/scorelog/daily/${userId}`)
      .then(res => setDaily(res.data)) // 응답 데이터로 상태 업데이트
      .catch(() => setDaily([]));      // 오류 발생 시 빈 배열로 초기화
  }, [userId]); // userId가 변경될 때마다 실행

  return (
    <div>
      <h3>최근 7일 점수 변화</h3>
      <LineChart width={300} height={150} data={daily}> {/* 선 그래프 */}
        <CartesianGrid stroke="#eee" /> {/* 배경 격자선 */}
        <XAxis dataKey="date" />         {/* x축: 날짜 */}
        <YAxis />                        {/* y축: 점수 */}
        <Tooltip />                      {/* 마우스 오버 시 상세 데이터 표시 */}
        <Line
          type="monotone"               // 선의 형태 지정
          dataKey="daily_score"         // y축에 사용할 데이터 키
          stroke="#82ca9d"              // 선 색상
        />
      </LineChart>
    </div>
  );
}

export default ScoreChart;
