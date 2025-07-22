// client/src/App.js
import { useState } from 'react';
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

function App() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [mode, setMode] = useState('light'); // ⭐️ 다크/라이트 상태

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <div className={mode === 'dark' ? 'darkmode' : 'lightmode'}>
      <Header mode={mode} toggleMode={toggleMode} />
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/group" element={<Group />} />
        <Route path="/rank" element={<Rank />} />
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
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
