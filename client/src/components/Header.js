// client/src/components/Header.js
import { Link } from 'react-router-dom';
import '../css/header.scss';

function Header({ mode, toggleMode }) {
  return (
    <header className="header">
      <div className='nav-group'>
        <div className="nav-left">
          <Link to="/main">
            <img src="/favicon.png" alt="Chronote logo" className='logo'/>
            <span className="brand"></span>
          </Link>
        </div>
        <nav className="nav-center">
          <Link to="/group" className="nav-item">Group</Link>
          <Link to="/rank" className="nav-item">Rank</Link>
          <Link to="/todos" className="nav-item">Mypage</Link>
        </nav>
      </div>
      <div className="nav-right">
        <button className="mode-toggle-btn" onClick={toggleMode}>
          {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        <Link to="/login" className="nav-item">Sign In</Link>
        <Link to="/signup" className="nav-item get-started">Get Started</Link>
      </div>
    </header>
  );
}

export default Header;
