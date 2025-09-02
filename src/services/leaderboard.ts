import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface LeaderboardUser {
  id: string;
  email: string;
  displayName?: string;
  totalStudyTime: number;
  totalSessions: number;
  averageEfficiency: number;
  rank: number;
  badge: 'gold' | 'silver' | 'bronze' | 'diamond' | 'platinum' | 'elite' | 'regular';
}

export const getLeaderboardData = async (): Promise<LeaderboardUser[]> => {
  try {
    // Get all users' study sessions to calculate leaderboard
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, limit(50)); // Get more users to calculate properly
    const usersSnapshot = await getDocs(usersQuery);
    
    const userStats: { [userId: string]: LeaderboardUser } = {};
    
    // Initialize user data
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      userStats[doc.id] = {
        id: doc.id,
        email: userData.email,
        displayName: userData.displayName || userData.email?.split('@')[0] || 'Anonymous',
        totalStudyTime: 0,
        totalSessions: 0,
        averageEfficiency: 0,
        rank: 0,
        badge: 'regular'
      };
    });

    // Get all study sessions to calculate user statistics
    const sessionsRef = collection(db, 'studySessions');
    const sessionsQuery = query(sessionsRef, orderBy('date', 'desc'));
    const sessionsSnapshot = await getDocs(sessionsQuery);
    
    const userSessionData: { [userId: string]: { totalTime: number, sessions: number, efficiencySum: number } } = {};
    
    sessionsSnapshot.forEach(doc => {
      const session = doc.data();
      const userId = session.userId;
      
      if (!userSessionData[userId]) {
        userSessionData[userId] = { totalTime: 0, sessions: 0, efficiencySum: 0 };
      }
      
      userSessionData[userId].totalTime += session.duration || 0;
      userSessionData[userId].sessions += 1;
      userSessionData[userId].efficiencySum += session.efficiency || 0;
    });

    // Update user stats with session data
    Object.keys(userSessionData).forEach(userId => {
      if (userStats[userId]) {
        const sessionData = userSessionData[userId];
        userStats[userId].totalStudyTime = sessionData.totalTime;
        userStats[userId].totalSessions = sessionData.sessions;
        userStats[userId].averageEfficiency = sessionData.sessions > 0 
          ? sessionData.efficiencySum / sessionData.sessions 
          : 0;
      }
    });

    // Convert to array and sort by total study time
    const sortedUsers = Object.values(userStats)
      .filter(user => user.totalStudyTime > 0) // Only include users with study time
      .sort((a, b) => b.totalStudyTime - a.totalStudyTime)
      .slice(0, 10); // Get top 10

    // Assign ranks and badges
    return sortedUsers.map((user, index) => {
      const rank = index + 1;
      let badge: LeaderboardUser['badge'] = 'regular';
      
      if (rank === 1) badge = 'diamond';
      else if (rank === 2) badge = 'platinum';
      else if (rank === 3) badge = 'gold';
      else if (rank <= 5) badge = 'silver';
      else if (rank <= 7) badge = 'bronze';
      else if (rank <= 10) badge = 'elite';
      
      return {
        ...user,
        rank,
        badge
      };
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};
