// src/components/Header.js
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/header.scss';

function Header({ mode, toggleMode }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedNickname = localStorage.getItem('nickname');

    if (savedToken && savedNickname) {
      setToken(savedToken);
      setNickname(savedNickname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    setToken('');
    setNickname('');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="nav-group">
        <div className="nav-left">
          <Link to="/main" className="logo-link">
            <img src="/favicon2.png" alt="Chronote logo" className="logo" />
            <span className="brand">Chronote</span>
          </Link>
        </div>

        <nav className="nav-center">
          <Link to="/match" className="nav-item">Match</Link>
          <Link to="/rank" className="nav-item">Rank</Link>
          <Link to="/todos" className="nav-item">Mypage</Link>
        </nav>
      </div>

      <div className="nav-right">
        {/* 🌗 다크모드 토글 */}
        <button className="mode-toggle-btn" onClick={toggleMode}>
          {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        {token ? (
          <>
            <span className="nav-item nickname">{nickname} 님</span>
            <button className="get-started logout-btn" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Sign In</Link>
            <Link to="/signup" className="nav-item get-started">Get Started</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
