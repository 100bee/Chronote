// src/pages/TodoDashboard.js
import { useCallback, useEffect, useState } from 'react';
import { getTodos, addTodo, startTodo, completeTodo, deleteTodo } from '../api/todos';
import { getTodayKey } from '../utils/dateUtils';
import AddTaskInput from '../components/AddTaskInput';
import TaskList from '../components/TaskList';
import TodoHeader from '../components/TodoHeader';
import '../css/addtaskinput.scss';
import '../css/dashboard.scss';

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [selectedList] = useState('오늘 할 일');
  const todayKey = getTodayKey();

  const fetchTodos = useCallback(async () => {
    try {
      const res = await getTodos(todayKey);
      setTodos(res.data);
    } catch (err) {
      console.error('할 일 불러오기 실패:', err);
    }
  }, [todayKey]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const handleAddTask = async (content) => {
    if (!content.trim()) return;
    try {
      const res = await addTodo(content, todayKey);
      setTodos(prev => [...prev, res.data]);
    } catch (err) {
      console.error('할 일 추가 실패:', err);
    }
  };

  const handleStart = async (id) => {
    try {
      await startTodo(id);
      fetchTodos();
    } catch (err) {
      console.error('시작 실패:', err);
    }
  };

  const handleComplete = async (id, duration) => {
    try {
      await completeTodo(id, duration);
      fetchTodos();
    } catch (err) {
      console.error('완료 실패:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <div className="main-area">
      <TodoHeader selected={selectedList} />
      <TaskList
        todos={todos}
        refreshTodos={fetchTodos}
        onStart={handleStart}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
      <AddTaskInput onAdd={handleAddTask} />
    </div>
  );
};

export default TodoDashboard;
