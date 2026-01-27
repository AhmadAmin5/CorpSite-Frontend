import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../services/authApi';
import { clearAuth } from '../features/auth/authSlice';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed: ', err);
      dispatch(clearAuth());
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
    { name: 'Pages', path: '/admin/pages', icon: Layers },
    { name: 'Media', path: '/admin/media', icon: ImageIcon },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Users', path: '/admin/users', icon: Users, role: 'admin' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, role: 'admin' },
    ];

  return (
    <aside className="w-64 bg-(--card) border-r border-(--border) hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-(--secondary) hover:bg-(--secondary)/10 hover:text-(--foreground)'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-(--border)">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
