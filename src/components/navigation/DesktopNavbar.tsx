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

      {/* Main Navigation Bar with enhanced styling */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 md:bg-gradient-to-r md:from-white md:via-blue-50/30 md:to-purple-50/30 md:dark:from-gray-800 md:dark:via-blue-900/10 md:dark:to-purple-900/10 md:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-18 lg:h-20">
            
            {/* Logo and Brand section */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group md:hover:transform md:hover:scale-105"
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

            {/* Center Navigation with proper spacing */}
            <div className="flex-1 flex justify-center px-8 md:px-12 lg:px-16">
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/60 dark:bg-gray-700/40 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/30 dark:border-gray-600/30">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-300 hover:scale-105 hover:shadow-xl
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl transform scale-105 border border-purple-300/50 backdrop-blur-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-purple-50/70 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:backdrop-blur-sm hover:border hover:border-blue-200/30'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 drop-shadow-sm" />
                    <span className="hidden lg:inline">{label}</span>
                    <span className="md:inline lg:hidden font-semibold">{label.length > 7 ? label.substring(0, 5) + '...' : label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Enhanced Profile Section with improved spacing and design */}
            <div className="flex items-center gap-4 md:gap-6 lg:gap-8 flex-shrink-0">
              
              {/* Theme Toggle with enhancement */}
              <button
                onClick={toggleTheme}
                className="hidden sm:flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500 drop-shadow-sm group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-500 drop-shadow-sm group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Enhanced Profile Avatar Section */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`
                    group flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                    bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 
                    backdrop-blur-xl shadow-xl border border-white/50 dark:border-gray-600/50
                    hover:shadow-2xl hover:border-blue-200/60 dark:hover:border-blue-500/40
                    ${showProfileDropdown 
                      ? 'shadow-2xl scale-105 bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-blue-900/40 dark:to-purple-900/40 border-blue-300/60 dark:border-blue-500/60' 
                      : 'hover:from-blue-50/60 hover:to-purple-50/60 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30'
                    }
                  `}
                  title="Profile Menu"
                >
                  {/* Enhanced Avatar Circle */}
                  <div className="relative">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Profile"
                        className={`
                          w-10 h-10 md:w-11 md:h-11 rounded-full object-cover transition-all duration-300 
                          border-3 shadow-lg group-hover:shadow-xl
                          ${showProfileDropdown 
                            ? 'border-blue-400 shadow-blue-200/50 dark:shadow-blue-800/50 scale-110 ring-4 ring-blue-200/30 dark:ring-blue-700/30' 
                            : 'border-white dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 group-hover:shadow-blue-100/50 dark:group-hover:shadow-blue-800/30 group-hover:scale-105'
                          }
                        `}
                      />
                    ) : (
                      <div className={`
                        w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center 
                        text-sm md:text-base font-bold transition-all duration-300 shadow-lg
                        ${showProfileDropdown 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-110 ring-4 ring-blue-200/40 dark:ring-blue-700/40' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white group-hover:from-blue-600 group-hover:to-purple-700 group-hover:shadow-xl group-hover:scale-105'
                        }
                      `}>
                        {getUserInitials(user?.email)}
                      </div>
                    )}
                    
                    {/* Enhanced Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 border-2 border-white dark:border-gray-800 rounded-full shadow-lg">
                      <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0.5 bg-gradient-to-r from-emerald-300 to-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    
                    {/* Hover Effect Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300 pointer-events-none"></div>
                  </div>
                  
                  {/* Enhanced User Info */}
                  <div className="hidden md:flex flex-col items-start min-w-0 flex-1">
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {getDisplayName().length > 12 ? getDisplayName().substring(0, 10) + '...' : getDisplayName()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditProfile(!showEditProfile);
                        }}
                        className="p-1 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 rounded-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                        title="Edit name"
                      >
                        <Edit3 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-md border border-amber-300/50">
                        PRO
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-sm animate-pulse"></div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Chevron Icon */}
                  <ChevronDown className={`
                    w-4 h-4 transition-all duration-300 text-gray-500 dark:text-gray-400 
                    group-hover:text-blue-500 dark:group-hover:text-blue-400
                    ${showProfileDropdown ? 'rotate-180 scale-110 text-blue-600 dark:text-blue-400' : 'group-hover:scale-110'}
                  `} />
                </button>
                
                {/* Enhanced Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-4 w-84 bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 z-50 transform transition-all duration-300 origin-top-right overflow-hidden backdrop-blur-xl">
                    {/* Enhanced User Info Header */}
                    <div className="relative p-6 bg-gradient-to-br from-blue-50/90 via-purple-50/70 to-pink-50/50 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/10 border-b border-gray-200/60 dark:border-gray-700/60">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10"></div>
                      
                      <div className="relative flex items-center gap-4">
                        {/* Enhanced Avatar with Upload Functionality */}
                        <div className="relative group">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt="Profile"
                              className="w-16 h-16 md:w-18 md:h-18 rounded-2xl object-cover border-3 border-white dark:border-gray-700 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                            />
                          ) : (
                            <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-xl group-hover:shadow-2xl transition-all duration-300">
                              {getUserInitials(user?.email)}
                            </div>
                          )}
                          
                          {/* Enhanced Upload Overlay */}
                          <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-1">
                              <Camera className="w-5 h-5 text-white drop-shadow-lg" />
                              <span className="text-xs text-white font-medium">Change</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 rounded-2xl cursor-pointer"
                            title="Change avatar"
                          />
                          
                          {/* Enhanced Status Ring */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 border-3 border-white dark:border-gray-800 rounded-full shadow-lg">
                            <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-1 bg-gradient-to-r from-emerald-300 to-green-400 rounded-full animate-ping opacity-75"></div>
                          </div>
                        </div>
                        
                        {/* Enhanced User Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                              {getDisplayName()}
                            </h3>
                            <button
                              onClick={() => setShowEditProfile(!showEditProfile)}
                              className="p-1.5 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                              title="Edit name"
                            >
                              <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2 font-medium">
                            {user?.email}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-900 shadow-lg border border-amber-300/50">
                              PRO MEMBER
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Edit Profile Form */}
                      {showEditProfile && (
                        <div className="relative mt-4 p-4 bg-white/80 dark:bg-gray-700/80 rounded-xl border border-gray-200/60 dark:border-gray-600/60 backdrop-blur-sm shadow-lg">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter your name"
                              defaultValue={userName}
                              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 backdrop-blur-sm shadow-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleNameUpdate((e.target as HTMLInputElement).value);
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleNameUpdate(input.value);
                              }}
                              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Menu Items */}
                    <div className="p-3">
                      {/* Theme Toggle */}
                      <button
                        onClick={() => {
                          toggleTheme();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                      >
                        {theme === 'dark' ? (
                          <>
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg shadow-md">
                              <Sun className="w-4 h-4 text-yellow-900" />
                            </div>
                            <span>Switch to Light Mode</span>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md">
                              <Moon className="w-4 h-4 text-white" />
                            </div>
                            <span>Switch to Dark Mode</span>
                          </>
                        )}
                      </button>
                      
                      {/* Avatar Management */}
                      {userAvatar && (
                        <button
                          onClick={() => {
                            handleRemoveAvatar();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-md">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span>Remove Avatar</span>
                        </button>
                      )}
                      
                      {/* Divider */}
                      <div className="my-3 border-t border-gray-200/60 dark:border-gray-700/60"></div>
                      
                      {/* Enhanced Logout Button */}
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/20 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200">
                          <LogOut className="w-4 h-4 text-white" />
                        </div>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
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

      {/* Enhanced Focus Mode Button */}
      <Button
        onClick={() => setShowFocusMode(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-3 rounded-2xl p-4 md:p-5 border-2 border-purple-400/50 hover:border-purple-300/70 backdrop-blur-sm group"
        title="Enter Focus Mode"
      >
        <div className="relative">
          <Shield className="w-6 h-6 md:w-7 md:h-7 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-60"></div>
        </div>
        <span className="ml-3 font-bold hidden sm:inline text-sm md:text-base drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
          Focus Mode
        </span>
      </Button>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
