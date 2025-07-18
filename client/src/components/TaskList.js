// src/components/TaskList.js
import TaskItem from './TaskItem';

const TaskList = ({ todos }) => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TaskItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TaskList;
