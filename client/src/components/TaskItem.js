// src/components/TaskItem.js

const TaskItem = ({ todo, onStart, onComplete }) => {
  if (!todo) return null;

  const { id, task, is_started, is_completed, duration } = todo;

  return (
    <li className={`todo-item ${is_completed ? 'completed' : ''}`}>
      <div className="task-content">
        <span className="task-text">{task}</span>
        {is_started && !is_completed && <span className="status"> (진행 중)</span>}
        {is_completed && <span className="status"> (완료됨, ⏱ {duration}분)</span>}
      </div>
      <div className="task-actions">
        {!is_started && <button onClick={() => onStart(id)}>시작</button>}
        {is_started && !is_completed && <button onClick={() => onComplete(id)}>완료</button>}
      </div>
    </li>
  );
};

export default TaskItem; // ✅ 반드시 필요
