import '../css/header.scss';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
        <div className='nav-group'>
              <div className="nav-left">
                <img src="/favicon2.png" alt="Chronote logo" className='logo'/>
                <span className="brand">Chronote</span>
              </div>
        <nav className="nav-center">
            <Link to="/group" className="nav-item">Group</Link>
            <Link to="/rank" className="nav-item">Rank</Link>
        </nav>
        </div>

      <div className="nav-right">
        <Link to="/login" className="nav-item">Sign In</Link>
        <Link to="/signup" className="nav-item get-started">Get Started</Link>
      </div>
    </header>
  );
}
export default Header;
