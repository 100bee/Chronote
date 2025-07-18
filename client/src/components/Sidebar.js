// src/components/Sidebar.js
import '../css/sidebar.scss';

const Sidebar = ({ selected, setSelected }) => {
  const menus = ['오늘 할 일', '계획된 일정', '분석'];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">ChroNote</h2>
      <ul className="menu-list">
        {menus.map((menu, idx) => (
          <li
            key={idx}
            className={`menu-item ${selected === menu ? 'active' : ''}`}
            onClick={() => setSelected(menu)}
          >
            {menu}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
