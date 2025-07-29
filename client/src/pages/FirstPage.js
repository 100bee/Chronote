// src/pages/FirstPage.js
// 첫 페이지
// 이 페이지는 사용자가 Chronote에 처음 접속했을 때 보여지는 첫 화면입니다.
// 사용자는 로그인 또는 회원가입을 선택할 수 있습니다.

import { useNavigate } from 'react-router-dom';
import '../css/firstpage.scss';

function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src="/favicon3.png" alt="Chronote logo" className="logo firstpage-logo" />
      <p className="subtitle">작은 계획이 큰 변화를 만듭니다. 오늘 할 일을 적어보세요.</p>
      <div className="button-stack">
        <button onClick={() => navigate('/login')}>로그인</button>
        <button onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </div>
  );
}

export default FirstPage;
