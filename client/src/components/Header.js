<<<<<<< HEAD
// client/src/components/Header.js
import { Link } from 'react-router-dom';
import '../css/header.scss';

function Header({ mode, toggleMode }) {
=======
import { Link, useNavigate } from 'react-router-dom';
import '../css/header.scss';

function Header({ mode, toggleMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // ✅ 로그인 여부 판단

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
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
        <button className="mode-toggle-btn" onClick={toggleMode}>
          {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
<<<<<<< HEAD
        <Link to="/login" className="nav-item">Sign In</Link>
        <Link to="/signup" className="nav-item get-started">Get Started</Link>
=======

        {token ? (
          <>
            <button onClick={handleLogout} className="nav-item logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Sign In</Link>
            <Link to="/signup" className="nav-item get-started">Get Started</Link>
          </>
        )}
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
      </div>
    </header>
  );
}

export default Header;
