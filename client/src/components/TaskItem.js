import { useState } from 'react';

const TaskItem = ({ todo }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);

  const handleStart = () => {
    setStartTime(Date.now());
    setIsStarted(true);
  };

  const handleComplete = () => {
    const endTime = Date.now();
    const diff = Math.floor((endTime - startTime) / 1000);
    setElapsedTime(diff);
    setIsCompleted(true);
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
        {isStarted && !isCompleted && (
          <span className="status"> (진행 중)</span>
        )}
        {isCompleted && (
          <span className="status">
            (완료됨, ⏱ {formatTime(displayTime)})
          </span>
        )}
      </div>
      <div className="task-actions">
        {!isStarted && !isCompleted && (
          <button className="task-button start" onClick={handleStart}>
            시작
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
