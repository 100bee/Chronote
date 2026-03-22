// client/src/components/Layout.js
import { Outlet } from 'react-router-dom'; // 현재 선택된 라우트의 컴포넌트 렌더링용
import Sidebar from './Sidebar'; // 사이드바 컴포넌트 임포트

// 전체 페이지의 기본 레이아웃 컴포넌트
const Layout = () => {
  return (
    <div className="dashboard"> {/* 전체 레이아웃을 감싸는 컨테이너 */}
      <Sidebar /> {/* 좌측 사이드바 */}
      <div className="main-area"> {/* 우측 메인 콘텐츠 영역 */}
        <Outlet /> {/* 현재 라우트에 해당하는 컴포넌트를 렌더링 */}
      </div>
    </div>
  );
};

export default Layout;
