// src/pages/Analysis.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import TodoBarChart from '../components/TodoBarChart';
import TodoDonutChart from '../components/TodoDonutChart';

const Analysis = () => {
  const [todos, setTodos] = useState([]);

  // 오늘 날짜(YYYY-MM-DD)
  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:3001/api/todos?date=${todayKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setTodos(res.data))
      .catch((err) => {
        console.error('📛 분석 페이지 투두 불러오기 실패:', err);
        setTodos([]);
      });
  }, [todayKey]);

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
