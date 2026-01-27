import { Outlet } from 'react-router-dom';
import { AdminFooter, AdminHeader } from '../components';
const AdminsLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="grow flex flex-col">
        <Outlet />
      </main>

      // TODO Turn On
      {/* <AdminFooter /> */}
    </div>
  );
};

export default AdminsLayout;
