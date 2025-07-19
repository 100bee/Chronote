// src/components/TodoHeader.js
import { useEffect, useState } from 'react';
import '../css/todoheader.scss';
import QuoteBox from './QuoteBox'; // 랜덤 명언 컴포넌트

const TodoHeader = ({ selected }) => {
  const [today, setToday] = useState(
    new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      setToday(now);
    }, 60000); // 1분마다 확인 (자정 넘어가면 자동 반영)

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div className="todo-header-box">
      <h1 className="todo-title">{selected}</h1>
      <p className="todo-date">{today}</p>
      <div className="focus-box">
        <QuoteBox /> {/* 랜덤 명언 표시 */}
      </div>
    </div>
  );
};

export default TodoHeader;
