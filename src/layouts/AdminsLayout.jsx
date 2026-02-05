import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../components/layout/AdminHeader';
import AdminSidebar from '../components/layout/AdminSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isEditorRoute = [
    '/posts/create',
    '/posts/edit',
    '/pages/create',
    '/pages/edit',
  ].some((path) => location.pathname.includes(path));

  return (
    <div className="flex flex-col h-screen bg-(--background) overflow-hidden">
      {/* Pass isOpen state to the header */}
      <AdminHeader onMenuClick={toggleSidebar} isOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        {!isEditorRoute && (
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-(--secondary)/5 h-full overflow-hidden">
          <div
            className={`flex-1 ${
              isEditorRoute
                ? 'overflow-hidden p-0'
                : 'overflow-y-auto p-4 md:p-8 scroll-smooth'
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
