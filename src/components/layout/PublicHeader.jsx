import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useGetSettingsQuery } from '../../features/settings/settingsApi';
import { useGetMenuBySlugQuery } from '../../features/menu/menuApi';
import useTheme from '../../hooks/useTheme';
import { Logo, Skeleton } from '../../components';

import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  User,
  LogIn,
} from 'lucide-react';

const getLinkPath = (url) => {
  if (!url) return '/';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const headerSlug = 'main-header';

  const { data: menuData, isLoading } = useGetMenuBySlugQuery(headerSlug, {
    skip: !headerSlug,
  });

  const menuItems = menuData?.data?.items || [];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background)/70 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* --- Left: Logo --- */}
        <div className="shrink-0 flex items-center gap-2">
          <Logo className="text-primary" />
        </div>

        {/* --- Center: Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-1">
          {isLoading ? (
            <div className="flex gap-6 px-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5 w-20 rounded-md" />
              ))}
            </div>
          ) : (
            menuItems.map((item) => (
              <DesktopMenuItem key={item._id} item={item} />
            ))
          )}
        </nav>

        {/* --- Right: Actions --- */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <div
            className={`hidden sm:flex items-center transition-all duration-300 ${isSearchOpen ? 'bg-(--secondary)/10 rounded-full px-3 py-1 mr-2' : ''}`}
          >
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 text-(--foreground) placeholder-(--secondary)"
                autoFocus
                onBlur={() => !isSearchOpen && setIsSearchOpen(false)}
              />
            )}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-(--secondary)/10 text-(--secondary) hover:text-(--foreground) transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-(--secondary)/10 text-(--secondary) hover:text-(--foreground) transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-(--secondary)/10 text-(--foreground)"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-(--background) border-b border-(--border) shadow-xl px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--secondary)" />
            <input
              type="text"
              placeholder="Search website..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-(--secondary)/5 border border-(--border) focus:border-primary focus:outline-none text-(--foreground)"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="py-3 border-b border-(--border) last:border-0"
                  >
                    <Skeleton className="h-6 w-1/2 rounded-md" />
                  </div>
                ))
              : menuItems.map((item) => (
                  <MobileMenuItem
                    key={item._id}
                    item={item}
                    closeMenu={() => setIsMobileMenuOpen(false)}
                  />
                ))}
          </div>
        </div>
      )}
    </header>
  );
};

// --- Desktop Menu Item ---
const DesktopMenuItem = ({ item }) => {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const linkBase =
    'px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1 cursor-pointer';
  const activeClass = 'text-primary bg-primary/10';
  const inactiveClass =
    'text-(--secondary) hover:text-(--foreground) hover:bg-(--secondary)/5';

  if (hasChildren) {
    return (
      <div
        className="relative group h-full flex items-center"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Parent Link: Clickable for Navigation */}
        <NavLink
          to={getLinkPath(item.url)}
          className={({ isActive }) => `
              ${linkBase} 
              ${isActive ? 'text-primary' : 'text-(--secondary)'} 
              hover:text-(--foreground)
            `}
        >
          {item.label}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </NavLink>

        {/* Dropdown Panel */}
        <div
          className={`
            absolute top-full left-0 pt-2 w-56 
            transition-all duration-200 origin-top-left 
            ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
          `}
        >
          <div className="bg-(--card) rounded-xl shadow-xl border border-(--border) overflow-hidden p-1.5 flex flex-col gap-0.5">
            {item.children.map((child) => (
              <NavLink
                key={child._id}
                to={getLinkPath(child.url)}
                className={({ isActive }) => `
                    block px-4 py-2.5 text-sm rounded-lg transition-colors
                    ${isActive ? activeClass : inactiveClass}
                `}
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={getLinkPath(item.url)}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? activeClass : inactiveClass}`
      }
    >
      {item.label}
    </NavLink>
  );
};

// --- Mobile Menu Item ---
const MobileMenuItem = ({ item, closeMenu }) => {
  const hasChildren = item.children && item.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  if (hasChildren) {
    return (
      <div className="border-b border-(--border) last:border-0 pb-1">
        <div className="flex items-center w-full">
          {/* Left: Link to the page itself */}
          <NavLink
            to={getLinkPath(item.url)}
            onClick={closeMenu}
            className={({ isActive }) => `
                        py-3 text-base font-medium grow
                        ${isActive ? 'text-primary' : 'text-(--foreground)'}
                      `}
          >
            {item.label}
          </NavLink>

          {/* Right: Explicit toggle button for submenu */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-3 -mr-2 text-(--secondary) hover:text-primary active:bg-(--secondary)/10 rounded-full"
            aria-label="Toggle submenu"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Expandable Submenu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-125 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}
        >
          <div className="pl-4 border-l-2 border-(--border) ml-1 flex flex-col gap-1">
            {item.children.map((child) => (
              <NavLink
                key={child._id}
                to={getLinkPath(child.url)}
                onClick={closeMenu}
                className={({ isActive }) => `
                                  block py-2.5 px-3 rounded-md text-sm transition-colors
                                  ${isActive ? 'text-primary font-medium bg-primary/5' : 'text-(--secondary) hover:text-(--foreground)'}
                                `}
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={getLinkPath(item.url)}
      onClick={closeMenu}
      className={({ isActive }) => `
              block py-3 text-base font-medium border-b border-(--border) last:border-0
              ${isActive ? 'text-primary' : 'text-(--foreground)'}
            `}
    >
      {item.label}
    </NavLink>
  );
};

export default PublicHeader;
