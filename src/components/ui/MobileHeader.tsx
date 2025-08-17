import React from 'react';
import { BookOpen, Zap } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden relative overflow-hidden sticky top-0 z-50">
      {/* Background with enhanced gradient */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,transparent_40%)]"></div>
        
        {/* Main content */}
        <div className="relative px-4 py-2">
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
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
      </div>
      
      {/* Subtle shadow */}
      <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-black/8 to-transparent pointer-events-none"></div>
    </div>
  );
};