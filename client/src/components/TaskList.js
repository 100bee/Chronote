// src/components/TaskList.js
// ✅ 할 일(todo) 목록을 렌더링하는 리스트 컴포넌트

import TaskItem from './TaskItem'; // 단일 할 일 아이템 컴포넌트

const TaskList = ({ todos, refreshTodos, onToggle, onDelete }) => {
  return (
    <ul className="todo-list"> {/* 할 일 전체 목록을 감싸는 <ul> */}
      {todos.map(todo => (
        <TaskItem
          key={todo.id}             // React의 고유 식별자용 key
          todo={todo}               // 개별 할 일 데이터 전달
          onToggle={onToggle}       // 완료 상태 토글 함수 (선택적)
          onDelete={onDelete}       // 삭제 함수
          refreshTodos={refreshTodos} // 완료/삭제 후 목록 새로고침 함수
        />
      ))}
    </ul>
  );
};

export default TaskList;
