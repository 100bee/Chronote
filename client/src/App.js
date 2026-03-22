// src/App.js
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AiFeedback from './pages/AiFeedback';
import Analysis from './pages/Analysis';
import ChatRoomPage from './pages/ChatRoomPage';
import FirstPage from './pages/FirstPage';
import Group from './pages/Group';
import Login from './pages/Login';
import Main from './pages/Main';
import MatchingPage from './pages/MatchingPage';
import Rank from './pages/Rank';
import Signup from './pages/Signup';
import TodoCalendar from './pages/TodoCalendar';
import TodoDashboard from './pages/TodoDashboard';

function App() {
  const [mode, setMode] = useState('light');
  const location = useLocation();

  const toggleMode = () => setMode(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.body.className = mode === 'dark' ? 'darkmode' : 'lightmode';
  }, [mode]);

  const hideHeaderPaths = ['/', '/login', '/signup'];

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && (
        <Header mode={mode} toggleMode={toggleMode} />
      )}
      <Routes>
        {/* 공개 경로 */}
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 보호된 경로 */}
        <Route path="/main" element={<PrivateRoute><Main mode={mode} /></PrivateRoute>} />
        <Route path="/group" element={<Group />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomPage />} />

        {/* Layout 내부 보호된 경로 */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/todos" element={<TodoDashboard />} />
          <Route path="/calendar" element={<TodoCalendar mode={mode} />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/ai-feedback" element={<AiFeedback />} />  {/* ✅ 추가 */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
