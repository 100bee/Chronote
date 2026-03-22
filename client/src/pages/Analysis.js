// src/pages/Analysis.js
// ✅ 오늘 날짜 기준 할 일(todos)을 불러와서 도넛 차트와 막대 그래프로 분석하는 페이지

import axios from 'axios';
import { useEffect, useState } from 'react';
import TodoBarChart from '../components/TodoBarChart'; // 과목별 시간 막대 차트
import TodoDonutChart from '../components/TodoDonutChart'; // 과목별 시간 도넛 차트

const Analysis = () => {
  const [todos, setTodos] = useState([]); // 오늘의 할 일 목록 상태

  // ✅ 오늘 날짜 (예: 2025-08-01)
  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');

    // ✅ 서버에서 오늘의 할 일 목록을 가져옴 (JWT 토큰 포함)
    axios.get(`http://localhost:3001/api/todos?date=${todayKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setTodos(res.data))     // 성공 시 상태 업데이트
      .catch((err) => {
        console.error('📛 분석 페이지 투두 불러오기 실패:', err);
        setTodos([]); // 실패 시 빈 배열
      });
  }, [todayKey]);

  return (
    <div style={{ padding: '20px', color: 'white', minHeight: '100vh' }}>
      <h1>분석 페이지</h1>

      {/* ✅ 도넛 차트 + 막대 차트 나란히 배치 */}
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* 도넛 차트 영역 */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>도넛 차트</h2>
          {/* ✅ 반드시 고정 height를 가진 div로 감싸기 */}
          <div style={{ width: '100%', height: 300, minWidth: 250 }}>
            <TodoDonutChart todos={todos} /> {/* 과목별 비율 시각화 */}
          </div>
        </div>

        {/* 막대 차트 영역 */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>막대 그래프</h2>
          {/* ✅ 반드시 고정 height를 가진 div로 감싸기 */}
          <div style={{ width: '100%', height: 300, minWidth: 250 }}>
            <TodoBarChart todos={todos} /> {/* 과목별 시간량 시각화 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
