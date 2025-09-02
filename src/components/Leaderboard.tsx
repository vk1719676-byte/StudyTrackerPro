import React, { useState, useEffect } from 'react';
import { Crown, Trophy, Award, TrendingUp, Clock, Target, Users, Medal, Star, BarChart3 } from 'lucide-react';
import { Card } from './ui/Card';
import { getAllUserSessions, getAllUserProfiles } from '../services/firestore';
import { StudySession } from '../types';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  totalStudyTime: number;
  averageEfficiency: number;
  sessionCount: number;
  consistencyScore: number;
  lastActive: Date;
}

interface LeaderboardProps {
  currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState<'time' | 'efficiency' | 'consistency'>('time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getAllUserSessions((sessions) => {
      calculateLeaderboard(sessions);
    });

    return unsubscribe;
  }, []);

  const calculateLeaderboard = async (sessions: StudySession[]) => {
    try {
      const userProfiles = await getAllUserProfiles();
      const userMap = new Map(userProfiles.map(profile => [profile.id, profile]));
      
      // Group sessions by user
      const userSessionsMap = new Map<string, StudySession[]>();
      sessions.forEach(session => {
        if (!userSessionsMap.has(session.userId)) {
          userSessionsMap.set(session.userId, []);
        }
        userSessionsMap.get(session.userId)!.push(session);
      });

      // Calculate metrics for each user
      const leaderboardUsers: LeaderboardUser[] = [];
      
      userSessionsMap.forEach((userSessions, userId) => {
        const profile = userMap.get(userId);
        if (!profile) return;

        const totalStudyTime = userSessions.reduce((total, session) => total + session.duration, 0);
        const averageEfficiency = userSessions.reduce((total, session) => total + session.efficiency, 0) / userSessions.length;
        
        // Calculate consistency score (sessions in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSessions = userSessions.filter(session => session.date >= thirtyDaysAgo);
        const consistencyScore = Math.min(recentSessions.length / 10, 1) * 100; // Max 10 sessions for 100% consistency
        
        const lastActive = userSessions.length > 0 
          ? new Date(Math.max(...userSessions.map(s => s.date.getTime())))
          : new Date(0);

        leaderboardUsers.push({
          id: userId,
          name: profile.name || profile.email?.split('@')[0] || 'Anonymous',
          email: profile.email || '',
          totalStudyTime,
          averageEfficiency,
          sessionCount: userSessions.length,
          consistencyScore,
          lastActive
        });
      });

      setLeaderboardData(leaderboardUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error calculating leaderboard:', error);
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-5 h-5 text-yellow-900" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
          <Medal className="w-5 h-5 text-gray-900" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <Award className="w-5 h-5 text-orange-900" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">{rank}</span>
      </div>
    );
  };

  const getSortedUsers = () => {
    const sortedUsers = [...leaderboardData];
    
    switch (activeTab) {
      case 'time':
        return sortedUsers.sort((a, b) => b.totalStudyTime - a.totalStudyTime).slice(0, 5);
      case 'efficiency':
        return sortedUsers.sort((a, b) => b.averageEfficiency - a.averageEfficiency).slice(0, 5);
      case 'consistency':
        return sortedUsers.sort((a, b) => b.consistencyScore - a.consistencyScore).slice(0, 5);
      default:
        return sortedUsers.slice(0, 5);
    }
  };

  const getProgressValue = (user: LeaderboardUser, maxValue: number) => {
    switch (activeTab) {
      case 'time':
        return (user.totalStudyTime / maxValue) * 100;
      case 'efficiency':
        return (user.averageEfficiency / 5) * 100;
      case 'consistency':
        return user.consistencyScore;
      default:
        return 0;
    }
  };

  const getMetricValue = (user: LeaderboardUser) => {
    switch (activeTab) {
      case 'time':
        return formatDuration(user.totalStudyTime);
      case 'efficiency':
        return `${user.averageEfficiency.toFixed(1)}/5`;
      case 'consistency':
        return `${Math.round(user.consistencyScore)}%`;
      default:
        return '';
    }
  };

  const getMetricLabel = () => {
    switch (activeTab) {
      case 'time':
        return 'Total Study Time';
      case 'efficiency':
        return 'Avg. Efficiency';
      case 'consistency':
        return 'Consistency Score';
      default:
        return '';
    }
  };

  const sortedUsers = getSortedUsers();
  const maxValue = sortedUsers.length > 0 ? 
    (activeTab === 'time' ? sortedUsers[0].totalStudyTime :
     activeTab === 'efficiency' ? 5 :
     100) : 1;

  if (loading) {
    return (
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Leaderboard</h2>
              <p className="text-purple-100">Top performers this month</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-purple-100">
            <Users className="w-4 h-4" />
            <span className="text-sm">{leaderboardData.length} users</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setActiveTab('time')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'time'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Study Time
          </button>
          <button
            onClick={() => setActiveTab('efficiency')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'efficiency'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Efficiency
          </button>
          <button
            onClick={() => setActiveTab('consistency')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'consistency'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Consistency
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6">
        {sortedUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No data available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start studying to see the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.id === currentUserId;
              const progressValue = getProgressValue(user, maxValue);
              
              return (
                <div
                  key={user.id}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isCurrentUser
                      ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  {/* Current user indicator */}
                  {isCurrentUser && (
                    <div className="absolute -top-2 left-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      You
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      {getRankBadge(rank)}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              {user.sessionCount} sessions
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {user.averageEfficiency.toFixed(1)} avg
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {getMetricValue(user)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {getMetricLabel()}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ease-out ${
                              rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              'bg-gradient-to-r from-purple-400 to-blue-500'
                            }`}
                            style={{ 
                              width: `${progressValue}%`,
                              animationDelay: `${index * 200}ms`
                            }}
                          ></div>
                        </div>
                        <div className="absolute -top-1 right-0 text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(progressValue)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatDuration(user.totalStudyTime)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Study Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {user.averageEfficiency.toFixed(1)}/5
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {Math.round(user.consistencyScore)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Consistency</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
