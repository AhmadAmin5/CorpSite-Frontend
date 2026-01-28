import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader, AdminSidebar, AdminFooter } from '../components';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-(--background)">
      <AdminHeader onMenuClick={toggleSidebar} />

      <div className="flex flex-1 relative">
        <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />


        <main className="flex-1 flex flex-col min-w-0 bg-(--secondary)/5">
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </div>
          
          {/* <AdminFooter /> */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;