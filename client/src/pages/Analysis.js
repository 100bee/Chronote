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
