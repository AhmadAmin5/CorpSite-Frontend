import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import useTheme from '../hooks/useTheme';
import Logo from './Logo';

import { Sun, Moon, User, Menu } from 'lucide-react';

const AdminHeader = ({ onMenuClick }) => {
  const user = useSelector(selectUser);
  const { theme, toggleTheme } = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <header className="bg-(--card) border-b border-(--border) h-16 px-4 md:px-6 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-primary/10 text-(--foreground) transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <Logo />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-primary/10 text-(--foreground) transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {user && (
          <>
            <div className="h-6 w-px bg-(--border)"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-(--foreground)">
                  {user.fullName || user.username}
                </span>
                <span className="text-xs text-(--secondary)">{user.role}</span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-(--border) group-hover:border-primary transition-colors">
                {!imgError && user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-(--secondary)/10">
                    <User className="w-6 h-6 text-(--secondary)" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;