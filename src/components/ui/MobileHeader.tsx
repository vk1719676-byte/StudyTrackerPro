import React from 'react';
import { BookOpen, Zap } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden sticky top-0 z-50">
      {/* Main header */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg">
        <div className="px-4 py-3">
          <div className="text-center space-y-2">
            {/* Logo and title */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">
              </h1>
            </div>
            
            {/* Powered by badge */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 px-3 py-1 bg-white/15 rounded-full backdrop-blur-sm">
                <Zap className="w-3 h-3 text-orange-300" />
                <span className="text-xs font-medium text-white">
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
