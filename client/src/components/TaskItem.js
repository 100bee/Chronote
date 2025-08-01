// src/components/TaskItem.js
// ✅ 단일 할 일(todo)을 렌더링하고, 시작/일시정지/완료/삭제 등의 상태를 제어하는 컴포넌트

import axios from 'axios';
import { useEffect, useState } from 'react';

const TaskItem = ({ todo, refreshTodos, onToggle, onDelete }) => {
  const [isStarted, setIsStarted] = useState(false); // 타이머 시작 여부
  const [isPaused, setIsPaused] = useState(false);   // 일시정지 상태
  const [isCompleted, setIsCompleted] = useState(todo.is_completed || false); // 완료 여부

  const [startTime, setStartTime] = useState(null); // 시작 시간
  const [elapsedTime, setElapsedTime] = useState(todo.duration || 0); // 경과 시간(초 단위)

  // ✅ Authorization 헤더 (JWT 토큰 기반 인증)
  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ 페이지 새로고침 등으로 인해 진행 중 상태 복원
  useEffect(() => {
    if (todo.is_started && todo.start_time && !todo.is_completed) {
      const parsedTime = new Date(todo.start_time).getTime();
      setIsStarted(true);
      setStartTime(parsedTime);
    }
  }, [todo.is_started, todo.start_time, todo.is_completed]);

  // ✅ 타이머 작동 로직 (1초마다 경과 시간 갱신)
  useEffect(() => {
    let timer;
    if (isStarted && startTime && !isPaused && !isCompleted) {
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedTime(prev => prev + Math.floor((now - startTime) / 1000));
        setStartTime(now); // 기준 시간 갱신
      }, 1000);
    }
    return () => clearInterval(timer); // 언마운트 또는 조건 변화 시 인터벌 정리
  }, [isStarted, startTime, isPaused, isCompleted]);

  // ✅ 시작 버튼 클릭 시 실행
  const handleStart = async () => {
    try {
      await axios.patch(
        `http://localhost:3001/api/todos/${todo.id}/start`,
        {},
        authHeader
      );
      setStartTime(Date.now());
      setIsStarted(true);
      setIsPaused(false);
      if (refreshTodos) refreshTodos();
    } catch (error) {
      console.error('시작 시간 기록 실패:', error);
      alert('시작 시간 기록 실패');
    }
  };

  // ✅ 일시정지 버튼 클릭 시 실행
  const handlePause = () => {
    if (startTime) {
      const now = Date.now();
      const sessionTime = Math.floor((now - startTime) / 1000);
      setElapsedTime(prev => prev + sessionTime);
      setIsPaused(true);
    }
  };

  // ✅ 재시작 버튼 클릭 시 실행
  const handleResume = () => {
    setStartTime(Date.now());
    setIsPaused(false);
  };

  // ✅ 완료 버튼 클릭 시 실행
  const handleComplete = async () => {
    const now = Date.now();
    const finalDuration = isPaused
      ? elapsedTime
      : elapsedTime + Math.floor((now - startTime) / 1000);

    try {
      await axios.patch(
        `http://localhost:3001/api/todos/${todo.id}/complete`,
        { duration: finalDuration }, // 경과 시간 DB에 저장
        authHeader
      );
      setElapsedTime(finalDuration);
      setIsCompleted(true);
      setIsStarted(false);
      setIsPaused(false);
      if (refreshTodos) refreshTodos();
    } catch (error) {
      console.error('완료 시간 기록 실패:', error);
      alert('완료 시간 기록 실패');
    }
  };

  // ✅ 삭제 버튼 클릭 시 실행
  const handleDelete = async () => {
    if (!window.confirm('정말 이 할 일을 삭제하시겠습니까?')) return;
    try {
      if (onDelete) {
        await onDelete(todo.id); // 상위 컴포넌트가 삭제 처리할 경우
      } else {
        await axios.delete(
          `http://localhost:3001/api/todos/${todo.id}`,
          authHeader
        );
        if (refreshTodos) refreshTodos();
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 실패');
    }
  };

  // ✅ 경과 시간(초)을 "분 초" 포맷으로 변환
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}분 ${sec}초`;
  };

  const content = todo?.content || '작업 내용 없음';

  // ⭐️ 보여줄 시간: 완료되었으면 DB 저장된 duration, 아니면 현재까지 측정된 시간
  const displayTime = isCompleted
    ? todo.duration ?? 0
    : elapsedTime ?? todo.duration ?? 0;

  return (
    <li className={`todo-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <span className="task-text">{content}</span>
        {/* 상태별 메시지 */}
        {isStarted && !isCompleted && !isPaused && <span className="status"> (진행 중)</span>}
        {isPaused && <span className="status"> (⏸ 일시 정지 중)</span>}
        {isCompleted && <span className="status"> (완료됨, ⏱ {formatTime(displayTime)})</span>}
      </div>

      {/* 상태에 따라 버튼 보여주기 */}
      <div className="task-actions">
        {!isStarted && !isCompleted && (
          <button className="task-button start" onClick={handleStart}>시작</button>
        )}
        {isStarted && !isPaused && !isCompleted && (
          <button className="task-button pause" onClick={handlePause}>일시정지</button>
        )}
        {isStarted && isPaused && !isCompleted && (
          <button className="task-button resume" onClick={handleResume}>재시작</button>
        )}
        {isStarted && !isCompleted && (
          <button className="task-button complete" onClick={handleComplete}>완료</button>
        )}
        <button className="task-button delete" onClick={handleDelete}>삭제</button>
      </div>
    </li>
  );
};

export default TaskItem;
