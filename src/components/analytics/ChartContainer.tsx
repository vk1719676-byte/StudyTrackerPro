import React from 'react';
import { Card } from '../ui/Card';

interface ChartContainerProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className = "" 
}) => {
  return (
    <Card className={`p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl ${className}`}>
      <div id={id}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    </Card>
  );
};
