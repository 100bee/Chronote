// src/components/TodoHeader.js
// ✅ 할 일 페이지의 상단 영역: 날짜, 제목, 명언을 표시하는 헤더 컴포넌트

import { useEffect, useState } from 'react';
import '../css/todoheader.scss';
import QuoteBox from './QuoteBox'; // 랜덤 명언 컴포넌트

const TodoHeader = ({ selected }) => {
  // ✅ 오늘 날짜를 한글 형식으로 저장 (예: 2025년 8월 1일 금요일)
  const [today, setToday] = useState(
    new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  );

  useEffect(() => {
    // ✅ 1분마다 날짜 갱신 (자정 넘어가면 자동 업데이트용)
    const interval = setInterval(() => {
      const now = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      setToday(now);
    }, 60000);

    // ✅ 컴포넌트 언마운트 시 타이머 해제
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="todo-header-box">
      {/* ✅ 현재 선택된 페이지 제목 (예: 오늘 할 일, 분석 등) */}
      <h1 className="todo-title">{selected}</h1>

      {/* ✅ 오늘 날짜 표시 */}
      <p className="todo-date">{today}</p>

      {/* ✅ 랜덤 동기부여 명언 박스 */}
      <div className="focus-box">
        <QuoteBox />
      </div>
    </div>
  );
};

export default TodoHeader;
