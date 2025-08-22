import React from 'react';
import { Zap } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <div className="block md:hidden sticky top-0 z-50">
      {/* Compact golden header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-amber-200/30 shadow-sm">
        <div className="px-4 py-2">
          {/* Centrally aligned golden branding */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400/20 via-yellow-300/20 to-amber-400/20 rounded-full border border-amber-300/40 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 relative overflow-hidden">
              {/* Golden shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer"></div>
              <div className="relative flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 drop-shadow-sm" />
                <span className="text-xs font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  Powered By TRMS
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Golden progress line */}
        <div className="h-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 opacity-70">
          <div className="h-full bg-gradient-to-r from-transparent via-amber-200/60 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
