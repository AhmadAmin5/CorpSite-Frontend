import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminPanelLayout = () => {
  return (
    <div className="flex flex-1">
      <AdminSidebar />

      <div className="flex-1 p-6 md:p-8 overflow-y-auto h-full bg-(--secondary)/5">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
