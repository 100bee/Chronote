// client/src/pages/Main.js
// ✅ 메인 페이지
// 오늘의 할 일을 보여주고, 캘린더를 통해 날짜를 선택할 수 있으며,
// 사용자는 오늘의 할 일을 직접 추가할 수 있다.

import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/main.scss";

function Main({ mode }) {
  const todayKey = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD 형식)
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 상태
  const [todos, setTodos] = useState([]);        // 오늘의 할 일 목록 상태
  const [input, setInput] = useState("");        // 새 할 일 입력값 상태

  // ✅ 항상 Authorization 토큰 포함 (없으면 로그인 페이지로 리다이렉트)
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

  // ✅ 오늘의 할 일 목록 서버에서 가져오기
  const fetchTodos = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;
    try {
      const res = await axios.get(
        `http://localhost:3001/api/todos?date=${todayKey}`,
        authHeader
      );
      setTodos(res.data); // 가져온 할 일 목록 저장
    } catch {
      setTodos([]); // 실패 시 빈 배열 처리
    }
  };

  // ✅ 페이지 첫 렌더링 시 할 일 가져오기
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  // ✅ 새 할 일 추가
  const handleAdd = async () => {
    if (!input.trim()) return; // 공백 입력 방지
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/api/todos",
        { content: input, date: todayKey }, // 오늘 날짜 기준 추가
        authHeader
      );
      setTodos([...todos, res.data]); // 기존 목록에 새 항목 추가
      setInput(""); // 입력창 초기화
    } catch (err) {
      alert("할 일 추가 실패");
    }
  };

  return (
    <div className={`main-root ${mode === 'dark' ? 'darkmode' : 'lightmode'}`}>
      <div className="main-center-wrap">
        {/* ✅ 캘린더 영역 */}
        <div className="main-calendar-box">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            className="main-calendar"
          />
        </div>

        {/* ✅ 캘린더와 할 일 사이의 구분선 */}
        <div className="main-divider" />

        {/* ✅ 오늘의 할 일 입력/목록 영역 */}
        <div className="main-today-box">
          <h2 className="main-today-title">오늘의 할 일</h2>

          {/* ✅ 할 일 입력창 */}
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

          {/* ✅ 할 일 목록 렌더링 */}
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
