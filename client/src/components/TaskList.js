import TaskItem from './TaskItem';

const TaskList = ({ todos, refreshTodos }) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TaskItem
          key={todo.id}
          todo={todo}
          refreshTodos={refreshTodos}
        />
      ))}
    </ul>
  );
};

export default TaskList;
