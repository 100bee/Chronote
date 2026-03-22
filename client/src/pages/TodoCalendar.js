// src/components/TodoCalendar.js
// ✅ 날짜별 할 일을 관리하는 달력 컴포넌트

import axios from 'axios';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/todoCalendar.scss';
import { formatDateKorean } from '../utils/dateUtils'; // YYYY-MM-DD → 한국식 날짜로 변환

const TodoCalendar = ({ mode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [tasks, setTasks] = useState([]);                        // 해당 날짜의 할 일 목록
  const [newTask, setNewTask] = useState('');                    // 새 할 일 입력값
  const dateKey = selectedDate.toISOString().split('T')[0];      // YYYY-MM-DD 포맷

  // ✅ 선택된 날짜의 할 일 불러오기
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3001/api/todos?date=${dateKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const taskList = response.data.map(t => t.content); // content만 추출
      setTasks(taskList);
    } catch (err) {
      console.error('❌ 할 일 가져오기 실패:', err);
      setTasks([]); // 오류 시 빈 목록
    }
  };

  // ✅ 날짜 선택 시마다 할 일 다시 불러오기
  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // ✅ 새 할 일 추가
  const handleAddTask = async () => {
    if (!newTask.trim()) return; // 빈 입력 방지
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/api/todos',
        {
          content: newTask,
          date: dateKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTask('');  // 입력창 초기화
      fetchTasks();    // 다시 불러오기
    } catch (err) {
      alert('할 일 추가 실패');
      console.error('❌ 할 일 추가 실패:', err);
    }
  };

  return (
    <div className={`calendar-page ${mode === 'dark' ? 'darkmode' : 'lightmode'}`}>
      {/* 왼쪽: 달력 */}
      <div className="calendar-left">
        <h2>날짜별 할 일</h2>
        <div className="calendar-container">
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>
      </div>

      {/* 오른쪽: 선택한 날짜의 할 일 목록 및 추가 */}
      <div className="selected-date">
        <h3>{formatDateKorean(dateKey)}의 할 일</h3>
        <ul>
          {tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>

        {/* 새 할 일 추가 섹션 */}
        <div className="add-task-section">
          <input
            type="text"
            placeholder="새 할 일 입력"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
          />
          <button onClick={handleAddTask}>할 일 추가</button>
        </div>
      </div>
    </div>
  );
};

export default TodoCalendar;
