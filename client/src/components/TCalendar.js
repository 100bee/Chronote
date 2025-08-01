// client/src/pages/TCalendar.js
// ✅ 날짜별 할 일을 기록하고 모달로 편집 가능한 간단한 캘린더 페이지

import { useState } from 'react';
import CalendarLib from 'react-calendar'; // 외부 캘린더 라이브러리
import 'react-calendar/dist/Calendar.css'; // 기본 스타일
import '../css/TCalendar.scss'; // 커스텀 스타일

function TCalendar({ mode }) {
  const [value, setValue] = useState(new Date());        // 현재 선택된 날짜
  const [todos, setTodos] = useState({});                // 날짜별 할 일 저장 (객체로 관리)
  const [showModal, setShowModal] = useState(false);     // 모달 표시 여부
  const [selectedDate, setSelectedDate] = useState(null); // 현재 모달에서 편집 중인 날짜
  const [inputValue, setInputValue] = useState('');       // 텍스트 입력값

  // ✅ 날짜 클릭 시 모달 열기
  const handleDateClick = (date) => {
    setValue(date); // 캘린더에 표시되는 날짜 설정
    setSelectedDate(date); // 모달에서 사용할 날짜 설정
    setInputValue(todos[date.toDateString()] || ''); // 해당 날짜의 할 일을 불러옴
    setShowModal(true); // 모달 열기
  };

  // ✅ 저장 버튼 클릭 시 입력값 저장
  const handleSave = () => {
    setTodos({
      ...todos,
      [selectedDate.toDateString()]: inputValue
    });
    setShowModal(false); // 모달 닫기
  };

  return (
    <div className={`calendar-page ${mode === 'dark' ? 'darkmode' : ''}`}> {/* 다크모드 적용 */}
      <div className="calendar-left">
        {/* ✅ 캘린더 본체 */}
        <div className="custom-calendar">
          <CalendarLib
            onClickDay={handleDateClick}  // 날짜 클릭 시 모달 오픈
            value={value}                 // 현재 선택된 날짜
            formatDay={(locale, date) => (
              <span className="tile-number">{date.getDate()}</span> // 날짜 숫자만 표시
            )}
            tileClassName={({ date }) =>
              todos[date.toDateString()] ? 'has-todo' : null // 할 일 있는 날짜에 표시
            }
          />
        </div>

        {/* ✅ 할 일 입력 모달 */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{selectedDate?.toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
              })}</h3>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} // 입력값 실시간 반영
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

      {/* ✅ 오른쪽 영역: 오늘의 할 일 */}
      <div className="calendar-right">
        <h2>오늘의 할 일</h2>
        <ul>
          {todos[new Date().toDateString()]
            ? <li>{todos[new Date().toDateString()]}</li> // 오늘 할 일이 있으면 표시
            : <li>등록된 일정이 없습니다.</li>           // 없으면 안내 문구
          }
        </ul>
      </div>
    </div>
  );
}

export default TCalendar;
