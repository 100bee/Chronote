// src/components/TaskList.js
import TaskItem from './TaskItem';

const TaskList = ({ todos, refreshTodos, onToggle, onDelete }) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          refreshTodos={refreshTodos}
        />
      ))}
    </ul>
  );
};

export default TaskList;
