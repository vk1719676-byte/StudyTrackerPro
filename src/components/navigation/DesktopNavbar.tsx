import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, BarChart3, Target, Settings, LogOut, Moon, Sun, Upload, Shield, User, ChevronDown, Mail, UserCircle, Edit3 } from 'lucide-react';
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

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null;

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserName = (email: string) => {
    return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm border border-white/30">
              {getInitials(user?.email || '')}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{getUserName(user?.email || '')}</h3>
              <p className="text-purple-100 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-900">
                  PRO
                </span>
                <span className="text-xs text-purple-100">Premium Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-200">
              <UserCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">View Profile</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
            </div>
          </Link>

          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors duration-200">
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Settings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Preferences and configuration</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors duration-200">
              <Edit3 className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Edit Profile</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your information</p>
            </div>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
          >
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800/40 transition-colors duration-200">
              <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Sign Out</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Logout from your account</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export const DesktopNavbar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);

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
    setShowProfileDropdown(false);
    await logout();
  };

  const getInitials = (email: string) => {
    return email?.split('@')[0].slice(0, 2).toUpperCase() || 'U';
  };

  const getUserName = (email: string) => {
    return email?.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User';
  };

  return (
    <>
      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo and Brand - Enhanced */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group mr-8 lg:mr-12"
              >
                <Logo size="md" showText={false} />
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight">
                      Study Tracker
                    </h1>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase -mt-1">
                      Academic Excellence Platform
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-xl transform hover:scale-105 transition-all duration-200 border border-amber-300 hover:shadow-2xl">
                      PRO
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center justify-between flex-1">
              {/* Desktop Navigation - Enhanced with better gradients */}
              <div className="hidden md:flex items-center space-x-1 xl:space-x-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      relative flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-300 hover:scale-105 group overflow-hidden
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 via-blue-600 to-indigo-600 text-white shadow-xl transform scale-105 border border-purple-300/50'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-lg hover:text-blue-600 dark:hover:text-blue-400'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${location.pathname === path ? '' : 'group-hover:scale-110'}`} />
                    <span className="hidden lg:inline">{label}</span>
                    <span className="md:inline lg:hidden">{label.length > 8 ? label.substring(0, 6) + '...' : label}</span>
                    {location.pathname === path && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-500/20 to-indigo-500/20 rounded-xl"></div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Right Side Actions - Enhanced */}
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Theme Toggle - Enhanced */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={theme === 'dark' ? Sun : Moon}
                  onClick={toggleTheme}
                  className="p-2.5 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 hover:scale-110 transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg border border-transparent hover:border-yellow-200 dark:hover:border-yellow-700/50"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                />
                
                {/* Profile Button - New Enhanced Component */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:scale-105 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      {getInitials(user?.email || '')}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {getUserName(user?.email || '')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Premium Member
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <ProfileDropdown
                    isOpen={showProfileDropdown}
                    onClose={() => setShowProfileDropdown(false)}
                    user={user}
                    onLogout={() => setShowLogoutConfirm(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Fixed Focus Mode Button - Enhanced */}
      <Button
        onClick={() => setShowFocusMode(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-full p-4 border border-purple-400/50 hover:border-purple-300 backdrop-blur-sm"
        title="Enter Focus Mode"
      >
        <Shield className="w-6 h-6" />
        <span className="ml-2 font-semibold hidden sm:inline">Focus Mode</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full animate-pulse"></div>
      </Button>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
