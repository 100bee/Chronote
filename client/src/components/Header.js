// src/components/Header.js

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/header.scss'; // 헤더 스타일 파일

// 상단 헤더 컴포넌트
function Header({ mode, toggleMode }) {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [nickname, setNickname] = useState(''); // 사용자 닉네임 상태
  const [token, setToken] = useState('');       // 로그인 토큰 상태

  // 컴포넌트가 처음 마운트될 때 로컬스토리지에서 로그인 정보 불러오기
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedNickname = localStorage.getItem('nickname');

    if (savedToken && savedNickname) {
      setToken(savedToken);
      setNickname(savedNickname);
    }
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    setToken('');
    setNickname('');
    alert('로그아웃 되었습니다.');
    navigate('/'); // 홈으로 이동
  };

  return (
    <header className="header">
      <div className="nav-group">
        {/* 좌측: 로고 및 메인 링크 */}
        <div className="nav-left">
          <Link to="/main" className="logo-link">
            <img src="/favicon2.png" alt="Chronote logo" className="logo" />
            <span className="brand">Chronote</span>
          </Link>
        </div>

        {/* 중앙: 주요 네비게이션 링크 */}
        <nav className="nav-center">
          <Link to="/match" className="nav-item">Match</Link>
          <Link to="/rank" className="nav-item">Rank</Link>
          <Link to="/todos" className="nav-item">Mypage</Link>
        </nav>
      </div>

      {/* 우측: 다크모드 토글 및 로그인/로그아웃 */}
      <div className="nav-right">
        {/* 🌗 다크모드 토글 버튼 */}
        <button className="mode-toggle-btn" onClick={toggleMode}>
          {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* 로그인 상태에 따라 다르게 렌더링 */}
        {token ? (
          <>
            {/* 로그인된 사용자 정보 및 로그아웃 버튼 */}
            <span className="nav-item nickname">{nickname} 님</span>
            <button className="get-started logout-btn" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            {/* 로그인되지 않은 경우: 로그인 및 회원가입 버튼 */}
            <Link to="/login" className="nav-item">Sign In</Link>
            <Link to="/signup" className="nav-item get-started">Get Started</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
