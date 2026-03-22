// src/pages/FirstPage.js
// ✅ 첫 페이지
// 이 페이지는 사용자가 Chronote에 처음 접속했을 때 보여지는 첫 화면입니다.
// 사용자는 로그인 또는 회원가입 버튼을 눌러 이동할 수 있습니다.

import { useNavigate } from 'react-router-dom';
import '../css/firstpage.scss'; // 첫 페이지 전용 스타일

function FirstPage() {
  const navigate = useNavigate(); // 페이지 이동 훅

  return (
    <div className="container">
      {/* ✅ 앱 로고 */}
      <img
        src="/favicon3.png"
        alt="Chronote logo"
        className="logo firstpage-logo"
      />

      {/* ✅ 간단한 앱 슬로건 문구 */}
      <p className="subtitle">
        작은 계획이 큰 변화를 만듭니다. 오늘 할 일을 적어보세요.
      </p>

      {/* ✅ 로그인 / 회원가입 버튼 */}
      <div className="button-stack">
        <button onClick={() => navigate('/login')}>로그인</button>
        <button onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </div>
  );
}

export default FirstPage;
