// client/src/components/PrivateRoute.js
// ✅ 로그인하지 않은 사용자가 main 등 보호된 페이지에 접근하지 못하도록 막는 컴포넌트

import { Navigate } from 'react-router-dom'; // 다른 경로로 리디렉션할 때 사용

// 보호된 라우트를 감싸는 컴포넌트
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // 로컬스토리지에서 로그인 토큰 확인

  // 로그인 상태가 아니면 로그인 페이지로 리디렉션
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 로그인되어 있으면 자식 컴포넌트 렌더링
  return children;
}

export default PrivateRoute;
