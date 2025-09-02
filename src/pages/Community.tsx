import React, { useState, useEffect } from 'react';
import { Users, Trophy, MessageCircle, Star, Crown, Flame, Target, BookOpen, Calendar, Clock, ChevronRight, Plus, Search, Filter, Heart, Zap, Award, TrendingUp, UserPlus, Send, ThumbsUp, Share2, Eye, Coffee, Brain, Sparkles, Gift, Medal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

import { Lightbulb } from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  description: string;
  isJoined: boolean;
  lastActivity: string;
  studyStreak: number;
  totalHours: number;
  avatar: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  studyHours: number;
  streak: number;
  rank: number;
  badge: string;
  level: number;
  achievements: number;
  isPremium: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags: string[];
  studyTip?: boolean;
  isPremium?: boolean;
}

interface StudyChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  endDate: string;
  isJoined: boolean;
  progress: number;
  icon: string;
}

export const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'leaderboard' | 'feed' | 'challenges'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const { user, isPremium } = useAuth();

  // Mock data - in real app, this would come from your backend
  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Math Masters 🧮',
      subject: 'Mathematics',
      members: 156,
      description: 'Advanced calculus and algebra study group for competitive exams',
      isJoined: true,
      lastActivity: '2 hours ago',
      studyStreak: 12,
      totalHours: 340,
      avatar: '🧮',
      difficulty: 'Advanced',
      tags: ['Calculus', 'JEE', 'NEET']
    },
    {
      id: '2',
      name: 'Physics Phenoms ⚡',
      subject: 'Physics',
      members: 89,
      description: 'Quantum mechanics and thermodynamics discussion group',
      isJoined: false,
      lastActivity: '1 hour ago',
      studyStreak: 8,
      totalHours: 220,
      avatar: '⚡',
      difficulty: 'Intermediate',
      tags: ['Quantum', 'Mechanics', 'IIT']
    },
    {
      id: '3',
      name: 'Chemistry Champions 🧪',
      subject: 'Chemistry',
      members: 134,
      description: 'Organic and inorganic chemistry problem solving',
      isJoined: true,
      lastActivity: '30 minutes ago',
      studyStreak: 15,
      totalHours: 280,
      avatar: '🧪',
      difficulty: 'Advanced',
      tags: ['Organic', 'Inorganic', 'NEET']
    },
    {
      id: '4',
      name: 'English Excellence 📚',
      subject: 'English',
      members: 67,
      description: 'Literature analysis and writing improvement group',
      isJoined: false,
      lastActivity: '4 hours ago',
      studyStreak: 6,
      totalHours: 150,
      avatar: '📚',
      difficulty: 'Beginner',
      tags: ['Literature', 'Writing', 'Grammar']
    }
  ]);

  const [leaderboard] = useState<LeaderboardUser[]>([
    {
      id: '1',
      name: 'Arjun Sharma',
      avatar: '👨‍🎓',
      studyHours: 127,
      streak: 23,
      rank: 1,
      badge: '🏆',
      level: 15,
      achievements: 12,
      isPremium: true
    },
    {
      id: '2',
      name: 'Priya Patel',
      avatar: '👩‍🎓',
      studyHours: 119,
      streak: 19,
      rank: 2,
      badge: '🥈',
      level: 14,
      achievements: 10,
      isPremium: true
    },
    {
      id: '3',
      name: 'Rahul Kumar',
      avatar: '👨‍💻',
      studyHours: 98,
      streak: 15,
      rank: 3,
      badge: '🥉',
      level: 12,
      achievements: 8,
      isPremium: false
    },
    {
      id: '4',
      name: 'Sneha Singh',
      avatar: '👩‍🔬',
      studyHours: 87,
      streak: 12,
      rank: 4,
      badge: '⭐',
      level: 11,
      achievements: 7,
      isPremium: true
    },
    {
      id: '5',
      name: 'Vikram Joshi',
      avatar: '👨‍🏫',
      studyHours: 76,
      streak: 9,
      rank: 5,
      badge: '🌟',
      level: 10,
      achievements: 6,
      isPremium: false
    }
  ]);

  const [communityFeed, setCommunityFeed] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Arjun Sharma',
      avatar: '👨‍🎓',
      content: 'Just completed a 4-hour study session on Quantum Physics! The key is breaking complex concepts into smaller chunks. Anyone else studying for JEE Advanced? 🚀',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      isLiked: false,
      tags: ['Physics', 'JEE', 'StudyTip'],
      studyTip: true,
      isPremium: true
    },
    {
      id: '2',
      author: 'Priya Patel',
      avatar: '👩‍🎓',
      content: 'Found an amazing technique for memorizing organic chemistry reactions! Creating visual stories for each reaction mechanism. Works like magic! ✨',
      timestamp: '4 hours ago',
      likes: 31,
      comments: 12,
      isLiked: true,
      tags: ['Chemistry', 'Memory', 'NEET'],
      studyTip: true,
      isPremium: true
    },
    {
      id: '3',
      author: 'Rahul Kumar',
      avatar: '👨‍💻',
      content: 'Day 15 of my study streak! Consistency is everything. Small daily progress leads to big results. Keep pushing, everyone! 💪',
      timestamp: '6 hours ago',
      likes: 18,
      comments: 5,
      isLiked: false,
      tags: ['Motivation', 'Streak', 'Consistency'],
      studyTip: false,
      isPremium: false
    },
    {
      id: '4',
      author: 'Sneha Singh',
      avatar: '👩‍🔬',
      content: 'Mathematics becomes so much easier when you understand the logic behind formulas instead of just memorizing them. Try deriving formulas yourself! 🧠',
      timestamp: '8 hours ago',
      likes: 27,
      comments: 9,
      isLiked: true,
      tags: ['Mathematics', 'Understanding', 'Logic'],
      studyTip: true,
      isPremium: true
    }
  ]);

  const [studyChallenges] = useState<StudyChallenge[]>([
    {
      id: '1',
      title: '7-Day Study Streak',
      description: 'Study for at least 2 hours daily for 7 consecutive days',
      duration: '7 days',
      participants: 234,
      reward: 'Premium Badge + 100 XP',
      difficulty: 'Medium',
      endDate: '2025-01-20',
      isJoined: true,
      progress: 57,
      icon: '🔥'
    },
    {
      id: '2',
      title: 'Math Marathon',
      description: 'Complete 50 math problems this week',
      duration: '1 week',
      participants: 89,
      reward: 'Math Master Badge',
      difficulty: 'Hard',
      endDate: '2025-01-18',
      isJoined: false,
      progress: 0,
      icon: '🧮'
    },
    {
      id: '3',
      title: 'Focus Master',
      description: 'Complete 10 focused study sessions without breaks',
      duration: '2 weeks',
      participants: 156,
      reward: 'Focus Champion Title',
      difficulty: 'Easy',
      endDate: '2025-01-25',
      isJoined: true,
      progress: 30,
      icon: '🎯'
    }
  ]);

  const handleLikePost = (postId: string) => {
    setCommunityFeed(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: user?.displayName || user?.email?.split('@')[0] || 'You',
      avatar: '👤',
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false,
      tags: ['Personal'],
      studyTip: false,
      isPremium: isPremium
    };

    setCommunityFeed(prev => [newPost, ...prev]);
    setNewPostContent('');
    setShowNewPost(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Beginner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Intermediate': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '⭐';
    }
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: MessageCircle },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'leaderboard', label: 'Rankings', icon: Trophy },
    { id: 'challenges', label: 'Challenges', icon: Target }
  ];

  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-4 pt-20">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Study Community</h1>
          </div>
          <p className="text-purple-100 text-sm">
            Connect, learn, and grow with fellow students
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 pb-24 space-y-4">
        {/* Community Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Create Post Button */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.displayName?.[0] || user?.email?.[0] || '👤'}
                </div>
                <button
                  onClick={() => setShowNewPost(true)}
                  className="flex-1 text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Share your study progress...
                </button>
                <Button size="sm" icon={Plus} onClick={() => setShowNewPost(true)}>
                  Post
                </Button>
              </div>
            </Card>

            {/* New Post Modal */}
            {showNewPost && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                <Card className="w-full rounded-t-2xl rounded-b-none max-h-[80vh] overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Share with Community
                      </h3>
                      <Button variant="ghost" onClick={() => setShowNewPost(false)}>
                        ✕
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your study progress, tips, or ask for help..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCreatePost}
                          disabled={!newPostContent.trim()}
                          className="flex-1"
                          icon={Send}
                        >
                          Share Post
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setShowNewPost(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Community Posts */}
            <div className="space-y-4">
              {communityFeed.map((post) => (
                <Card key={post.id} className="p-4" hover>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {post.author}
                        </span>
                        {post.isPremium && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                      </div>
                      {post.studyTip && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium mb-2">
                          <Lightbulb className="w-3 h-3" />
                          Study Tip
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {post.content}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                          post.isLiked
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                    </div>

                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Study Groups */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            {/* Search and Filter */}
            <Card className="p-4">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <Button variant="secondary" icon={Filter} size="sm">
                  Filter
                </Button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'joined', 'mathematics', 'physics', 'chemistry'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedFilter === filter
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </Card>

            {/* Study Groups List */}
            <div className="space-y-3">
              {studyGroups.map((group) => (
                <Card key={group.id} className="p-4" hover>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                      {group.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {group.name}
                        </h3>
                        {group.isJoined && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{group.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                        {group.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {group.studyStreak}d streak
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {group.totalHours}h total
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {group.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className={`flex-1 ${group.isJoined ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      icon={group.isJoined ? MessageCircle : UserPlus}
                    >
                      {group.isJoined ? 'Open Chat' : 'Join Group'}
                    </Button>
                    <Button variant="ghost" size="sm" icon={Eye}>
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Create Group Button */}
            <Card className="p-4 text-center border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Create Study Group
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start your own study community
                  </p>
                </div>
                <Button size="sm" icon={Plus}>
                  Create Group
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            {/* Your Rank Card */}
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  #42
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Your Rank</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    45 study hours • 7-day streak
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg">🎯</div>
                  <div className="text-xs text-gray-500">Level 8</div>
                </div>
              </div>
            </Card>

            {/* Top Performers */}
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <Card key={user.id} className={`p-4 ${index < 3 ? 'ring-2 ring-yellow-300 dark:ring-yellow-700 ring-opacity-50' : ''}`} hover>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                        'bg-gradient-to-r from-purple-400 to-blue-500 text-white'
                      }`}>
                        {user.avatar}
                      </div>
                      <div className="absolute -top-1 -right-1 text-sm">
                        {getRankIcon(user.rank)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </span>
                        {user.isPremium && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{user.studyHours}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span>{user.streak}d</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-purple-500" />
                          <span>{user.achievements}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        #{user.rank}
                      </div>
                      <div className="text-xs text-gray-500">
                        Level {user.level}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Weekly Challenge */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    Weekly Challenge
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Study 20 hours this week
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>13h completed</span>
                <span>7h remaining</span>
              </div>
            </Card>
          </div>
        )}

        {/* Study Challenges */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {/* Active Challenges Header */}
            <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    Study Challenges
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Push your limits and earn rewards
                  </p>
                </div>
              </div>
            </Card>

            {/* Challenges List */}
            <div className="space-y-3">
              {studyChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4" hover>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {challenge.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{challenge.participants} joined</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Ends {challenge.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {challenge.isJoined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {challenge.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {challenge.reward}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className={challenge.isJoined ? 'bg-green-600 hover:bg-green-700' : ''}
                      icon={challenge.isJoined ? Eye : Plus}
                    >
                      {challenge.isJoined ? 'View' : 'Join'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Challenge Stats */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Medal className="w-5 h-5 text-purple-600" />
                Your Challenge Stats
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">5</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">350</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">XP Earned</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
