// src/pages/Main.js
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTodos, addTodo } from '../api/todos';
import { getTodayKey } from '../utils/dateUtils';
import '../css/main.scss';

function Main({ mode }) {
  const todayKey = getTodayKey();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await getTodos(todayKey);
      setTodos(res.data);
    } catch {
      setTodos([]);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      const res = await addTodo(input, todayKey);
      setTodos([...todos, res.data]);
      setInput('');
    } catch {
      alert('할 일 추가 실패');
    }
  };

  return (
    <div className={`main-root ${mode === 'dark' ? 'darkmode' : 'lightmode'}`}>
      <div className="main-center-wrap">
        <div className="main-calendar-box">
          <Calendar value={selectedDate} onChange={setSelectedDate} className="main-calendar" />
        </div>
        <div className="main-divider" />
        <div className="main-today-box">
          <h2 className="main-today-title">오늘의 할 일</h2>
          <div className="main-today-input-wrap">
            <input
              type="text"
              placeholder="새 할 일 입력"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="main-today-input"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button className="main-today-btn" onClick={handleAdd}>추가</button>
          </div>
          <ul className="main-today-list">
            {todos.length === 0
              ? <li className="main-today-empty">등록된 일정이 없습니다.</li>
              : todos.map(todo => (
                <li key={todo.id} className={todo.isCompleted ? 'main-today-completed' : ''}>
                  {todo.content}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Main;
