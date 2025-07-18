// src/pages/TodoDashboard.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddTaskInput from '../components/AddTaskInput'; // ✅ 추가
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import TodoHeader from '../components/TodoHeader';
import '../css/addtaskinput.scss';
import '../css/dashboard.scss';

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [selectedList, setSelectedList] = useState('오늘 할 일');
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
  }, []);

  const handleToggle = async (id, is_completed) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/todos/${id}`, {
        is_completed: !is_completed
      });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // ✅ 할 일 추가 함수
  const handleAddTask = async (newTaskContent) => {
    try {
      const response = await axios.post('http://localhost:3001/api/todos', {
        user_id: userId,
        content: newTaskContent,
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar selected={selectedList} setSelected={setSelectedList} />
      <main className="main-area">
        <TodoHeader selected={selectedList} />
        <TaskList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
        <AddTaskInput onAdd={handleAddTask} /> {/* ✅ 하단 입력창 */}
      </main>
    </div>
  );
};

export default TodoDashboard;
