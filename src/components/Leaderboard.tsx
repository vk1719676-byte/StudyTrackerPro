import React, { useState, useEffect } from 'react';
import { Crown, Trophy, Award, Medal, Star, Zap, ChevronUp } from 'lucide-react';
import { Card } from './ui/Card';
import { getLeaderboardData, LeaderboardUser } from '../services/leaderboard';

const BadgeIcon: React.FC<{ badge: LeaderboardUser['badge']; className?: string }> = ({ badge, className = "" }) => {
  switch (badge) {
    case 'diamond':
      return <Crown className={`text-cyan-400 ${className}`} />;
    case 'platinum':
      return <Trophy className={`text-gray-300 ${className}`} />;
    case 'gold':
      return <Trophy className={`text-yellow-400 ${className}`} />;
    case 'silver':
      return <Award className={`text-gray-400 ${className}`} />;
    case 'bronze':
      return <Medal className={`text-amber-600 ${className}`} />;
    case 'elite':
      return <Star className={`text-purple-400 ${className}`} />;
    default:
      return <Zap className={`text-blue-400 ${className}`} />;
  }
};

const getBadgeColors = (badge: LeaderboardUser['badge']) => {
  switch (badge) {
    case 'diamond':
      return {
        bg: 'from-cyan-400 to-blue-500',
        border: 'border-cyan-400/30',
        glow: 'shadow-cyan-400/20'
      };
    case 'platinum':
      return {
        bg: 'from-gray-300 to-gray-500',
        border: 'border-gray-400/30',
        glow: 'shadow-gray-400/20'
      };
    case 'gold':
      return {
        bg: 'from-yellow-400 to-orange-500',
        border: 'border-yellow-400/30',
        glow: 'shadow-yellow-400/20'
      };
    case 'silver':
      return {
        bg: 'from-gray-400 to-gray-600',
        border: 'border-gray-400/30',
        glow: 'shadow-gray-400/20'
      };
    case 'bronze':
      return {
        bg: 'from-amber-600 to-orange-700',
        border: 'border-amber-600/30',
        glow: 'shadow-amber-600/20'
      };
    case 'elite':
      return {
        bg: 'from-purple-400 to-pink-500',
        border: 'border-purple-400/30',
        glow: 'shadow-purple-400/20'
      };
    default:
      return {
        bg: 'from-blue-400 to-indigo-500',
        border: 'border-blue-400/30',
        glow: 'shadow-blue-400/20'
      };
  }
};

export const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardData();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Study Leaderboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Top performers in the community
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full text-white">
          <ChevronUp className="w-4 h-4" />
          <span className="text-sm font-medium">Live Rankings</span>
        </div>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((user, index) => {
          const badgeColors = getBadgeColors(user.badge);
          const isTop3 = index < 3;
          
          return (
            <div
              key={user.id}
              className={`group transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                hoveredUser === user.id ? 'z-10' : ''
              }`}
              onMouseEnter={() => setHoveredUser(user.id)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <div className={`relative p-6 rounded-2xl bg-gradient-to-r ${
                isTop3 
                  ? 'from-white to-gray-50 dark:from-gray-800 dark:to-gray-750' 
                  : 'from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800'
              } border ${badgeColors.border} shadow-lg ${badgeColors.glow} ${
                hoveredUser === user.id ? 'shadow-2xl transform-gpu' : ''
              }`}>
                
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${badgeColors.bg} rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900 ${
                    isTop3 ? 'animate-pulse' : ''
                  }`}>
                    <span className="text-white font-bold text-lg">
                      {user.rank}
                    </span>
                  </div>
                </div>

                {/* Special effects for top 3 */}
                {isTop3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-2xl animate-pulse"></div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* User Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`p-3 bg-gradient-to-r ${badgeColors.bg} rounded-xl shadow-lg`}>
                        <BadgeIcon badge={user.badge} className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                            {user.displayName}
                          </h4>
                          {isTop3 && (
                            <div className={`px-3 py-1 bg-gradient-to-r ${badgeColors.bg} rounded-full`}>
                              <span className="text-xs font-bold text-white uppercase tracking-wide">
                                {user.badge}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatTime(user.totalStudyTime)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Study Time
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {user.totalSessions}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Sessions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                          {user.averageEfficiency.toFixed(1)}
                          <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Efficiency
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="sm:hidden">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatTime(user.totalStudyTime)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user.totalSessions} sessions
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Study Time */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Study Progress
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round((user.totalStudyTime / Math.max(...leaderboardData.map(u => u.totalStudyTime))) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${badgeColors.bg} rounded-full transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${(user.totalStudyTime / Math.max(...leaderboardData.map(u => u.totalStudyTime))) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboardData.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No leaderboard data available
          </h4>
          <p className="text-gray-500 dark:text-gray-500">
            Be the first to start studying and claim the top spot!
          </p>
        </div>
      )}
    </Card>
  );
};
