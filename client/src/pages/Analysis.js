// src/pages/Analysis.js
import { useEffect, useState } from 'react';
import { getTodos } from '../api/todos';
import { getTodayKey } from '../utils/dateUtils';
import TodoBarChart from '../components/TodoBarChart';
import TodoDonutChart from '../components/TodoDonutChart';

const Analysis = () => {
  const [todos, setTodos] = useState([]);
  const todayKey = getTodayKey();

  useEffect(() => {
    getTodos(todayKey)
      .then(res => setTodos(res.data))
      .catch(() => setTodos([]));
  }, [todayKey]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h1>분석 페이지</h1>
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>도넛 차트</h2>
          <div style={{ width: '100%', height: 300, minWidth: 250 }}>
            <TodoDonutChart todos={todos} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>막대 그래프</h2>
          <div style={{ width: '100%', height: 300, minWidth: 250 }}>
            <TodoBarChart todos={todos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
