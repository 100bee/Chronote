// client/src/App.js
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

import Analysis from './pages/Analysis';
import FirstPage from './pages/FirstPage';
import Group from './pages/Group';
import Login from './pages/Login';
import Main from './pages/Main';
import Rank from './pages/Rank';
import Signup from './pages/Signup';
import TodoCalendar from './pages/TodoCalendar';
import TodoDashboard from './pages/TodoDashboard';

import ChatRoomPage from './pages/ChatRoomPage';
import MatchingPage from './pages/MatchingPage';

import axios from 'axios';

function App() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [mode, setMode] = useState('light');
  const location = useLocation();

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // ✅ 다크모드 클래스 적용
  useEffect(() => {
    document.body.className = mode === 'dark' ? 'darkmode' : 'lightmode';
  }, [mode]);

  // ✅ JWT 만료 시 자동 로그아웃 인터셉터(최초 1회만 등록)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
    // 언마운트 시 인터셉터 해제(메모리 누수 방지)
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ✅ 헤더 숨길 경로
  const hideHeaderPaths = ['/', '/login', '/signup'];

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header mode={mode} toggleMode={toggleMode} />}

      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ 로그인된 사용자만 접근 가능 */}
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main mode={mode} />
            </PrivateRoute>
          }
        />

        <Route path="/group" element={<Group />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomPage />} />

        {/* ✅ Layout 내부 보호된 경로 */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
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
            element={<Analysis tasksByDate={tasksByDate} mode={mode} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
