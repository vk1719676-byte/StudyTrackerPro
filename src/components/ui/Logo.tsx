import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} relative bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center`}>
          <BookOpen className="w-1/2 h-1/2 text-white" />
          <Clock className="w-1/4 h-1/4 text-white absolute -top-1 -right-1 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full p-0.5" />
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
              Study Tracker Pro
            </span>
            {size === 'lg' && (
              <span className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
                Study Smarter, Not Harder!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};