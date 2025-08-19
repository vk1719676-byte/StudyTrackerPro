import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Zap, 
  Menu, 
  Bell, 
  Settings, 
  Search, 
  User, 
  X,
  Clock,
  Wifi,
  WifiOff,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle?: () => void;
  notificationCount?: number;
  userName?: string;
  userAvatar?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  notificationCount = 3,
  userName = "John Doe",
  userAvatar
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const notifications = [
    { id: 1, title: "Study session reminder", time: "5 min ago", type: "reminder" },
    { id: 2, title: "New assignment added", time: "1 hour ago", type: "info" },
    { id: 3, title: "Weekly goal achieved!", time: "2 hours ago", type: "success" }
  ];

  return (
    <div className="md:hidden relative overflow-hidden sticky top-0 z-50">
      {/* Background with enhanced gradient */}
      <div className={`${isDarkMode 
        ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600' 
        : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600'} text-white transition-all duration-500`}>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,transparent_40%)]"></div>
        
        {/* Main content */}
        <div className="relative px-4 py-2">
          {/* Top row with menu, time, and status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu */}
              <button
                onClick={onMenuToggle}
                className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95"
              >
                <Menu className="w-4 h-4 text-white" />
              </button>

              {/* Connection Status */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isOnline 
                  ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-200 border border-red-400/30'
              }`}>
                {isOnline ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/25">
              <Clock className="w-3 h-3 text-white/90" />
              <span className="text-xs font-medium text-white/95">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>

          {/* Main header section */}
          <div className="text-center space-y-1">
            {/* Logo and title section */}
            <div className="flex items-center justify-center gap-2">
              <div className="relative group">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/25">
                  <BookOpen className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent drop-shadow-sm">
                  Study Tracker Pro
                </h1>
              </div>
            </div>
            
            {/* Powered by section */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/25 transition-all duration-300 hover:bg-white/20">
                <Zap className="w-2.5 h-2.5 text-orange-300 animate-pulse" />
                <span className="text-xs font-medium text-white/95 tracking-wide">
                  Powered By TRMS
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95"
              >
                {showSearch ? (
                  <X className="w-4 h-4 text-white" />
                ) : (
                  <Search className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-white" />
                ) : (
                  <Moon className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95 relative"
                >
                  <Bell className="w-4 h-4 text-white" />
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'info' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-4 h-4 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                  <ChevronDown className="w-3 h-3 text-white" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">{userName}</p>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {showSearch && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search studies, notes, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
      </div>
      
      {/* Subtle shadow */}
      <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-black/8 to-transparent pointer-events-none"></div>

      {/* Click outside handler for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};
