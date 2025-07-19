import axios from 'axios';
import { useState } from 'react';

const TaskItem = ({ todo, onRefresh }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [startTime, setStartTime] = useState(null);       // 현재 세션 시작 시간
  const [elapsedTime, setElapsedTime] = useState(0);      // 누적 시간

  const handleStart = async () => {
    try {
      await axios.patch(`http://localhost:3001/api/todos/${todo.id}/start`);
      setStartTime(Date.now());
      setIsStarted(true);
      setIsPaused(false);
    } catch (error) {
      console.error('시작 시간 기록 실패:', error);
      alert('시작 시간 기록 실패');
    }
  };

  const handlePause = () => {
    if (startTime) {
      const now = Date.now();
      const sessionTime = Math.floor((now - startTime) / 1000); // 초
      setElapsedTime(prev => prev + sessionTime);
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    setStartTime(Date.now());
    setIsPaused(false);
  };

  const handleComplete = async () => {
    const now = Date.now();
    const finalDuration = isPaused
      ? elapsedTime
      : elapsedTime + Math.floor((now - startTime) / 1000);

    try {
      await axios.patch(`http://localhost:3001/api/todos/${todo.id}/complete`);
      setElapsedTime(finalDuration);
      setIsCompleted(true);
      if (onRefresh) onRefresh(); // 새로고침 요청
    } catch (error) {
      console.error('완료 시간 기록 실패:', error);
      alert('완료 시간 기록 실패');
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}분 ${sec}초`;
  };

  const content = todo?.content || '작업 내용 없음';
  const displayTime = elapsedTime ?? todo?.duration ?? 0;

  return (
    <li className={`todo-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <span className="task-text">{content}</span>
        {isStarted && !isCompleted && !isPaused && (
          <span className="status"> (진행 중)</span>
        )}
        {isPaused && <span className="status"> (⏸ 일시 정지 중)</span>}
        {isCompleted && (
          <span className="status"> (완료됨, ⏱ {formatTime(displayTime)})</span>
        )}
      </div>

      <div className="task-actions">
        {!isStarted && !isCompleted && (
          <button className="task-button start" onClick={handleStart}>
            시작
          </button>
        )}
        {isStarted && !isPaused && !isCompleted && (
          <button className="task-button pause" onClick={handlePause}>
            일시정지
          </button>
        )}
        {isStarted && isPaused && !isCompleted && (
          <button className="task-button resume" onClick={handleResume}>
            재시작
          </button>
        )}
        {isStarted && !isCompleted && (
          <button className="task-button complete" onClick={handleComplete}>
            완료
          </button>
        )}
      </div>
    </li>
  );
};

export default TaskItem;
// src/components/TaskItem.js
// 이 컴포넌트는 각 할 일 항목을 표시하고, 시작, 일시 정지, 재시작, 완료 기능을 제공합니다.