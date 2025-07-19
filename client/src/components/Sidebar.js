import { useLocation, useNavigate } from 'react-router-dom';
import '../css/sidebar.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { label: '오늘 할 일', path: '/todos' },
    { label: '캘린더', path: '/calendar' },
    { label: '분석', path: '/analysis' }, // 향후 대비
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">ChroNote</h2>
      <ul className="menu-list">
        {menus.map((menu, idx) => (
          <li
            key={idx}
            className={`menu-item ${location.pathname === menu.path ? 'active' : ''}`}
            onClick={() => handleClick(menu.path)}
          >
            {menu.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
