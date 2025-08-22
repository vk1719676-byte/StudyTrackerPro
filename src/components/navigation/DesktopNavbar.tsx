import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, BarChart3, Target, Settings, LogOut, Moon, Sun, Upload } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 max-w-sm mx-4 shadow-xl">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Confirm Logout
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
          Are you sure you want to sign out of Study Tracker Pro?
        </p>
        <div className="flex gap-2 md:gap-3">
          <Button onClick={onConfirm} variant="danger" className="flex-1 text-sm md:text-base py-2 md:py-2.5">
            Yes, Sign Out
          </Button>
          <Button onClick={onCancel} variant="secondary" className="flex-1 text-sm md:text-base py-2 md:py-2.5">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export const DesktopNavbar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/exams', label: 'Exams', icon: Calendar },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/sessions', label: 'Sessions', icon: Clock },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/materials', label: 'Materials', icon: Upload },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  return (
    <>
      <nav className="hidden md:block bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-14 md:h-16 lg:h-18">
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity duration-200 min-w-0"
            >
              <Logo size="md" showText={false} />
              <div className="hidden sm:block min-w-0">
                <h1 className="text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
                  Study Tracker Pro
                </h1>
              </div>
            </Link>

            {/* Navigation Items - Responsive Layout */}
            <div className="flex items-center justify-center flex-1 max-w-2xl mx-4">
              {/* Tablet Layout - Compact Icons */}
              <div className="md:flex lg:hidden items-center justify-center space-x-1 overflow-x-auto scrollbar-hide">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center justify-center p-2.5 rounded-lg text-xs font-medium
                      transition-all duration-200 hover:scale-105 min-w-[44px] min-h-[44px]
                      whitespace-nowrap flex-shrink-0
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-800/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                      }
                    `}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>

              {/* Desktop Layout - Full Navigation */}
              <div className="hidden lg:flex items-center justify-center space-x-4 xl:space-x-6">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 hover:scale-105 min-h-[44px]
                      whitespace-nowrap
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-800/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 md:gap-2 lg:gap-3 min-w-0">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
                className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex-shrink-0"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              />
              
              {/* User Email - Responsive Display */}
              <div className="hidden md:block lg:hidden text-xs text-gray-600 dark:text-gray-400 max-w-[80px] truncate px-1">
                {user?.email?.split('@')[0]}
              </div>
              
              <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-400 max-w-[160px] xl:max-w-[200px] truncate px-2">
                {user?.email}
              </div>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={() => setShowLogoutConfirm(true)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 min-w-[44px] min-h-[44px] px-2 md:px-3 flex-shrink-0"
              >
                <span className="hidden lg:inline ml-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Logout Confirmation Modal - Hidden on Mobile */}
      <div className="hidden md:block">
        <LogoutConfirmation
          isOpen={showLogoutConfirm}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </div>
    </>
  );
};
