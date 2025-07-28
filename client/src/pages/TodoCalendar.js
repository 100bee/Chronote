// client/src/pages/TodoCalendar.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/todoCalendar.scss';
import { formatDateKorean } from '../utils/dateUtils';

const TodoCalendar = ({ mode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const userId = 1;
  const dateKey = selectedDate.toISOString().split('T')[0];

  // 할 일 가져오기
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/todos?user_id=${userId}&date=${dateKey}`);
      const taskList = response.data.map(t => t.content);
      setTasks(taskList);
    } catch (err) {
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // 할 일 추가하기
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post('http://localhost:3001/api/todos', {
        user_id: userId,
        task: newTask,
        date: dateKey,
      });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      alert('할 일 추가 실패');
    }
  };

  return (
    <div className={`calendar-page ${mode === 'dark' ? 'darkmode' : 'lightmode'}`}>
      <div className="calendar-left">
        <h2>날짜별 할 일</h2>
        <div className="calendar-container">
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>
      </div>
      <div className="selected-date">
        <h3>{formatDateKorean(dateKey)}의 할 일</h3>
        <ul>
          {tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
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
