import axios from 'axios';
import { useEffect, useState } from 'react';
import AddTaskInput from '../components/AddTaskInput';
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

  const handleAddTask = async (newTaskContent) => {
    try {
      const response = await axios.post('http://localhost:3001/api/todos', {
        user_id: userId,
        task: newTaskContent,
        date: new Date().toISOString().split('T')[0],
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // ⬇️ "시작"/"완료"시 리스트를 다시 불러오고 싶다면 아래 함수를 내려주세요
  const refreshTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/todos?user_id=${userId}`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <div className="main-area">
      <TodoHeader selected={selectedList} />
      <TaskList
        todos={todos}
        refreshTodos={refreshTodos}
      />
      <AddTaskInput onAdd={handleAddTask} />
    </div>
  );
};

export default TodoDashboard;
