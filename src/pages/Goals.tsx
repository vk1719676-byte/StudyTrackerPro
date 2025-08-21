import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, CheckCircle, Clock, TrendingUp, Award, Calendar, Star, Zap, Trophy, Filter, Search } from 'lucide-react';

export interface Goal {
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'title':
        return value.trim().length < 3 ? 'Title must be at least 3 characters' : '';
      case 'targetHours':
        const hours = parseFloat(value);
        return !hours || hours <= 0 ? 'Target hours must be greater than 0' : '';
      case 'deadline':
        const deadlineDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadlineDate < today ? 'Deadline must be in the future' : '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
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
    setFormErrors({});
    setIsSubmitting(false);
    setTouched({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setTouched({
        title: true,
        targetHours: true,
        deadline: true,
        description: true,
        category: true,
        priority: true
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const goalData: Goal = {
        id: editingGoal?.id || Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
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

      setIsSubmitting(false);
      resetForm();
    }, 1200);
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
    setFormErrors({});
    setTouched({});
  };

  const handleDelete = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (window.confirm(`Are you sure you want to delete "${goal?.title}"? This action cannot be undone.`)) {
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
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:border-green-700/50 shadow-md';
      case 'active': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400 dark:border-blue-700/50 shadow-md';
      case 'paused': return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-400 dark:border-gray-700/50 shadow-md';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-400 dark:border-gray-700/50 shadow-md';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700/50';
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'daily': return { icon: Clock, emoji: '📅', gradient: 'from-blue-500 to-cyan-500' };
      case 'weekly': return { icon: Calendar, emoji: '🗓️', gradient: 'from-green-500 to-emerald-500' };
      case 'monthly': return { icon: TrendingUp, emoji: '📊', gradient: 'from-purple-500 to-violet-500' };
      case 'exam': return { icon: Award, emoji: '🎓', gradient: 'from-orange-500 to-red-500' };
      default: return { icon: Target, emoji: '🎯', gradient: 'from-gray-500 to-slate-500' };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high': return { emoji: '🔴', label: 'High Priority' };
      case 'medium': return { emoji: '🟡', label: 'Medium Priority' };
      case 'low': return { emoji: '🟢', label: 'Low Priority' };
      default: return { emoji: '⚪', label: 'No Priority' };
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalHours = goals.reduce((total, goal) => total + goal.currentHours, 0);
  const averageProgress = goals.length > 0 ? goals.reduce((total, goal) => total + getProgressPercentage(goal), 0) / goals.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
        <div className="text-center animate-pulse">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-violet-200 dark:border-violet-800 border-t-violet-600 dark:border-t-violet-400 mx-auto mb-6 drop-shadow-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Target className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">Loading your goals...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Setting up your study dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        
        {/* Enhanced Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-8 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-blue-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/30 dark:border-gray-700/50 shadow-xl animate-fadeInDown">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
              Study Goals 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed max-w-md">
              Set and track your study goals to achieve academic excellence
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {goals.length} total goals
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.round(totalHours * 10) / 10}h tracked
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
              Add New Goal
            </button>
          </div>
        </header>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Active Goals',
              value: activeGoals.length,
              icon: Target,
              gradient: 'from-blue-500 to-cyan-500',
              hoverShadow: 'hover:shadow-blue-500/25'
            },
            {
              title: 'Completed',
              value: completedGoals.length,
              icon: CheckCircle,
              gradient: 'from-green-500 to-emerald-500',
              hoverShadow: 'hover:shadow-green-500/25'
            },
            {
              title: 'Total Hours',
              value: `${Math.round(totalHours * 10) / 10}h`,
              icon: Clock,
              gradient: 'from-purple-500 to-violet-500',
              hoverShadow: 'hover:shadow-purple-500/25'
            },
            {
              title: 'Avg Progress',
              value: `${Math.round(averageProgress)}%`,
              icon: TrendingUp,
              gradient: 'from-orange-500 to-red-500',
              hoverShadow: 'hover:shadow-orange-500/25'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-white/30 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-2 ${stat.hoverShadow} animate-fadeInUp`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className={`mt-4 h-1 bg-gradient-to-r ${stat.gradient} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Filters and Search */}
        <div className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white dark:hover:bg-gray-700"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="daily">📅 Daily</option>
              <option value="weekly">🗓️ Weekly</option>
              <option value="monthly">📊 Monthly</option>
              <option value="exam">🎓 Exam</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">🟢 Active</option>
              <option value="completed">✅ Completed</option>
              <option value="paused">⏸️ Paused</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
            >
              <option value="deadline">⏰ Sort by Deadline</option>
              <option value="progress">📈 Sort by Progress</option>
              <option value="priority">⚡ Sort by Priority</option>
            </select>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl px-4 py-3">
              <Filter className="w-4 h-4" />
              <span className="font-medium tabular-nums">{filteredGoals.length} result{filteredGoals.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Goal Form */}
        {showForm && (
          <div className="mb-8 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 dark:border-gray-700/50 animate-slideInDown">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {editingGoal ? 'Edit Goal ✏️' : 'Create New Goal 🎯'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Study 2 hours daily"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    className={`w-full px-4 py-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formErrors.title && touched.title
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-purple-500'
                    }`}
                  />
                  {formErrors.title && touched.title && (
                    <p className="text-red-500 text-xs mt-1 animate-shake">{formErrors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer"
                  >
                    <option value="daily">📅 Daily Goal</option>
                    <option value="weekly">🗓️ Weekly Goal</option>
                    <option value="monthly">📊 Monthly Goal</option>
                    <option value="exam">🎓 Exam Preparation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Target Hours *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    placeholder="e.g., 10"
                    value={formData.targetHours}
                    onChange={(e) => handleChange('targetHours', e.target.value)}
                    onBlur={() => handleBlur('targetHours')}
                    className={`w-full px-4 py-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formErrors.targetHours && touched.targetHours
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-purple-500'
                    }`}
                  />
                  {formErrors.targetHours && touched.targetHours && (
                    <p className="text-red-500 text-xs mt-1 animate-shake">{formErrors.targetHours}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    onBlur={() => handleBlur('deadline')}
                    className={`w-full px-4 py-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formErrors.deadline && touched.deadline
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-purple-500'
                    }`}
                  />
                  {formErrors.deadline && touched.deadline && (
                    <p className="text-red-500 text-xs mt-1 animate-shake">{formErrors.deadline}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  placeholder="Describe your goal and motivation..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>{editingGoal ? 'Update Goal' : 'Create Goal'}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {editingGoal ? '✏️' : '🎯'}
                      </span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Goals List */}
        {filteredGoals.length === 0 ? (
          <div className="p-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 dark:border-gray-700/50 text-center animate-fadeInUp" style={{ animationDelay: '800ms' }}>
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-16 h-16 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' ? 'No matching goals found' : 'No goals yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for. You can also create a new goal that matches your criteria.'
                  : 'Create your first study goal to start tracking your progress and achieve academic excellence. Set clear targets and watch yourself grow!'
                }
              </p>
            </div>
            {!searchTerm && filterCategory === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="group px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto text-lg"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 auto-rows-fr">
            {filteredGoals.map((goal, index) => {
              const categoryInfo = getCategoryInfo(goal.category);
              const Icon = categoryInfo.icon;
              const progress = getProgressPercentage(goal);
              const isOverdue = new Date() > goal.deadline && goal.status !== 'completed';
              const isAnimating = animatingGoals.has(goal.id);
              const priorityInfo = getPriorityInfo(goal.priority);

              return (
                <div
                  key={goal.id}
                  className={`group relative p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-3 cursor-default animate-fadeInUp ${
                    isOverdue ? 'ring-2 ring-red-500/50 shadow-red-500/20' : ''
                  } ${isAnimating ? 'animate-bounce scale-105 ring-2 ring-violet-500/50' : ''}`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  {/* Goal Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-start gap-5 flex-1 min-w-0">
                      <div className={`p-4 rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${categoryInfo.gradient}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 leading-tight">
                          {goal.title}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(goal.status)} transition-all duration-300 hover:scale-105`}>
                            {goal.status === 'completed' ? '✅' : goal.status === 'active' ? '🟢' : '⏸️'} {goal.status.toUpperCase()}
                          </span>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getPriorityColor(goal.priority)} hover:scale-105 transition-all duration-300`}>
                            {priorityInfo.emoji} {priorityInfo.label.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-3 text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-xl transition-all duration-200 hover:scale-110 shadow-md"
                        title="Edit goal"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-3 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 hover:scale-110 shadow-md"
                        title="Delete goal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-600 dark:text-gray-400 flex items-center gap-3">
                          <Clock className="w-5 h-5" />
                          Progress
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                          {goal.currentHours}h / {goal.targetHours}h
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1500 ease-out relative ${
                              goal.status === 'completed' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                                : 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30'
                            }`}
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute -top-10 right-0 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full shadow-md">
                          {Math.round(progress)}%
                        </div>
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="space-y-4 text-base">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-3 font-semibold">
                          <span className="text-xl">{categoryInfo.emoji}</span>
                          Category
                        </span>
                        <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                          {goal.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-3 font-semibold">
                          <Calendar className="w-5 h-5" />
                          Deadline
                        </span>
                        <span className={`font-bold ${isOverdue ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-900 dark:text-gray-100'}`}>
                          {goal.deadline.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: goal.deadline.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </span>
                      </div>

                      {goal.streak > 0 && (
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                          <span className="text-yellow-700 dark:text-yellow-400 flex items-center gap-3 font-bold">
                            <Zap className="w-5 h-5" />
                            Streak
                          </span>
                          <span className="font-black text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                            {goal.streak} day{goal.streak !== 1 ? 's' : ''}
                            <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {goal.description && (
                      <div className="p-5 bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    )}

                    {/* Status Messages */}
                    {goal.status === 'completed' && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-6 text-center animate-bounce">
                        <Trophy className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                        <p className="text-green-700 dark:text-green-400 font-bold text-lg mb-2">
                          🎉 Goal Accomplished!
                        </p>
                        <p className="text-green-600 dark:text-green-500 text-sm">
                          Outstanding work on completing this goal! Keep up the momentum!
                        </p>
                      </div>
                    )}

                    {isOverdue && goal.status !== 'completed' && (
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 text-center animate-pulse">
                        <p className="text-red-700 dark:text-red-400 font-bold text-lg mb-2">
                          ⚠️ Past Deadline
                        </p>
                        <p className="text-red-600 dark:text-red-500 text-sm">
                          Consider updating your timeline or adjusting the goal parameters
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

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInDown {
          animation: slideInDown 0.4s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Goals;
