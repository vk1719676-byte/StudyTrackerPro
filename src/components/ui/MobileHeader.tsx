import React from 'react';
import { BookOpen, Zap } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden sticky top-0 z-50 opacity-0 pointer-events-none">
      {/* Main header - completely invisible */}
      <div className="bg-transparent text-transparent shadow-none">
        <div className="px-4 py-3">
          <div className="text-center space-y-2">
            {/* Logo and title - invisible */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-transparent" />
              </div>
              <h1 className="text-lg font-bold text-transparent">
                Study Tracker Pro
              </h1>
            </div>
            
            {/* Powered by badge - invisible */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 px-3 py-1 bg-transparent rounded-full">
                <Zap className="w-3 h-3 text-transparent" />
                <span className="text-xs font-medium text-transparent">
                  Powered By TRMS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
