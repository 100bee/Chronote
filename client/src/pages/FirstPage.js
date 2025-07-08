import { useNavigate } from 'react-router-dom';
import '../css/firstpage.scss';

function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src="/favicon3.png" alt="Chronote logo" className='logo'/>
      <p className="subtitle">작은 계획이 큰 변화를 만듭니다. 오늘 할 일을 적어보세요.</p>
      <div className="button-stack">
        <button onClick={() => navigate('/login')}>로그인</button>
        <button onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </div>
  );
}

export default FirstPage;
