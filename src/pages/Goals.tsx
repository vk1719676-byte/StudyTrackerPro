import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, CheckCircle, Clock, TrendingUp, Award, Calendar, X, AlertCircle, Zap, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  category: 'daily' | 'weekly' | 'monthly' | 'exam';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  priority?: 'low' | 'medium' | 'high';
}

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetHours: '',
    deadline: '',
    category: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'exam',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'priority' | 'created'>('deadline');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
    });

    const unsubscribeSessions = getUserSessions(user.uid, (sessionData) => {
      setSessions(sessionData);
      updateGoalProgress(sessionData);
      setLoading(false);
    });

    // Load goals from localStorage
    const savedGoals = localStorage.getItem(`goals-${user.uid}`);
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt),
        priority: goal.priority || 'medium'
      }));
      setGoals(parsedGoals);
    }

    return () => {
      unsubscribeExams();
      unsubscribeSessions();
    };
  }, [user]);

  const updateGoalProgress = (sessionData: StudySession[]) => {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        let currentHours = 0;
        const now = new Date();

        switch (goal.category) {
          case 'daily':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            currentHours = sessionData
              .filter(session => {
                const sessionDate = new Date(session.date);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate.getTime() === today.getTime();
              })
              .reduce((total, session) => total + session.duration / 60, 0);
            break;

          case 'weekly':
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            currentHours = sessionData
              .filter(session => new Date(session.date) >= weekStart)
              .reduce((total, session) => total + session.duration / 60, 0);
            break;

          case 'monthly':
            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            currentHours = sessionData
              .filter(session => new Date(session.date) >= monthStart)
              .reduce((total, session) => total + session.duration / 60, 0);
            break;

          case 'exam':
            currentHours = sessionData
              .filter(session => new Date(session.date) >= goal.createdAt)
              .reduce((total, session) => total + session.duration / 60, 0);
            break;
        }

        const status = currentHours >= goal.targetHours ? 'completed' : 
                      new Date() > goal.deadline ? 'paused' : 'active';

        return { ...goal, currentHours: Math.round(currentHours * 10) / 10, status };
      });

      // Save updated goals
      if (user) {
        localStorage.setItem(`goals-${user.uid}`, JSON.stringify(updatedGoals));
      }

      return updatedGoals;
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetHours: '',
      deadline: '',
      category: 'weekly',
      priority: 'medium'
    });
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetHours: parseFloat(formData.targetHours),
      currentHours: editingGoal?.currentHours || 0,
      deadline: new Date(formData.deadline),
      category: formData.category,
      status: editingGoal?.status || 'active',
      createdAt: editingGoal?.createdAt || new Date(),
      priority: formData.priority
    };

    if (editingGoal) {
      setGoals(prev => prev.map(goal => goal.id === editingGoal.id ? goalData : goal));
    } else {
      setGoals(prev => [...prev, goalData]);
    }

    // Save to localStorage
    const updatedGoals = editingGoal 
      ? goals.map(goal => goal.id === editingGoal.id ? goalData : goal)
      : [...goals, goalData];
    localStorage.setItem(`goals-${user.uid}`, JSON.stringify(updatedGoals));

    resetForm();
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      targetHours: goal.targetHours.toString(),
      deadline: goal.deadline.toISOString().split('T')[0],
      category: goal.category,
      priority: goal.priority || 'medium'
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      if (user) {
        localStorage.setItem(`goals-${user.uid}`, JSON.stringify(updatedGoals));
      }
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentHours / goal.targetHours) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return Clock;
      case 'weekly': return Calendar;
      case 'monthly': return TrendingUp;
      case 'exam': return Award;
      default: return Target;
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFilteredAndSortedGoals = () => {
    let filtered = goals;

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = goals.filter(goal => goal.status === 'active');
        break;
      case 'completed':
        filtered = goals.filter(goal => goal.status === 'completed');
        break;
      case 'overdue':
        filtered = goals.filter(goal => new Date() > goal.deadline && goal.status !== 'completed');
        break;
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.deadline.getTime() - b.deadline.getTime();
        case 'progress':
          return getProgressPercentage(b) - getProgressPercentage(a);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const overdueGoals = goals.filter(goal => new Date() > goal.deadline && goal.status !== 'completed');
  const totalHoursThisWeek = sessions
    .filter(session => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return new Date(session.date) >= weekStart;
    })
    .reduce((total, session) => total + session.duration / 60, 0);

  const filteredGoals = getFilteredAndSortedGoals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Study Goals 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Set ambitious goals, track progress, and celebrate achievements
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowForm(true)} 
              icon={Plus}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Add Goal
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Goals</p>
                <p className="text-3xl font-bold">{activeGoals.length}</p>
                <p className="text-blue-100 text-xs mt-1">Keep pushing forward!</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Target className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{completedGoals.length}</p>
                <p className="text-emerald-100 text-xs mt-1">Amazing progress!</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold">{Math.round(totalHoursThisWeek * 10) / 10}h</p>
                <p className="text-purple-100 text-xs mt-1">Study time logged</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className={`p-6 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
            overdueGoals.length > 0 
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
              : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${overdueGoals.length > 0 ? 'text-red-100' : 'text-orange-100'}`}>
                  {overdueGoals.length > 0 ? 'Overdue' : 'Success Rate'}
                </p>
                <p className="text-3xl font-bold">
                  {overdueGoals.length > 0 
                    ? overdueGoals.length 
                    : `${goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%`
                  }
                </p>
                <p className={`text-xs mt-1 ${overdueGoals.length > 0 ? 'text-red-100' : 'text-orange-100'}`}>
                  {overdueGoals.length > 0 ? 'Need attention' : 'Keep it up!'}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                {overdueGoals.length > 0 ? (
                  <AlertCircle className="w-8 h-8" />
                ) : (
                  <TrendingUp className="w-8 h-8" />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Goal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {editingGoal ? '✏️ Edit Goal' : '🎯 Create New Goal'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={resetForm}
                    className="p-2"
                  />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Goal Title"
                        placeholder="e.g., Master calculus fundamentals"
                        value={formData.title}
                        onChange={(value) => setFormData({ ...formData, title: value })}
                        required
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="daily">📅 Daily Goal</option>
                        <option value="weekly">🗓️ Weekly Goal</option>
                        <option value="monthly">📊 Monthly Goal</option>
                        <option value="exam">🎓 Exam Preparation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority Level
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                    </div>

                    <Input
                      label="Target Hours"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 20"
                      value={formData.targetHours}
                      onChange={(value) => setFormData({ ...formData, targetHours: value })}
                      required
                    />

                    <Input
                      label="Deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(value) => setFormData({ ...formData, deadline: value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description & Motivation
                    </label>
                    <textarea
                      placeholder="Describe your goal and what motivates you to achieve it..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {editingGoal ? '✅ Update Goal' : '🚀 Create Goal'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={resetForm} className="px-6">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Filters and Sort */}
        {goals.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Filter:</span>
              {(['all', 'active', 'completed', 'overdue'] as const).map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className={`capitalize ${filter === filterOption ? 'shadow-md' : ''}`}
                >
                  {filterOption === 'all' && '📋 All'}
                  {filterOption === 'active' && '🎯 Active'}
                  {filterOption === 'completed' && '✅ Completed'}
                  {filterOption === 'overdue' && '⚠️ Overdue'}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="deadline">📅 Deadline</option>
                <option value="progress">📊 Progress</option>
                <option value="priority">⭐ Priority</option>
                <option value="created">🕒 Created</option>
              </select>
            </div>
          </div>
        )}

        {/* Enhanced Goals List */}
        {goals.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-purple-200 dark:border-gray-600">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Ready to set your first goal? 🎯
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Transform your study routine with clear, achievable goals that keep you motivated and on track.
              </p>
              <Button 
                onClick={() => setShowForm(true)} 
                icon={Plus}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create Your First Goal
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => {
              const Icon = getCategoryIcon(goal.category);
              const progress = getProgressPercentage(goal);
              const isOverdue = new Date() > goal.deadline && goal.status !== 'completed';
              const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
              const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline >= 0 && goal.status !== 'completed';

              return (
                <Card 
                  key={goal.id} 
                  className={`p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    isOverdue ? 'ring-2 ring-red-500 ring-opacity-50 bg-red-50 dark:bg-red-900/10' : 
                    isUrgent ? 'ring-2 ring-amber-500 ring-opacity-50 bg-amber-50 dark:bg-amber-900/10' :
                    goal.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-3 rounded-xl ${
                        goal.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        isOverdue ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          goal.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                          isOverdue ? 'text-red-600 dark:text-red-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 line-clamp-2">
                          {goal.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)}`}>
                            {goal.status === 'completed' && '✅ '}
                            {goal.status === 'active' && '🎯 '}
                            {goal.status === 'paused' && '⏸️ '}
                            {goal.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(goal.priority || 'medium')}`}>
                            {goal.priority === 'high' && '🔴 '}
                            {goal.priority === 'medium' && '🟡 '}
                            {goal.priority === 'low' && '🟢 '}
                            {(goal.priority || 'medium').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEdit(goal)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Enhanced Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {goal.currentHours}h / {goal.targetHours}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ease-out ${
                            goal.status === 'completed' 
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                              : isOverdue
                              ? 'bg-gradient-to-r from-red-500 to-red-600'
                              : 'bg-gradient-to-r from-purple-500 to-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className={`font-semibold ${
                          goal.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                          isOverdue ? 'text-red-600 dark:text-red-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`}>
                          {Math.round(progress)}% complete
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {(goal.targetHours - goal.currentHours).toFixed(1)}h remaining
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Info Section */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="capitalize font-semibold text-gray-900 dark:text-gray-100">
                          {goal.category === 'daily' && '📅 '}
                          {goal.category === 'weekly' && '🗓️ '}
                          {goal.category === 'monthly' && '📊 '}
                          {goal.category === 'exam' && '🎓 '}
                          {goal.category}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                        <div className="text-right">
                          <span className={`font-semibold ${isOverdue ? 'text-red-600 dark:text-red-400' : isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {goal.deadline.toLocaleDateString()}
                          </span>
                          <div className={`text-xs ${isOverdue ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-gray-500'}`}>
                            {isOverdue ? `${Math.abs(daysUntilDeadline)} days overdue` :
                             daysUntilDeadline === 0 ? 'Due today!' :
                             daysUntilDeadline === 1 ? 'Due tomorrow' :
                             `${daysUntilDeadline} days left`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {goal.description && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                          💭 {goal.description}
                        </p>
                      </div>
                    )}

                    {/* Status Messages */}
                    {goal.status === 'completed' && (
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          <Star className="w-5 h-5 text-yellow-500" />
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                          🎉 Goal Completed!
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
                          Amazing work! You've achieved your target.
                        </p>
                      </div>
                    )}

                    {isOverdue && goal.status !== 'completed' && (
                      <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                        <p className="text-red-700 dark:text-red-300 font-bold">
                          ⚠️ Goal Overdue
                        </p>
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          Don't give up! You can still make progress.
                        </p>
                      </div>
                    )}

                    {isUrgent && !isOverdue && (
                      <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
                        <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                        <p className="text-amber-700 dark:text-amber-300 font-bold">
                          🔥 Deadline Approaching!
                        </p>
                        <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
                          Time to focus and push forward!
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* No results message for filtered view */}
        {goals.length > 0 && filteredGoals.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No goals found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters to see more goals
            </p>
            <Button onClick={() => setFilter('all')} variant="secondary">
              Show All Goals
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
