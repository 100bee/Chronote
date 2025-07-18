import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/TodoList.scss';
import TaskList from '../components/TaskList';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  // For now, we'll hardcode the user_id. 
  // In a real app, you would get this from user authentication.
  const userId = 1; 

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/todos?user_id=${userId}`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [userId]);

  const handleAddTask = async () => {
    if (task.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:3001/api/todos', {
        user_id: userId,
        task: task,
      });
      setTodos([response.data, ...todos]);
      setTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleComplete = async (id, is_completed) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/todos/${id}`, {
        is_completed: !is_completed,
      });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>My Tasks</h1>
      </header>
      <div className="add-task-container">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button className="add-button" onClick={handleAddTask}>Add</button>
      </div>
      <TaskList todos={todos} onToggle={handleToggleComplete} onDelete={handleDeleteTodo} />
    </div>
  );
};

export default TodoList;
