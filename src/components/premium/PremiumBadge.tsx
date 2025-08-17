import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 
      bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
      text-white font-bold rounded-full shadow-lg
      ${sizeClasses[size]} ${className}
    `}>
      <Crown className={`${iconSizes[size]} animate-pulse`} />
      {showText && <span>Premium</span>}
      <Sparkles className={`${iconSizes[size]} animate-pulse`} />
    </div>
  );
};