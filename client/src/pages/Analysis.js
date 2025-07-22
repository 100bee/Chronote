// src/pages/Analysis.js
// 분석 페이지
// 이 페이지는 사용자가 자신의 투두 데이터를 분석할 수 있는 기능을 제공합니다.
// 사용자는 도넛 차트와 막대 그래프를 통해 투두의 상태를 시각적으로 확인할 수 있습니다.
// 투두 데이터는 API를 통해 불러오며, 각 차트는 투두의 완료 상태와 날짜별로 분류된 정보를 시각화합니다.
import axios from 'axios';
import { useEffect, useState } from 'react';
import TodoBarChart from '../components/TodoBarChart';
import TodoDonutChart from '../components/TodoDonutChart';

const Analysis = () => {
  const [todos, setTodos] = useState([]);
  const userId = 1; // 실제로는 로그인 유저 id로 대체

  useEffect(() => {
    axios.get(`http://localhost:3001/api/todos?user_id=${userId}`)
      .then(res => setTodos(res.data))
      .catch(() => setTodos([]));
  }, []);

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>분석 페이지</h1>
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
        <div style={{ flex: 1 }}>
          <h2>도넛 차트</h2>
          <TodoDonutChart todos={todos} />
        </div>
        <div style={{ flex: 1 }}>
          <h2>막대 그래프</h2>
          <TodoBarChart todos={todos} />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
