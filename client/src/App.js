import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Analysis from './pages/Analysis'; // ✅ 분석 페이지 import
import FirstPage from './pages/FirstPage';
import Login from './pages/Login';
import Main from './pages/Main';
import Signup from './pages/Signup';
import TodoCalendar from './pages/TodoCalendar';
import TodoDashboard from './pages/TodoDashboard';

function App() {
  const [tasksByDate, setTasksByDate] = useState({});

  return (
    <Routes>
      {/* 로그인, 회원가입, 첫 화면은 Layout 없이 */}
      <Route path="/" element={<FirstPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />} />

      {/* ✅ Sidebar 포함되는 공통 Layout 내부 라우팅 */}
      <Route element={<Layout />}>
        <Route
          path="/todos"
          element={
            <TodoDashboard
              tasksByDate={tasksByDate}
              setTasksByDate={setTasksByDate}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <TodoCalendar
              tasksByDate={tasksByDate}
              setTasksByDate={setTasksByDate}
            />
          }
        />
        <Route
          path="/analysis"
          element={
            <Analysis
              tasksByDate={tasksByDate}
            />
          }
        /> {/* ✅ 분석 페이지를 TodoDonutChart → Analysis로 변경 */}
      </Route>
    </Routes>
  );
}

export default App;
