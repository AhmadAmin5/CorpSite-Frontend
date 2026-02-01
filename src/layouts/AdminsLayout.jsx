import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminHeader, AdminSidebar } from '../components';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isEditorRoute =
    location.pathname.includes('/admin/posts/create') ||
    location.pathname.includes('/admin/posts/edit');

  return (
    <div className="flex flex-col min-h-screen bg-(--background)">
      <AdminHeader onMenuClick={toggleSidebar} />

      <div className="flex flex-1 relative h-[calc(100vh-64px)] overflow-hidden">
        {!isEditorRoute && (
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-(--secondary)/5 overflow-hidden">
          <div
            className={`flex-1 ${
              isEditorRoute
                ? 'overflow-hidden p-0'
                : 'overflow-y-auto p-4 md:p-8'
            }`}
          >
            <div
              className={`${
                isEditorRoute ? 'w-full h-full' : 'max-w-7xl mx-auto w-full'
              }`}
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
