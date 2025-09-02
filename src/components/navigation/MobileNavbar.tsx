import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Upload, Shield, Menu, Users } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/exams', label: 'Exams', icon: Calendar },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/sessions', label: 'Sessions', icon: Clock },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Floating Focus Mode Button */}
      <button
        onClick={() => setShowFocusMode(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
        title="Focus Mode"
      >
        <Shield className="w-5 h-5" />
        <span className="text-sm font-medium">Enter Focus Mode</span>
      </button>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-0 flex-1
                transition-all duration-200
                ${location.pathname === path
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${location.pathname === path ? 'scale-110' : ''} transition-transform duration-200`} />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
