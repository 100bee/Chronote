// 📁 src/components/TaskList.js

import TaskItem from './TaskItem';

const TaskList = ({ todos, refreshTodos, onStart, onComplete, onDelete }) => {
  return (
    <ul className="todo-list">
      {todos.length === 0 ? (
        <li style={{
          textAlign: 'center', padding: '40px',
          color: '#a8a29e', fontSize: '0.9rem',
          border: '1.5px dashed #e8e4df', borderRadius: 12,
          listStyle: 'none'
        }}>
          오늘의 할 일을 추가해보세요! ✍️
        </li>
      ) : todos.map(todo => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onStart={onStart}
          onComplete={onComplete}
          onDelete={onDelete}
          refreshTodos={refreshTodos}
        />
      ))}
    </ul>
  );
};

export default TaskList;