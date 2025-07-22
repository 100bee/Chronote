import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../css/addtaskinput.scss';

const AddTaskInput = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding task:', text); // 이 로그가 반드시 떠야 함!
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <div className="add-task-wrapper">
      <form className="add-task-container" onSubmit={handleSubmit}>
        <FaPlus className="plus-icon" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="작업 추가"
        />
        <button type="submit" style={{display:'none'}}>추가</button>
      </form>
    </div>
  );
};

export default AddTaskInput;
