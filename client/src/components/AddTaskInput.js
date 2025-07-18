// src/components/AddTaskInput.js
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../css/addtaskinput.scss';

const AddTaskInput = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
      </form>
    </div>
  );
};

export default AddTaskInput;
