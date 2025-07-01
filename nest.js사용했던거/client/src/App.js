import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'black', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>크로노트</h1>
      <p>할 일을 작성하고 매일을 기록해보세요.</p>
      <button onClick={() => navigate('/signup')}>회원가입</button>
      <button onClick={() => navigate('/login')}>로그인</button>
    </div>
  );
}

function Mypage() {
  return <h2>마이페이지 (로그인 후 접근 가능)</h2>;
}

function Login() {
  return <h2>로그인 페이지</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
