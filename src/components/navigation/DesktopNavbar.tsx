import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, BarChart3, Target, Settings, LogOut, Moon, Sun, Upload, Shield, User, ChevronDown, Camera, Edit3, Brain, Zap, Users, BookOpen, Trophy, Timer } from 'lucide-react';
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

export const DesktopNavbar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [userAvatar, setUserAvatar] = React.useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home, shortLabel: 'Home' },
    { path: '/exams', label: 'Exams', icon: Calendar, shortLabel: 'Exams' },
    { path: '/goals', label: 'Goals', icon: Target, shortLabel: 'Goals' },
    { path: '/sessions', label: 'Sessions', icon: Clock, shortLabel: 'Time' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, shortLabel: 'Stats' },
    { path: '/materials', label: 'Materials', icon: Upload, shortLabel: 'Files' },
    { path: '/settings', label: 'Settings', icon: Settings, shortLabel: 'Config' }
  ];

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setShowProfileDropdown(false);
    await logout();
  };

  // Load user data from localStorage on component mount
  React.useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedName = localStorage.getItem('userName');
    if (savedAvatar) setUserAvatar(savedAvatar);
    if (savedName) setUserName(savedName);
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserAvatar(result);
        localStorage.setItem('userAvatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle name update
  const handleNameUpdate = (newName: string) => {
    setUserName(newName);
    localStorage.setItem('userName', newName);
    setShowEditProfile(false);
  };

  // Get user initials for avatar
  const getUserInitials = (email: string | undefined) => {
    if (!email) return 'U';
    const parts = email.split('@')[0];
    return parts.charAt(0).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (userName) return userName;
    return user?.email?.split('@')[0] || 'User';
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
        setShowEditProfile(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);
  // Calculate dropdown position to prevent going off-screen
  const getDropdownPosition = () => {
    if (typeof window === 'undefined') return {};
    
    const screenWidth = window.innerWidth;
    const dropdownWidth = 320; // Approximate dropdown width
    
    if (screenWidth < dropdownWidth + 100) {
      return { right: '0.5rem', left: 'auto' };
    }
    
    return { right: '0', left: 'auto' };
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            
            {/* Logo and Brand */}
            <div className="flex items-center min-w-0">
              <Link 
                to="/" 
                className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-300 group mr-2 sm:mr-4 lg:mr-8 min-w-0"
              >
                <Logo size="sm" showText={false} className="flex-shrink-0" />
                <div className="flex items-center gap-1 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight truncate">
                      <span className="hidden sm:inline">Study Tracker</span>
                      <span className="sm:hidden">StudyTracker</span>
                    </h1>
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-1 flex-shrink-0">
                    <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-xl transform hover:scale-105 transition-all duration-200 border border-amber-300 hover:shadow-2xl">
                      PRO
                    </span>
                    <div className="flex gap-0.5 sm:gap-1">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1 xl:space-x-2 flex-1 max-w-2xl mx-4">
              {navItems.map(({ path, label, shortLabel, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-2 rounded-lg xl:rounded-xl text-sm font-medium
                    transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap
                    ${location.pathname === path
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md'
                    }
                  `}
                  title={label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{label}</span>
                  <span className="md:inline lg:hidden text-xs">{shortLabel || label.slice(0, 4)}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
                className="p-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-110 transition-all duration-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              />
              
              {/* Profile Button with Smart Dropdown Positioning */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl transition-all duration-200 
                    hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                    ${showProfileDropdown 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 shadow-lg scale-105' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
                    }
                  `}
                  title="Profile Menu"
                >
                  {/* Avatar Circle */}
                  <div className="relative flex-shrink-0">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Profile"
                        className={`
                          w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover transition-all duration-200 border-2
                          ${showProfileDropdown 
                            ? 'border-blue-500 shadow-lg scale-105' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 shadow-md'
                          }
                        `}
                      />
                    ) : (
                      <div className={`
                        w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200
                        ${showProfileDropdown 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md'
                        }
                      `}>
                        {getUserInitials(user?.email)}
                      </div>
                    )}
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* User Info (hidden on small screens) */}
                  <div className="hidden lg:flex flex-col items-start min-w-0">
                    <span className="text-sm font-medium leading-tight truncate max-w-24 xl:max-w-32">
                      {getDisplayName()}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900">
                        PRO
                      </span>
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                    </div>
                  </div>
                  
                  {/* Chevron Icon */}
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Smart Profile Dropdown with Responsive Positioning */}
                {showProfileDropdown && (
                  <div 
                    className="absolute mt-3 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 origin-top-right overflow-hidden"
                    style={getDropdownPosition()}
                  >
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt="Profile"
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                              {getUserInitials(user?.email)}
                            </div>
                          )}
                          {/* Camera overlay for avatar upload */}
                          <button
                    <div className="hidden lg:flex flex-col items-start">
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                            title="Change avatar"
                          >
                            <Camera className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {getDisplayName()}
                            </p>
                            <button
                              onClick={() => setShowEditProfile(!showEditProfile)}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${showProfileDropdown ? 'rotate-180' : ''}`} />
                              title="Edit name"
                            >
                              <Edit3 className="w-3 h-3 text-gray-500" />
                            </button>
                    <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 origin-top-right overflow-hidden">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900">
                              PRO
                            </span>
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Edit Profile Form */}
                      {showEditProfile && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <input
                            type="text"
                            placeholder="Enter your name"
                            defaultValue={userName}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNameUpdate((e.target as HTMLInputElement).value);
                              }
                            }}
                            onBlur={(e) => handleNameUpdate(e.target.value)}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      {/* Settings Link */}
                      <button
                        onClick={() => {
                          toggleTheme();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 font-medium"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-4 h-4 text-yellow-500" />
                            Switch to Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 text-indigo-500" />
                            Switch to Dark Mode
                          </>
                        )}
                      </button>
                      
                      {/* Divider */}
                      <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                      
                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50">
              <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                    `}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
                  title="Menu"
                >
                  {showMobileMenu ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

        
        {/* Hidden file input for avatar upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </nav>

      {/* Fixed Focus Mode Button - Bottom Right */}
      <Button
        onClick={() => setShowFocusMode(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-full p-3 sm:p-4 border border-purple-400 hover:border-purple-300"
        title="Enter Focus Mode"
      >
        <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="ml-2 font-semibold hidden sm:inline">Focus Mode</span>
      </Button>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
