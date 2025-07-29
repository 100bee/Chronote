// client/src/pages/Main.js
import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/main.scss";

function Main({ mode }) {
  const todayKey = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // ✅ 항상 토큰을 헤더로 포함!
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 필요');
      window.location.href = '/login';
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ✅ 할 일 불러오기
  const fetchTodos = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;
    try {
      const res = await axios.get(
        `http://localhost:3001/api/todos?date=${todayKey}`,
        authHeader
      );
      setTodos(res.data);
    } catch {
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  // ✅ 할 일 추가하기
  const handleAdd = async () => {
    if (!input.trim()) return;
    const authHeader = getAuthHeader();
    if (!authHeader) return;
    try {
      const res = await axios.post(
        "http://localhost:3001/api/todos",
        { content: input, date: todayKey },
        authHeader
      );
      setTodos([...todos, res.data]);
      setInput("");
    } catch (err) {
      alert("할 일 추가 실패");
    }
  };

  return (
    <div className={`main-root ${mode === 'dark' ? 'darkmode' : 'lightmode'}`}>
      <div className="main-center-wrap">
        {/* 캘린더 */}
        <div className="main-calendar-box">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            className="main-calendar"
          />
        </div>
        {/* 주황색 구분선 */}
        <div className="main-divider" />
        {/* 오늘 할 일 박스 */}
        <div className="main-today-box">
          <h2 className="main-today-title">오늘의 할 일</h2>
          <div className="main-today-input-wrap">
            <input
              type="text"
              placeholder="새 할 일 입력"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="main-today-input"
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <button className="main-today-btn" onClick={handleAdd}>
              추가
            </button>
          </div>
          <ul className="main-today-list">
            {todos.length === 0
              ? <li className="main-today-empty">등록된 일정이 없습니다.</li>
              : todos.map((todo) => (
                <li
                  key={todo.id}
                  className={todo.is_completed ? "main-today-completed" : ""}
                >
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
