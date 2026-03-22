// src/pages/TodoList.js
// ✅ 투두 리스트 페이지
// 사용자는 할 일을 추가, 완료 여부 토글, 삭제할 수 있음
// 서버 API를 통해 데이터를 CRUD 방식으로 관리

import axios from 'axios';
import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList'; // 재사용 가능한 할 일 목록 컴포넌트
import '../css/TodoList.scss'; // 전용 스타일

const TodoList = () => {
  const [todos, setTodos] = useState([]);  // 전체 할 일 목록
  const [task, setTask] = useState('');    // 새로 추가할 작업 내용

  // ⚠️ 현재는 user_id를 하드코딩함. 실제 서비스에서는 토큰 또는 context로 대체해야 함
  const userId = 1;

  // ✅ 페이지 최초 로드 시 서버에서 투두 리스트 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/todos?user_id=${userId}`);
        setTodos(response.data);
      } catch (error) {
        console.error('할 일 불러오기 실패:', error);
      }
    };

    fetchTodos();
  }, [userId]);

  // ✅ 새 작업 추가
  const handleAddTask = async () => {
    if (task.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:8080/api/todos', {
        user_id: userId,
        content: task, // ⚠️ 서버가 'task' 대신 'content'를 요구할 수 있음
      });
      setTodos([response.data, ...todos]); // 새 작업을 맨 앞에 추가
      setTask(''); // 입력 필드 초기화
    } catch (error) {
      console.error('할 일 추가 실패:', error);
    }
  };

  // ✅ 완료 여부 토글
  const handleToggleComplete = async (id, is_completed) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/todos/${id}`, {
        is_completed: !is_completed,
      });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('할 일 완료 상태 업데이트 실패:', error);
    }
  };

  // ✅ 작업 삭제
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('할 일 삭제 실패:', error);
    }
  };

  return (
    <div className="todo-container">
      {/* 상단 헤더 */}
      <header className="todo-header">
        <h1>My Tasks</h1>
      </header>

      {/* 새 작업 입력 영역 */}
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

      {/* 할 일 목록 출력 */}
      <TaskList
        todos={todos}
        onToggle={handleToggleComplete}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};

export default TodoList;
