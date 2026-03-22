// src/pages/TodoDashboard.js
// ✅ 오늘의 할 일을 보여주는 투두 대시보드 페이지

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AddTaskInput from '../components/AddTaskInput'; // 입력창 컴포넌트
import TaskList from '../components/TaskList'; // 할 일 목록 컴포넌트
import TodoHeader from '../components/TodoHeader'; // 상단 제목 영역
import '../css/addtaskinput.scss';
import '../css/dashboard.scss';

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);                  // 할 일 목록
  const [selectedList, setSelectedList] = useState('오늘 할 일'); // 선택된 탭 (추후 확장 가능)

  // ✅ 토큰 설정
  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ 오늘 날짜 (형식: YYYY-MM-DD)
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  // ✅ 오늘 날짜의 할 일 목록 불러오기
  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/todos?date=${todayKey}`,
        authHeader
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [token, todayKey]);

  // ✅ 페이지 렌더 시 할 일 로드
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ✅ 할 일 완료 여부 토글
  const handleToggle = async (id, is_completed) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/todos/${id}`,
        { is_completed: !is_completed }, // 완료 여부 반전
        authHeader
      );
      // 상태 업데이트 (해당 id만 반영)
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // ✅ 할 일 삭제
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`, authHeader);
      // 삭제된 항목 제외하고 상태 업데이트
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // ✅ 새 할 일 추가 (날짜는 오늘 기준)
  const handleAddTask = async (newTaskContent) => {
    if (!newTaskContent.trim()) return;
    try {
      const response = await axios.post(
        'http://localhost:3001/api/todos',
        {
          content: newTaskContent,
          date: todayKey,
        },
        authHeader
      );
      setTodos(prev => [...prev, response.data]); // 새 항목 추가
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error);
    }
  };

  // ✅ 강제 새로고침 (오늘 날짜 기준)
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
      <TaskList
        todos={todos}
        refreshTodos={refreshTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      <AddTaskInput onAdd={handleAddTask} />
    </div>
  );
};

export default TodoDashboard;
