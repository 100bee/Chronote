import { useState } from 'react';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/TCalendar.scss';

function TCalendar() {
  const [value, setValue] = useState(new Date());
  const [todos, setTodos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleDateClick = (date) => {
    setValue(date);
    setSelectedDate(date);
    setInputValue(todos[date.toDateString()] || '');
    setShowModal(true);
  };

  const handleSave = () => {
    setTodos({
      ...todos,
      [selectedDate.toDateString()]: inputValue
    });
    setShowModal(false);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-left">
        <CalendarLib
          onClickDay={handleDateClick}
          value={value}
          formatDay={(locale, date) => (
            <span className="tile-number">{date.getDate()}</span>
          )}
          tileClassName={({ date }) =>
            todos[date.toDateString()] ? 'has-todo' : null
          }
        />

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{selectedDate?.toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
              })}</h3>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="할 일을 입력하세요"
                rows={4}
              />
              <div className="button-group">
                <button onClick={handleSave}>저장</button>
                <button onClick={() => setShowModal(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="calendar-right">
        <h2>오늘의 할 일</h2>
        <ul>
          {todos[new Date().toDateString()]
            ? <li>{todos[new Date().toDateString()]}</li>
            : <li>등록된 일정이 없습니다.</li>}
        </ul>
      </div>
    </div>
  );
}

export default TCalendar;
