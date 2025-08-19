import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  isActive?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 200,
  strokeWidth = 8,
  isActive = false
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90 transition-all duration-1000"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isActive ? '#ffffff' : '#3b82f6'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${
            isActive ? 'drop-shadow-sm' : ''
          }`}
          style={{
            filter: isActive ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' : 'none'
          }}
        />
      </svg>
      
      {/* Progress indicator dots */}
      {isActive && (
        <div className="absolute inset-0">
          <div
            className="absolute w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"
            style={{
              top: `${50 + 45 * Math.sin((percentage / 100) * 2 * Math.PI - Math.PI / 2)}%`,
              left: `${50 + 45 * Math.cos((percentage / 100) * 2 * Math.PI - Math.PI / 2)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      )}
    </div>
  );
};
