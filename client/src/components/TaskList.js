// src/components/TaskList.js
import TaskItem from './TaskItem';

const TaskList = ({ todos, onStart, onComplete }) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onStart={onStart}
          onComplete={onComplete}
        />
      ))}
    </ul>
  );
};

export default TaskList;
