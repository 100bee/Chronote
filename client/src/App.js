import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.sass';
import Signup from './pages/Signup';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <div className="container">
          <h1 className="title">ChroNote</h1>
          <p className="subtitle">작은 계획이 큰 변화를 만듭니다. 오늘 할 일을 적어보세요.</p>
          <div className="button-group">
            <button onClick={() => navigate('/signup')}>회원가입</button>
            <button onClick={() => navigate('/login')}>로그인</button>
          </div>
        </div>
      } />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
