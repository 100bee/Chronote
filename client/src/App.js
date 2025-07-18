import { Route, Routes } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import Login from './pages/Login';
import Main from './pages/Main';
import Signup from './pages/Signup';
import TodoDashboard from './pages/TodoDashboard'; // ✅ 수정

function App() {
  return (
    <Routes>      
      <Route path="/" element={<FirstPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/todos" element={<TodoDashboard />} /> {/* ✅ 수정 */}
    </Routes>
  );
}

export default App;
