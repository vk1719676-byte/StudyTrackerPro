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
  const [userAvatar, setUserAvatar] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState<string>('');
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Remove avatar
  const handleRemoveAvatar = () => {
    setUserAvatar(null);
    localStorage.removeItem('userAvatar');
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
        setShowEditProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Main Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 md:lg:bg-gradient-to-r md:lg:from-slate-50 md:lg:via-white md:lg:to-slate-50 dark:md:lg:from-gray-900 dark:md:lg:via-gray-800 dark:md:lg:to-gray-900 md:lg:backdrop-blur-xl md:lg:shadow-2xl md:lg:border-slate-300 dark:md:lg:border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:lg:px-8">
          <div className="flex justify-between items-center h-20 md:lg:h-24 lg:h-20">
            
            {/* Logo and Brand - Reduced gap between Study Tracker and PRO */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group mr-8 md:lg:mr-10 lg:mr-12"
              >
                <Logo size="md" showText={false} />
                <div className="flex items-center gap-1"> {/* Reduced gap from gap-2 to gap-1 */}
                  <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl md:lg:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight md:lg:tracking-normal">
                      Study Tracker
                    </h1>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase -mt-1">
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-1"> {/* Added ml-1 for slight spacing */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-xl transform hover:scale-105 transition-all duration-200 border border-amber-300 hover:shadow-2xl md:lg:px-4 md:lg:py-1.5 md:lg:text-sm md:lg:shadow-2xl">
                      PRO
                    </span>
                    <div className="flex gap-1 md:lg:gap-1.5">
                      <div className="w-1 h-1 md:lg:w-1.5 md:lg:h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 md:lg:w-1.5 md:lg:h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-1 md:lg:w-1.5 md:lg:h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center justify-between flex-1">
              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-1 xl:space-x-2 md:lg:space-x-3 md:lg:bg-white/60 dark:md:lg:bg-gray-800/60 md:lg:backdrop-blur-sm md:lg:rounded-2xl md:lg:p-2 md:lg:shadow-lg md:lg:border md:lg:border-slate-200 dark:md:lg:border-gray-700">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-3 xl:px-4 py-2 rounded-xl text-sm font-medium
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      md:lg:px-4 md:lg:py-3 md:lg:rounded-2xl md:lg:text-base md:lg:font-semibold md:lg:shadow-md md:lg:hover:shadow-xl md:lg:transform md:lg:hover:scale-110
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300 md:lg:from-indigo-500 md:lg:via-purple-500 md:lg:to-blue-500 md:lg:shadow-2xl md:lg:border-indigo-300 md:lg:scale-110'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md md:lg:hover:from-indigo-50 md:lg:hover:to-purple-50 dark:md:lg:hover:from-gray-700 dark:md:lg:hover:to-gray-600 md:lg:hover:text-indigo-700 dark:md:lg:hover:text-indigo-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 md:lg:w-5 md:lg:h-5" />
                    <span className="hidden lg:inline">{label}</span>
                    <span className="md:inline lg:hidden md:lg:inline">{label.length > 8 ? label.substring(0, 6) + '...' : label}</span>
                  </Link>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 lg:gap-3 md:lg:gap-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={theme === 'dark' ? Sun : Moon}
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-110 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md md:lg:p-3 md:lg:rounded-2xl md:lg:bg-white/60 dark:md:lg:bg-gray-800/60 md:lg:backdrop-blur-sm md:lg:shadow-lg md:lg:border md:lg:border-slate-200 dark:md:lg:border-gray-700 md:lg:hover:shadow-xl md:lg:hover:scale-125"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                />
                
                {/* Enhanced Profile Button with Avatar and Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 
                      hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                      md:lg:px-4 md:lg:py-3 md:lg:rounded-2xl md:lg:bg-white/60 dark:md:lg:bg-gray-800/60 md:lg:backdrop-blur-sm md:lg:shadow-lg md:lg:border md:lg:border-slate-200 dark:md:lg:border-gray-700 md:lg:hover:shadow-xl md:lg:hover:scale-110
                      ${showProfileDropdown 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 shadow-lg scale-105 md:lg:from-indigo-50 md:lg:to-purple-50 dark:md:lg:from-indigo-900/30 dark:md:lg:to-purple-800/30 md:lg:text-indigo-600 dark:md:lg:text-indigo-400 md:lg:shadow-2xl md:lg:scale-110' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md md:lg:hover:from-indigo-50 md:lg:hover:to-purple-50 dark:md:lg:hover:from-indigo-900/20 dark:md:lg:hover:to-purple-800/20 md:lg:hover:text-indigo-600 dark:md:lg:hover:text-indigo-400'
                      }
                    `}
                    title="Profile Menu"
                  >
                    {/* Avatar Circle */}
                    <div className="relative">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="Profile"
                          className={`
                            w-8 h-8 rounded-full object-cover transition-all duration-200 border-2
                            md:lg:w-10 md:lg:h-10 md:lg:border-3
                            ${showProfileDropdown 
                              ? 'border-blue-500 shadow-lg scale-105 md:lg:border-indigo-500 md:lg:shadow-xl md:lg:scale-110' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 shadow-md md:lg:border-slate-300 dark:md:lg:border-gray-600 md:lg:hover:border-indigo-400 md:lg:shadow-lg'
                            }
                          `}
                        />
                      ) : (
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                          md:lg:w-10 md:lg:h-10 md:lg:text-base
                          ${showProfileDropdown 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg md:lg:from-indigo-500 md:lg:to-purple-600 md:lg:shadow-xl' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md md:lg:from-indigo-500 md:lg:to-purple-600 md:lg:hover:from-indigo-600 md:lg:hover:to-purple-700 md:lg:shadow-lg'
                          }
                        `}>
                          {getUserInitials(user?.email)}
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse md:lg:w-3.5 md:lg:h-3.5 md:lg:border-3"></div>
                    </div>
                    
                    {/* User Info (hidden on small screens) */}
                    <div className="hidden md:flex flex-col items-start md:lg:gap-0.5">
                      <span className="text-sm font-medium leading-tight md:lg:text-base md:lg:font-semibold">
                        {getDisplayName()}
                      </span>
                      <div className="flex items-center gap-1 md:lg:gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 md:lg:px-2 md:lg:py-1 md:lg:text-xs md:lg:font-semibold">
                          PRO
                        </span>
                        <div className="w-1 h-1 bg-green-400 rounded-full md:lg:w-1.5 md:lg:h-1.5"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium md:lg:text-sm md:lg:font-semibold">Online</span>
                      </div>
                    </div>
                    
                    {/* Chevron Icon */}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 md:lg:w-5 md:lg:h-5 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Enhanced Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 origin-top-right overflow-hidden md:lg:w-96 md:lg:mt-4 md:lg:rounded-3xl md:lg:shadow-3xl md:lg:border-slate-300 dark:md:lg:border-gray-600">
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700 md:lg:p-6 md:lg:from-indigo-50 md:lg:to-purple-50 dark:md:lg:from-indigo-900/20 dark:md:lg:to-purple-900/20 md:lg:border-slate-200 dark:md:lg:border-gray-600">
                        <div className="flex items-center gap-3 md:lg:gap-4">
                          <div className="relative">
                            {userAvatar ? (
                              <img
                                src={userAvatar}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg md:lg:w-16 md:lg:h-16 md:lg:border-3 md:lg:shadow-xl"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg md:lg:w-16 md:lg:h-16 md:lg:text-xl md:lg:from-indigo-500 md:lg:to-purple-600 md:lg:shadow-xl">
                                {getUserInitials(user?.email)}
                              </div>
                            )}
                            {/* Camera overlay for avatar upload */}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                              title="Change avatar"
                            >
                              <Camera className="w-4 h-4 text-white md:lg:w-5 md:lg:h-5" />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate md:lg:text-base md:lg:font-bold">
                                {getDisplayName()}
                              </p>
                              <button
                                onClick={() => setShowEditProfile(!showEditProfile)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors md:lg:p-1.5 md:lg:hover:bg-gray-300 dark:md:lg:hover:bg-gray-600"
                                title="Edit name"
                              >
                                <Edit3 className="w-3 h-3 text-gray-500 md:lg:w-4 md:lg:h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate md:lg:text-sm">
                              {user?.email}
                            </p>
                            <div className="flex items-center gap-1 mt-1 md:lg:gap-1.5 md:lg:mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 md:lg:px-3 md:lg:py-1 md:lg:text-sm md:lg:font-semibold">
                                PRO
                              </span>
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full md:lg:w-2 md:lg:h-2"></div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium md:lg:text-sm md:lg:font-semibold">Online</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit Profile Form */}
                        {showEditProfile && (
                          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 md:lg:mt-4 md:lg:p-4 md:lg:rounded-xl md:lg:border-slate-200 dark:md:lg:border-gray-600">
                            <input
                              type="text"
                              placeholder="Enter your name"
                              defaultValue={userName}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 md:lg:px-4 md:lg:py-3 md:lg:text-base md:lg:rounded-xl md:lg:border-slate-300 dark:md:lg:border-gray-600 md:lg:focus:ring-indigo-500"
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
                      <div className="p-2 md:lg:p-3">
                        {/* Settings Link */}
                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 font-medium md:lg:gap-4 md:lg:px-4 md:lg:py-3 md:lg:text-base md:lg:font-semibold md:lg:rounded-xl md:lg:hover:bg-indigo-50 dark:md:lg:hover:bg-gray-700/50 md:lg:hover:text-indigo-700 dark:md:lg:hover:text-indigo-300"
                        >
                          {theme === 'dark' ? (
                            <>
                              <Sun className="w-4 h-4 text-yellow-500 md:lg:w-5 md:lg:h-5" />
                              Switch to Light Mode
                            </>
                          ) : (
                            <>
                              <Moon className="w-4 h-4 text-indigo-500 md:lg:w-5 md:lg:h-5" />
                              Switch to Dark Mode
                            </>
                          )}
                        </button>
                        
                        {/* Divider */}
                        <div className="my-2 border-t border-gray-200 dark:border-gray-700 md:lg:my-3 md:lg:border-slate-200 dark:md:lg:border-gray-600"></div>
                        
                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium md:lg:gap-4 md:lg:px-4 md:lg:py-3 md:lg:text-base md:lg:font-semibold md:lg:rounded-xl md:lg:hover:bg-red-50 dark:md:lg:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 md:lg:w-5 md:lg:h-5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-full p-4 border border-purple-400 hover:border-purple-300"
        title="Enter Focus Mode"
      >
        <Shield className="w-6 h-6" />
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
