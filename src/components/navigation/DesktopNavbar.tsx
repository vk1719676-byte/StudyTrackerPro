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

      {/* Main Navigation Bar with enhanced tablet styling */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 md:bg-gradient-to-r md:from-white md:via-blue-50/30 md:to-purple-50/30 md:dark:from-gray-800 md:dark:via-blue-900/10 md:dark:to-purple-900/10 md:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-18 lg:h-20">
            
            {/* Logo and Brand with enhanced tablet styling */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group mr-8 md:mr-6 lg:mr-12 md:hover:transform md:hover:scale-105"
              >
                <div className="md:relative md:p-1 md:rounded-full md:bg-gradient-to-br md:from-blue-500/10 md:to-purple-500/10 md:backdrop-blur-sm">
                  <Logo size="md" showText={false} />
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex flex-col">
                    <h1 className="text-xl md:text-lg lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight md:drop-shadow-sm">
                      Study Tracker
                    </h1>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase -mt-1">
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-1 md:relative">
                    <span className="inline-flex items-center px-3 py-1 md:px-2.5 md:py-0.5 lg:px-3 lg:py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-xl transform hover:scale-105 transition-all duration-200 border border-amber-300 hover:shadow-2xl md:shadow-2xl md:border-2 md:border-amber-200 md:hover:rotate-1">
                      PRO
                    </span>
                    <div className="flex gap-1 md:gap-0.5 lg:gap-1">
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-1 lg:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse md:shadow-md"></div>
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-1 lg:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-75 md:shadow-md"></div>
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-1 lg:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse delay-150 md:shadow-md"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center justify-between flex-1">
              {/* Desktop Navigation with enhanced tablet styling */}
              <div className="hidden md:flex items-center md:space-x-0.5 lg:space-x-1 xl:space-x-2 md:bg-white/50 md:dark:bg-gray-700/30 md:backdrop-blur-md md:rounded-2xl md:p-1.5 md:shadow-2xl md:border md:border-white/20 md:dark:border-gray-600/30">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 md:gap-1.5 lg:gap-2 px-3 md:px-3 lg:px-3 xl:px-4 py-2 md:py-2.5 lg:py-2 rounded-xl text-sm md:text-xs lg:text-sm font-medium
                      transition-all duration-300 hover:scale-105 hover:shadow-lg md:hover:shadow-xl md:hover:backdrop-blur-lg
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300 md:shadow-2xl md:border-2 md:border-purple-200/50 md:backdrop-blur-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md md:hover:from-blue-50/70 md:hover:to-purple-50/70 md:dark:hover:from-blue-900/30 md:dark:hover:to-purple-900/30 md:hover:backdrop-blur-sm md:hover:border md:hover:border-blue-200/30'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 md:drop-shadow-sm" />
                    <span className="hidden lg:inline">{label}</span>
                    <span className="md:inline lg:hidden md:font-semibold">{label.length > 7 ? label.substring(0, 5) + '...' : label}</span>
                  </Link>
                ))}
              </div>

              {/* Right Side Actions with enhanced tablet styling */}
              <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
                {/* Theme Toggle with tablet enhancements */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={theme === 'dark' ? Sun : Moon}
                  onClick={toggleTheme}
                  className="p-2 md:p-2.5 lg:p-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-110 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md md:shadow-lg md:bg-white/60 md:dark:bg-gray-700/40 md:backdrop-blur-sm md:border md:border-white/30 md:dark:border-gray-600/30 md:hover:shadow-xl md:hover:backdrop-blur-md md:hover:rotate-12"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                />
                
                {/* Enhanced Profile Button with tablet-specific styling */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`
                      flex items-center gap-2 md:gap-2 lg:gap-2 px-3 md:px-4 lg:px-3 py-2 md:py-2.5 lg:py-2 rounded-xl transition-all duration-300
                      hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                      md:shadow-lg md:bg-white/70 md:dark:bg-gray-700/40 md:backdrop-blur-sm md:border md:border-white/40 md:dark:border-gray-600/30
                      ${showProfileDropdown 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 shadow-lg scale-105 md:shadow-2xl md:backdrop-blur-md md:border-2 md:border-blue-200/50' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md md:hover:shadow-xl md:hover:backdrop-blur-md md:hover:border-2 md:hover:border-blue-200/30'
                      }
                    `}
                    title="Profile Menu"
                  >
                    {/* Avatar Circle with tablet enhancements */}
                    <div className="relative">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="Profile"
                          className={`
                            w-8 h-8 md:w-9 md:h-9 lg:w-8 lg:h-8 rounded-full object-cover transition-all duration-200 border-2 md:shadow-lg
                            ${showProfileDropdown 
                              ? 'border-blue-500 shadow-lg scale-105 md:border-3 md:border-blue-400 md:shadow-xl' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 shadow-md md:border-blue-200 md:hover:border-blue-300 md:hover:shadow-xl'
                            }
                          `}
                        />
                      ) : (
                        <div className={`
                          w-8 h-8 md:w-9 md:h-9 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 md:shadow-lg
                          ${showProfileDropdown 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg md:shadow-xl md:from-blue-400 md:to-purple-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md md:hover:shadow-xl md:hover:from-blue-400 md:hover:to-purple-500'
                          }
                        `}>
                          {getUserInitials(user?.email)}
                        </div>
                      )}
                      {/* Online Status Indicator with tablet enhancement */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 lg:w-3 lg:h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse md:shadow-md md:bg-gradient-to-r md:from-green-400 md:to-emerald-400"></div>
                    </div>
                    
                    {/* User Info with tablet-specific styling */}
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm md:text-sm lg:text-sm font-medium leading-tight md:font-semibold md:drop-shadow-sm">
                        {getDisplayName().length > 10 ? getDisplayName().substring(0, 8) + '...' : getDisplayName()}
                      </span>
                      <div className="flex items-center gap-1 md:gap-1.5 lg:gap-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 lg:px-1.5 lg:py-0.5 rounded-full text-xs md:text-xs lg:text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 md:shadow-md md:border md:border-amber-300/50">
                          PRO
                        </span>
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-1 lg:h-1 bg-green-400 rounded-full md:shadow-sm md:bg-gradient-to-r md:from-green-400 md:to-emerald-400"></div>
                        <span className="text-xs md:text-xs lg:text-xs text-green-600 dark:text-green-400 font-medium md:font-semibold md:drop-shadow-sm">Online</span>
                      </div>
                    </div>
                    
                    {/* Chevron Icon with tablet animation */}
                    <ChevronDown className={`w-4 h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 transition-transform duration-300 md:drop-shadow-sm ${showProfileDropdown ? 'rotate-180 md:scale-110' : 'md:hover:scale-110'}`} />
                  </button>
                  
                  {/* Enhanced Profile Dropdown with tablet-specific styling */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-80 md:w-72 lg:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-300 origin-top-right overflow-hidden md:backdrop-blur-xl md:bg-white/95 md:dark:bg-gray-800/95 md:border-2 md:border-white/30 md:dark:border-gray-600/30 md:shadow-3xl">
                      {/* User Info Header with tablet enhancements */}
                      <div className="p-4 md:p-5 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700 md:bg-gradient-to-br md:from-blue-50/80 md:via-purple-50/60 md:to-pink-50/40 md:dark:from-blue-900/30 md:dark:via-purple-900/20 md:dark:to-pink-900/10 md:backdrop-blur-sm">
                        <div className="flex items-center gap-3 md:gap-4 lg:gap-3">
                          <div className="relative">
                            {userAvatar ? (
                              <img
                                src={userAvatar}
                                alt="Profile"
                                className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white shadow-lg md:border-3 md:shadow-xl"
                              />
                            ) : (
                              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg md:text-xl md:shadow-xl">
                                {getUserInitials(user?.email)}
                              </div>
                            )}
                            {/* Camera overlay for avatar upload with tablet enhancement */}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 md:hover:backdrop-blur-sm md:hover:bg-opacity-60"
                              title="Change avatar"
                            >
                              <Camera className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-white drop-shadow-lg" />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 md:gap-3 lg:gap-2">
                              <p className="text-sm md:text-base lg:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate md:font-bold">
                                {getDisplayName()}
                              </p>
                              <button
                                onClick={() => setShowEditProfile(!showEditProfile)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all duration-200 md:p-1.5 md:hover:bg-blue-100 md:dark:hover:bg-blue-900/30 md:hover:scale-110"
                                title="Edit name"
                              >
                                <Edit3 className="w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 text-gray-500 md:text-blue-500" />
                              </button>
                            </div>
                            <p className="text-xs md:text-sm lg:text-xs text-gray-500 dark:text-gray-400 truncate md:font-medium">
                              {user?.email}
                            </p>
                            <div className="flex items-center gap-1 md:gap-2 lg:gap-1 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 lg:px-2 lg:py-0.5 rounded-full text-xs md:text-xs lg:text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 md:shadow-lg md:border md:border-amber-300/50">
                                PRO
                              </span>
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-1.5 lg:h-1.5 bg-green-400 rounded-full md:shadow-md md:bg-gradient-to-r md:from-green-400 md:to-emerald-400"></div>
                              <span className="text-xs md:text-sm lg:text-xs text-green-600 dark:text-green-400 font-medium md:font-semibold">Online</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit Profile Form with tablet styling */}
                        {showEditProfile && (
                          <div className="mt-3 md:mt-4 lg:mt-3 p-3 md:p-4 lg:p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 md:backdrop-blur-sm md:bg-white/90 md:dark:bg-gray-700/90 md:border-2 md:border-blue-200/50 md:shadow-lg">
                            <input
                              type="text"
                              placeholder="Enter your name"
                              defaultValue={userName}
                              className="w-full px-3 py-2 md:px-4 md:py-3 lg:px-3 lg:py-2 text-sm md:text-sm lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 md:rounded-xl md:border-2 md:focus:ring-blue-400 md:focus:shadow-lg md:transition-all md:duration-200"
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
                      
                      {/* Menu Items with tablet enhancements */}
                      <div className="p-2 md:p-3 lg:p-2">
                        {/* Settings Link */}
                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 md:gap-4 lg:gap-3 px-3 py-2 md:px-4 md:py-3 lg:px-3 lg:py-2 text-sm md:text-sm lg:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 font-medium md:hover:bg-gradient-to-r md:hover:from-blue-50 md:hover:to-purple-50 md:dark:hover:from-blue-900/20 md:dark:hover:to-purple-900/20 md:hover:scale-105 md:hover:shadow-lg"
                        >
                          {theme === 'dark' ? (
                            <>
                              <Sun className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-yellow-500 md:drop-shadow-sm" />
                              Switch to Light Mode
                            </>
                          ) : (
                            <>
                              <Moon className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-indigo-500 md:drop-shadow-sm" />
                              Switch to Dark Mode
                            </>
                          )}
                        </button>
                        
                        {/* Divider with tablet styling */}
                        <div className="my-2 md:my-3 lg:my-2 border-t border-gray-200 dark:border-gray-700 md:border-gradient md:border-gray-200/50"></div>
                        
                        {/* Logout Button with tablet enhancement */}
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full flex items-center gap-3 md:gap-4 lg:gap-3 px-3 py-2 md:px-4 md:py-3 lg:px-3 lg:py-2 text-sm md:text-sm lg:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 font-medium md:hover:bg-gradient-to-r md:hover:from-red-50 md:hover:to-red-100/80 md:dark:hover:from-red-900/30 md:dark:hover:to-red-800/20 md:hover:scale-105 md:hover:shadow-lg"
                        >
                          <LogOut className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 md:drop-shadow-sm" />
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

      {/* Fixed Focus Mode Button with tablet enhancement */}
      <Button
        onClick={() => setShowFocusMode(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-full p-4 md:p-5 lg:p-4 border border-purple-400 hover:border-purple-300 md:shadow-3xl md:bg-gradient-to-br md:from-purple-600 md:via-blue-600 md:to-indigo-600 md:hover:from-purple-500 md:hover:via-blue-500 md:hover:to-indigo-500 md:backdrop-blur-sm md:border-2 md:border-purple-300/50 md:hover:rotate-6"
        title="Enter Focus Mode"
      >
        <Shield className="w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 md:drop-shadow-lg" />
        <span className="ml-2 md:ml-2.5 lg:ml-2 font-semibold hidden sm:inline text-sm md:text-base lg:text-sm md:drop-shadow-sm">Focus Mode</span>
      </Button>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
