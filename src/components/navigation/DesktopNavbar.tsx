import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, BarChart3, Target, Settings, LogOut, Moon, Sun, Upload, Shield, Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FocusMode } from '../focus/FocusMode';

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

export const ResponsiveNavbar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Main Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18 lg:h-20">
            
            {/* Logo and Brand - Enhanced responsive sizing */}
            <div className="flex items-center min-w-0">
              <Link 
                to="/" 
                className="flex items-center gap-2 md:gap-3 lg:gap-4 hover:opacity-90 transition-all duration-300 group"
                onClick={closeMobileMenu}
              >
                <Logo size="sm" showText={false} className="md:w-8 md:h-8 lg:w-10 lg:h-10" />
                <div className="flex items-center gap-1 md:gap-2 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight truncate">
                      Study Tracker
                    </h1>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 md:gap-1">
                    <span className="inline-flex items-center px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-xl transform hover:scale-105 transition-all duration-200 border border-amber-300 hover:shadow-2xl">
                      PRO
                    </span>
                    <div className="hidden lg:flex gap-1">
                      <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Full menu for large screens */}
            <div className="hidden xl:flex items-center space-x-2 flex-1 justify-center max-w-4xl mx-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 hover:scale-105 hover:shadow-lg min-w-0
                    ${location.pathname === path
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>

            {/* Large Tablet Navigation - Compact menu for large tablets */}
            <div className="hidden lg:flex xl:hidden items-center space-x-1 flex-1 justify-center max-w-3xl mx-6">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 hover:scale-105 hover:shadow-lg min-w-0
                    ${location.pathname === path
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>

            {/* Medium Tablet Navigation - Icon-focused for medium tablets */}
            <div className="hidden md:flex lg:hidden items-center space-x-1 flex-1 justify-center max-w-2xl mx-4">
              {navItems.slice(0, 6).map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex flex-col items-center gap-1 px-2 py-2 rounded-xl text-xs font-medium
                    transition-all duration-200 hover:scale-105 min-w-0 flex-shrink-0
                    ${location.pathname === path
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600'
                    }
                  `}
                  title={label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate max-w-12 text-xs">{label.length > 6 ? label.substring(0, 4) + '..' : label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 md:gap-2 lg:gap-3 xl:gap-4">
              {/* Mobile Menu Button - Only visible on mobile */}
              <Button
                variant="ghost"
                size="sm"
                icon={isMobileMenuOpen ? X : Menu}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-110 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                title="Toggle menu"
              />

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
                className="p-2 md:p-2.5 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-110 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              />
              
              {/* User Email - Progressive disclosure with better responsive behavior */}
              <div className="hidden lg:block xl:block text-xs lg:text-sm text-gray-600 dark:text-gray-400 max-w-24 lg:max-w-32 xl:max-w-40 truncate font-medium">
                {user?.email}
              </div>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={() => setShowLogoutConfirm(true)}
                className="hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 p-2 md:p-2.5"
                title="Logout"
              >
                <span className="hidden xl:inline font-medium ml-1 text-sm">Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium w-full
                    transition-all duration-200 hover:scale-[1.02] hover:shadow-md
                    ${location.pathname === path
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg border border-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {/* User info in mobile menu */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Signed in as
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100 font-semibold truncate">
                  {user?.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Fixed Focus Mode Button - Responsive positioning */}
      <Button
        onClick={() => setShowFocusMode(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-full p-3 md:p-4 lg:p-5 border border-purple-400 hover:border-purple-300"
        title="Enter Focus Mode"
      >
        <Shield className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        <span className="ml-2 font-semibold hidden md:inline lg:inline text-xs md:text-sm lg:text-base">Focus Mode</span>
      </Button>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
