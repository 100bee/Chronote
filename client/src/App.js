// client/src/App.js
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Layout from './components/Layout';

import Analysis from './pages/Analysis';
import FirstPage from './pages/FirstPage';
import Group from './pages/Group';
import Login from './pages/Login';
import Main from './pages/Main';
import Rank from './pages/Rank';
import Signup from './pages/Signup';
import TodoCalendar from './pages/TodoCalendar';
import TodoDashboard from './pages/TodoDashboard';

<<<<<<< HEAD
// ✅ 추가: 채팅 관련 페이지
import ChatRoomPage from './pages/ChatRoomPage';
import MatchingPage from './pages/MatchingPage';

function App() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [mode, setMode] = useState('light');

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

=======
function App() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [mode, setMode] = useState('light'); // 다크/라이트 상태 관리

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // ✅ 다크모드 클래스 body에 적용
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
  useEffect(() => {
    document.body.className = mode === 'dark' ? 'darkmode' : 'lightmode';
  }, [mode]);

  return (
    <>
      <Header mode={mode} toggleMode={toggleMode} />
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main mode={mode} />} />
        <Route path="/group" element={<Group />} />
        <Route path="/rank" element={<Rank />} />
<<<<<<< HEAD

        {/* ✅ 추가된 경로들 */}
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomPage />} />

=======
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
        <Route element={<Layout />}>
          <Route
            path="/todos"
            element={
              <TodoDashboard
                tasksByDate={tasksByDate}
                setTasksByDate={setTasksByDate}
                mode={mode}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <TodoCalendar
                tasksByDate={tasksByDate}
                setTasksByDate={setTasksByDate}
                mode={mode}
              />
            }
          />
          <Route
            path="/analysis"
            element={
              <Analysis
                tasksByDate={tasksByDate}
                mode={mode}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
