import { useNavigate } from 'react-router-dom';

function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">ChroNote</h1>
      <p className="subtitle">작은 계획이 큰 변화를 만듭니다. 오늘 할 일을 적어보세요.</p>
      <div className="button-group">
        <button onClick={() => navigate('/signup')}>회원가입</button>
        <button onClick={() => navigate('/login')}>로그인</button>
      </div>
    </div>
  );
}

export default FirstPage;
