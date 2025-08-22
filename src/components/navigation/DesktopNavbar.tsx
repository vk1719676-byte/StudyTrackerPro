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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Confirm Logout
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to sign out of Study Tracker Pro?
        </p>
        <div className="flex gap-3">
          <Button onClick={onConfirm} variant="danger" className="flex-1">
            Yes, Sign Out
          </Button>
          <Button onClick={onCancel} variant="secondary" className="flex-1">
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
      {/* Main Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            
            {/* Logo and Brand Section - Enhanced spacing */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center gap-4 hover:opacity-90 transition-all duration-300 group pr-6 md:pr-8"
              >
                <div className="flex items-center gap-3">
                  <Logo size="md" showText={false} />
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <h1 className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight leading-tight">
                        Study Tracker
                      </h1>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase -mt-0.5 leading-tight">
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 ml-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-lg transform hover:scale-105 transition-all duration-200 border border-amber-300 hover:shadow-xl">
                        PRO
                      </span>
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Enhanced spacing and separator */}
            <div className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-6 lg:mx-8">
              <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl px-3 py-2 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-sm">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden lg:inline">{label}</span>
                    <span className="md:inline lg:hidden">{label.length > 8 ? label.substring(0, 6) + '...' : label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions - Enhanced spacing */}
            <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 pl-4 md:pl-6">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
                className="p-2.5 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-110 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              />
              
              {/* User Email - Hidden on mobile, visible on lg+ with better spacing */}
              <div className="hidden lg:block">
                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-32 xl:max-w-40 truncate font-medium px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  {user?.email}
                </div>
              </div>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={() => setShowLogoutConfirm(true)}
                className="px-3 py-2.5 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105"
                title="Logout"
              >
                <span className="hidden md:inline font-medium ml-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
