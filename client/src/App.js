// client/src/App.js
// ✅ Chronote 앱의 루트 컴포넌트
// 주요 역할:
// - 라우팅 정의
// - 헤더 표시/숨김 처리
// - 다크모드 토글 기능
// - JWT 만료 시 자동 로그아웃 처리

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// ✅ 공통 컴포넌트
import Header from './components/Header';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// ✅ 페이지 컴포넌트
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
  // ✅ 날짜별 할 일 상태 저장
  const [tasksByDate, setTasksByDate] = useState({});

  // ✅ 라이트/다크 모드 상태
  const [mode, setMode] = useState('light');

  // ✅ 현재 URL 경로
  const location = useLocation();

  // ✅ 다크모드 토글 함수
  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // ✅ 다크모드 class를 body에 적용
  useEffect(() => {
    document.body.className = mode === 'dark' ? 'darkmode' : 'lightmode';
  }, [mode]);

  // ✅ JWT 만료 시 자동 로그아웃 처리용 axios 인터셉터
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
    // ✅ 컴포넌트 언마운트 시 인터셉터 제거 (메모리 누수 방지)
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ✅ 헤더를 숨길 경로 목록 (ex: 첫 페이지, 로그인, 회원가입)
  const hideHeaderPaths = ['/', '/login', '/signup'];

  return (
    <>
      {/* ✅ 특정 경로에서는 헤더를 숨김 */}
      {!hideHeaderPaths.includes(location.pathname) && (
        <Header mode={mode} toggleMode={toggleMode} />
      )}

      {/* ✅ 라우터 설정 */}
      <Routes>
        {/* 공개 경로 */}
        <Route path="/" element={<FirstPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 보호된 경로 (로그인 필요) */}
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

        {/* ✅ Layout 내부 보호된 하위 경로 */}
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
