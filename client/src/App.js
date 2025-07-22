// src/App.js
// Chronote 애플리케이션의 메인 컴포넌트
// 이 컴포넌트는 라우팅을 설정하고, 애플리케이션의 전반적인 레이아웃을 관리합니다.
// 사용자는 로그인, 회원가입, 투두 관리, 캘린더, 분석 페이지 등을 탐색할 수 있습니다.
// 각 페이지는 개별적으로 관리되며, 공통 레이아웃을 통해 사이드바와
// 네비게이션을 제공합니다.
import { useState } from 'react'; // React의 useState 훅을 사용하여 상태를 관리합니다.
import { Route, Routes } from 'react-router-dom'; // React Router의 Route와 Routes 컴포넌트를 사용하여 라우팅을 설정합니다.
import Layout from './components/Layout'; // 공통 레이아웃 컴포넌트
import Analysis from './pages/Analysis'; // 분석 페이지 컴포넌트
import FirstPage from './pages/FirstPage'; //  첫 페이지 컴포넌트
import Login from './pages/Login'; // 로그인 페이지 컴포넌트
import Main from './pages/Main'; // 메인 페이지 컴포넌트
import Signup from './pages/Signup'; // 회원가입 페이지 컴포넌트
import TodoCalendar from './pages/TodoCalendar'; // 날짜별 할 일 관리 페이지
import TodoDashboard from './pages/TodoDashboard'; // 투두 관리의 메인 페이지

function App() {// App 컴포넌트 정의
  // 상태 관리: 날짜별 할 일 목록을 저장하는 상태 변수
  // tasksByDate는 날짜별로 할 일을 관리하는 객체입니다.
  // setTasksByDate는 이 상태를 업데이트하는 함수입니다.
  // 초기값은 빈 객체로 설정되어 있습니다.
  // 이 상태는 TodoCalendar와 TodoDashboard 컴포넌트에서 사용됩니다.
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
