// src/pages/TodoDashboard.js

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AddTaskInput from '../components/AddTaskInput';
import TaskList from '../components/TaskList';
import TodoHeader from '../components/TodoHeader';
import '../css/addtaskinput.scss';
import '../css/dashboard.scss';

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [selectedList, setSelectedList] = useState('오늘 할 일');

  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ 오늘 날짜 (YYYY-MM-DD)
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  // ✅ 오늘 할 일만 서버에서 받아오기
  const fetchTodos = useCallback(async () => {
    try {
      // 서버에 오늘 날짜만 쿼리
      const response = await axios.get(
        `http://localhost:3001/api/todos?date=${todayKey}`,
        authHeader
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [token, todayKey]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ✅ 완료 토글 처리 (서버 라우터에 맞게 수정 필요시 반영)
  const handleToggle = async (id, is_completed) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/todos/${id}`,
        { is_completed: !is_completed },
        authHeader
      );
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // ✅ 삭제 처리
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`, authHeader);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // ✅ 새로운 작업 추가 (오늘 날짜로 저장)
  const handleAddTask = async (newTaskContent) => {
    try {
      const dateString = todayKey; // 'YYYY-MM-DD'만 전달
      console.log('[📩 새 작업 추가 요청]', newTaskContent);

      const response = await axios.post(
        'http://localhost:3001/api/todos',
        {
          content: newTaskContent,
          date: dateString,
        },
        authHeader
      );

      console.log('[✅ 추가 완료]', response.data);
      setTodos(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error);
    }
  };

  // ✅ 새로고침용 (오늘만)
  const refreshTodos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/todos?date=${todayKey}`,
        authHeader
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <div className="main-area">
      <TodoHeader selected={selectedList} />
      <TaskList todos={todos} refreshTodos={refreshTodos} />
      <AddTaskInput onAdd={handleAddTask} />
    </div>
  );
};

export default TodoDashboard;
