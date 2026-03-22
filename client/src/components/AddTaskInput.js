// client/src/components/AddTaskInput.js

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // '+' 아이콘
import '../css/addtaskinput.scss'; // 스타일 파일 불러오기

// 할 일을 추가하는 입력창 컴포넌트
const AddTaskInput = ({ onAdd }) => {
  const [text, setText] = useState(''); // 입력된 텍스트 상태 관리

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작(새로고침) 방지
    console.log('Adding task:', text); // 디버깅용 로그
    if (text.trim()) { // 공백이 아닌 텍스트만 처리
      onAdd(text);     // 상위 컴포넌트로 입력된 텍스트 전달
      setText('');     // 입력창 초기화
    }
  };

  return (
    <div className="add-task-wrapper"> {/* 입력창 전체를 감싸는 컨테이너 */}
      <form className="add-task-container" onSubmit={handleSubmit}>
        <FaPlus className="plus-icon" /> {/* 추가 아이콘 */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)} // 입력 값 변경 시 상태 업데이트
          placeholder="작업 추가" // 입력창에 표시되는 기본 문구
        />
        <button type="submit" style={{ display: 'none' }}>추가</button> {/* Enter 키를 통한 제출용 버튼 (숨김 처리) */}
      </form>
    </div>
  );
};

export default AddTaskInput;
