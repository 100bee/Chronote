// src/components/TodoHeader.js
import '../css/todoheader.scss';

const TodoHeader = ({ selected }) => {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });

  return (
    <div className="todo-header-box">
      <h1 className="todo-title">{selected}</h1>
      <p className="todo-date">{today}</p>
      <div className="focus-box">
        <p>오늘의 목표를 달성하세요.(미정)</p>
        <p>오늘도 화이팅 입니다.(미정)</p>
      </div>
    </div>
  );
};

export default TodoHeader;
