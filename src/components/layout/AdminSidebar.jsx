import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../features/auth/authApi';
import { clearAuth } from '../../features/auth/authSlice';
import Spinner from '../ui/Spinner';

import {
  LayoutDashboard,
  FileText,
  Layers,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  MessageSquare,
  X,
  UserRoundPen,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

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
    { name: 'Profile', path: '/admin/profile', icon: UserRoundPen },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      role: 'admin',
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-30 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        bg-(--card) border-r border-(--border) flex flex-col 
        z-40 w-64 transition-transform duration-300 ease-in-out
        
        fixed top-16 left-0 bottom-0 
        h-[calc(100dvh-4rem)]
        
        md:static md:h-full md:translate-x-0
        
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="md:hidden p-4 flex justify-between items-center border-b border-(--border)">
          <span className="font-semibold text-(--foreground)">Menu</span>
          {/* <button
            onClick={onClose}
            className="p-1 hover:bg-primary/10 rounded text-(--foreground)"
          >
            <X className="w-5 h-5" />
          </button> */}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-(--secondary) hover:bg-primary/5 hover:text-(--foreground)'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-(--border) shrink-0 bg-(--card)">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            {isLoading ? <Spinner /> : <LogOut className="w-5 h-5" />}
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
