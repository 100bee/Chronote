// 📁 src/components/TaskItem.js

import { useEffect, useState } from 'react';

const TaskItem = ({ todo, onStart, onComplete, onDelete, refreshTodos }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted || false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(todo.duration || 0);

  useEffect(() => {
    if (todo.isStarted && todo.startTime && !todo.isCompleted) {
      setIsStarted(true);
      setStartTime(new Date(todo.startTime).getTime());
    }
  }, [todo.isStarted, todo.startTime, todo.isCompleted]);

  useEffect(() => {
    let timer;
    if (isStarted && startTime && !isPaused && !isCompleted) {
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedTime(prev => prev + Math.floor((now - startTime) / 1000));
        setStartTime(now);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, startTime, isPaused, isCompleted]);

  const handleStart = async () => {
    try {
      if (onStart) await onStart(todo.id);
      setStartTime(Date.now());
      setIsStarted(true);
      setIsPaused(false);
    } catch {
      alert('시작 실패');
    }
  };

  const handlePause = () => {
    if (startTime) {
      setElapsedTime(prev => prev + Math.floor((Date.now() - startTime) / 1000));
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    setStartTime(Date.now());
    setIsPaused(false);
  };

  const handleComplete = async () => {
    const finalDuration = isPaused
      ? elapsedTime
      : elapsedTime + Math.floor((Date.now() - startTime) / 1000);
    try {
      if (onComplete) await onComplete(todo.id, finalDuration);
      setElapsedTime(finalDuration);
      setIsCompleted(true);
      setIsStarted(false);
      setIsPaused(false);
      if (refreshTodos) refreshTodos();
    } catch {
      alert('완료 처리 실패');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      if (onDelete) await onDelete(todo.id);
    } catch {
      alert('삭제 실패');
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}분 ${sec}초`;
  };

  const displayTime = isCompleted
    ? (todo.duration ?? 0)
    : (elapsedTime ?? todo.duration ?? 0);

  return (
    <li className={`todo-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <span className="task-text">{todo.content || '작업 내용 없음'}</span>
        {isStarted && !isCompleted && !isPaused && (
          <span className="status">⏱ {formatTime(elapsedTime)}</span>
        )}
        {isPaused && <span className="status">⏸ 일시정지</span>}
        {isCompleted && <span className="status">✅ {formatTime(displayTime)}</span>}
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