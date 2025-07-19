import { useState } from 'react';
import TodoDonutChart from '../components/TodoDonutChart';

const Analysis = ({ tasksByDate }) => {
  const [selectedDate] = useState(new Date()); // 오늘 날짜 고정

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>분석 페이지</h1>
      <TodoDonutChart tasksByDate={tasksByDate} selectedDate={selectedDate} />
    </div>
  );
};

export default Analysis;
