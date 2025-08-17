import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = false 
}) => {
  return (
    <div className={`
      ${gradient 
        ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' 
        : 'bg-white dark:bg-gray-800'
      }
      border border-gray-200 dark:border-gray-700
      rounded-xl shadow-sm
      ${hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};