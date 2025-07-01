import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <div className="container">
          <h1 className="title">크로노트</h1>
          <p className="subtitle">할 일을 작성하고 매일을 기록해보세요.</p>
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
