import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, CheckCircle, Clock, TrendingUp, Award, Calendar, Star, Zap, Trophy, Filter, Search } from 'lucide-react';

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
  priority: 'low' | 'medium' | 'high';
  streak: number;
}

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetHours: '',
    deadline: '',
    category: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'exam',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [loading, setLoading] = useState(true);
  const [animatingGoals, setAnimatingGoals] = useState<Set<string>>(new Set());

  // Filter and sort goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'progress':
        return (b.currentHours / b.targetHours) - (a.currentHours / a.targetHours);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt),
        priority: goal.priority || 'medium',
        streak: goal.streak || 0
      }));
      setGoals(parsedGoals);
    }
    setLoading(false);
  }, []);

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
    setLoading(true);
    
    setTimeout(() => {
      const goalData: Goal = {
        id: editingGoal?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        targetHours: parseFloat(formData.targetHours),
        currentHours: editingGoal?.currentHours || 0,
        deadline: new Date(formData.deadline),
        category: formData.category,
        priority: formData.priority,
        status: editingGoal?.status || 'active',
        createdAt: editingGoal?.createdAt || new Date(),
        streak: editingGoal?.streak || 0
      };

      if (editingGoal) {
        setGoals(prev => prev.map(goal => goal.id === editingGoal.id ? goalData : goal));
      } else {
        setGoals(prev => [...prev, goalData]);
        // Animate new goal
        setAnimatingGoals(prev => new Set([...prev, goalData.id]));
        setTimeout(() => {
          setAnimatingGoals(prev => {
            const newSet = new Set(prev);
            newSet.delete(goalData.id);
            return newSet;
          });
        }, 1000);
      }

      // Save to localStorage
      const updatedGoals = editingGoal 
        ? goals.map(goal => goal.id === editingGoal.id ? goalData : goal)
        : [...goals, goalData];
      localStorage.setItem('goals', JSON.stringify(updatedGoals));

      setLoading(false);
      resetForm();
    }, 1000);
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      targetHours: goal.targetHours.toString(),
      deadline: goal.deadline.toISOString().split('T')[0],
      category: goal.category,
      priority: goal.priority
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentHours / goal.targetHours) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:border-green-700/50';
      case 'active': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400 dark:border-blue-700/50';
      case 'paused': return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-400 dark:border-gray-700/50';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-400 dark:border-gray-700/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
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

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalHours = goals.reduce((total, goal) => total + goal.currentHours, 0);
  const averageProgress = goals.length > 0 ? goals.reduce((total, goal) => total + getProgressPercentage(goal), 0) / goals.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header with enhanced gradient */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-blue-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Study Goals 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Set and track your study goals to achieve academic excellence
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Goal
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {activeGoals.length}
                </p>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {completedGoals.length}
                </p>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Hours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(totalHours * 10) / 10}h
                </p>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(averageProgress)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="mb-8 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="all">All Categories</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="exam">Exam</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="progress">Sort by Progress</option>
              <option value="priority">Sort by Priority</option>
            </select>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span>{filteredGoals.length} results</span>
            </div>
          </div>
        </div>

        {/* Enhanced Goal Form */}
        {showForm && (
          <div className="mb-8 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Study 2 hours daily"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    <option value="daily">Daily Goal</option>
                    <option value="weekly">Weekly Goal</option>
                    <option value="monthly">Monthly Goal</option>
                    <option value="exam">Exam Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Target Hours *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    placeholder="e.g., 10"
                    value={formData.targetHours}
                    onChange={(e) => setFormData({ ...formData, targetHours: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your goal and motivation..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {editingGoal ? 'Update Goal' : 'Create Goal'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Goals List */}
        {filteredGoals.length === 0 ? (
          <div className="p-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Target className="w-12 h-12 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' ? 'No matching goals' : 'No goals yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters to find what you\'re looking for'
                  : 'Create your first study goal to start tracking your progress and achieve academic excellence'
                }
              </p>
            </div>
            {!searchTerm && filterCategory === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredGoals.map((goal) => {
              const Icon = getCategoryIcon(goal.category);
              const progress = getProgressPercentage(goal);
              const isOverdue = new Date() > goal.deadline && goal.status !== 'completed';
              const isAnimating = animatingGoals.has(goal.id);

              return (
                <div
                  key={goal.id}
                  className={`group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-white/30 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-2 ${
                    isOverdue ? 'ring-2 ring-red-500/50 shadow-red-500/20' : ''
                  } ${isAnimating ? 'animate-pulse scale-105' : ''}`}
                >
                  {/* Goal Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                        goal.category === 'daily' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        goal.category === 'weekly' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                        goal.category === 'monthly' ? 'bg-gradient-to-br from-purple-500 to-violet-500' :
                        'bg-gradient-to-br from-orange-500 to-red-500'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                          {goal.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)}`}>
                            {goal.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(goal.priority)} bg-white/50 dark:bg-gray-700/50`}>
                            {goal.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {goal.currentHours}h / {goal.targetHours}h
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              goal.status === 'completed' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                                : 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30'
                            }`}
                            style={{ width: `${progress}%` }}
                          >
                            <div className="h-full w-full bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute -top-8 right-0 text-xs font-bold text-gray-700 dark:text-gray-300">
                          {Math.round(progress)}%
                        </div>
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Category
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {goal.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Deadline
                        </span>
                        <span className={`font-semibold ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {goal.deadline.toLocaleDateString()}
                        </span>
                      </div>

                      {goal.streak > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
                          <span className="text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Streak
                          </span>
                          <span className="font-bold text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
                            {goal.streak} days
                            <Star className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600/50 line-clamp-3">
                        {goal.description}
                      </p>
                    )}

                    {/* Status Badges */}
                    {goal.status === 'completed' && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-4 text-center">
                        <Trophy className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <p className="text-green-700 dark:text-green-400 font-bold text-sm">
                          🎉 Goal Accomplished!
                        </p>
                        <p className="text-green-600 dark:text-green-500 text-xs mt-1">
                          Great job on completing this goal!
                        </p>
                      </div>
                    )}

                    {isOverdue && goal.status !== 'completed' && (
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-4 text-center animate-pulse">
                        <p className="text-red-700 dark:text-red-400 font-bold text-sm mb-1">
                          ⚠️ Past Deadline
                        </p>
                        <p className="text-red-600 dark:text-red-500 text-xs">
                          Consider updating your timeline or goal parameters
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
