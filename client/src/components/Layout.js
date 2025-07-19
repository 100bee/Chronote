import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-area">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
