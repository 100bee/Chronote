import axios from 'axios';
import { useState } from 'react';

const TaskItem = ({ todo, refreshTodos, onToggle, onDelete }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.is_completed || false);

  // 서버에서 불러온 duration 값 유지
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(todo.duration || 0);

  // ✅ 공통 Authorization 헤더
  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ 타이머 시작
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

  // ✅ 일시정지
  const handlePause = () => {
    if (startTime) {
      const now = Date.now();
      const sessionTime = Math.floor((now - startTime) / 1000);
      setElapsedTime(prev => prev + sessionTime);
      setIsPaused(true);
    }
  };

  // ✅ 재시작
  const handleResume = () => {
    setStartTime(Date.now());
    setIsPaused(false);
  };

  // ✅ 완료
  const handleComplete = async () => {
    const now = Date.now();
    const finalDuration = isPaused
      ? elapsedTime
      : elapsedTime + Math.floor((now - startTime) / 1000);

    try {
      await axios.patch(
        `http://localhost:3001/api/todos/${todo.id}/complete`,
        { duration: finalDuration }, // duration DB로 전송!
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

  // ✅ 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말 이 할 일을 삭제하시겠습니까?')) return;
    try {
      if (onDelete) {
        await onDelete(todo.id);
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

  // ✅ 시간 표시
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}분 ${sec}초`;
  };

  const content = todo?.content || '작업 내용 없음';

  // ⭐️ 완료된 항목은 todo.duration을, 미완료는 elapsedTime을 표시!
  const displayTime = isCompleted
    ? todo.duration ?? 0
    : elapsedTime ?? todo.duration ?? 0;

  return (
    <li className={`todo-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <span className="task-text">{content}</span>
        {isStarted && !isCompleted && !isPaused && <span className="status"> (진행 중)</span>}
        {isPaused && <span className="status"> (⏸ 일시 정지 중)</span>}
        {isCompleted && <span className="status"> (완료됨, ⏱ {formatTime(displayTime)})</span>}
      </div>
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
