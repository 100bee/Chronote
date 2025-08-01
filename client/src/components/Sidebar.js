// client/src/components/Sidebar.js
// ✅ 좌측 사이드바 메뉴 컴포넌트: 오늘 할 일, 캘린더, 분석 페이지로 이동 가능

import { useLocation, useNavigate } from 'react-router-dom';
import '../css/sidebar.scss'; // 사이드바 전용 스타일

const Sidebar = () => {
  const navigate = useNavigate();     // 페이지 이동을 위한 훅
  const location = useLocation();     // 현재 URL 경로 정보

  // 메뉴 항목 정의
  const menus = [
    { label: '오늘 할 일', path: '/todos' },
    { label: '캘린더', path: '/calendar' },
    { label: '분석', path: '/analysis' }, // 🔄 향후 분석 페이지를 위한 자리
  ];

  // 메뉴 클릭 시 해당 경로로 이동
  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar"> {/* 사이드바 전체 컨테이너 */}
      <h2 className="sidebar-title">ChroNote</h2> {/* 앱 이름 또는 로고 */}
      <ul className="menu-list"> {/* 메뉴 리스트 */}
        {menus.map((menu, idx) => (
          <li
            key={idx}
            // 현재 경로와 일치하면 'active' 클래스 추가로 강조 표시
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
