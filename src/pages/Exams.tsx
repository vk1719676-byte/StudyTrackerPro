import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, Clock, AlertTriangle, Edit, Trash2, Search, Filter, BarChart3, Grid, List, Award, Target, TrendingUp, BookOpen, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, addExam, updateExam, deleteExam } from '../services/firestore';
import { Exam } from '../types';

export const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    syllabus: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dailyHours: '',
    weeklyHours: ''
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserExams(user.uid, (examData) => {
      setExams(examData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Statistics calculations
  const stats = useMemo(() => {
    const now = new Date();
    const upcomingExams = exams.filter(exam => exam.date >= now);
    const pastExams = exams.filter(exam => exam.date < now);
    const urgentExams = exams.filter(exam => {
      const daysDiff = Math.ceil((exam.date.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff <= 7 && daysDiff >= 0;
    });
    const totalStudyHours = exams.reduce((total, exam) => total + exam.goals.dailyHours * 7, 0);
    const highPriorityCount = exams.filter(exam => exam.priority === 'high').length;

    return {
      total: exams.length,
      upcoming: upcomingExams.length,
      past: pastExams.length,
      urgent: urgentExams.length,
      totalStudyHours,
      highPriority: highPriorityCount
    };
  }, [exams]);

  // Filtered and sorted exams
  const filteredExams = useMemo(() => {
    let filtered = exams.filter(exam => {
      const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.syllabus.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || exam.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date.getTime() - b.date.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [exams, searchTerm, filterPriority, sortBy]);

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      syllabus: '',
      priority: 'medium',
      dailyHours: '',
      weeklyHours: ''
    });
    setEditingExam(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const examData = {
      name: formData.name,
      date: new Date(formData.date),
      syllabus: formData.syllabus,
      priority: formData.priority,
      goals: {
        dailyHours: parseFloat(formData.dailyHours) || 0,
        weeklyHours: parseFloat(formData.weeklyHours) || 0,
        topicProgress: {}
      },
      userId: user.uid,
      createdAt: new Date()
    };

    try {
      if (editingExam) {
        await updateExam(editingExam.id, examData);
      } else {
        await addExam(examData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam: Exam) => {
    setFormData({
      name: exam.name,
      date: exam.date.toISOString().split('T')[0],
      syllabus: exam.syllabus,
      priority: exam.priority,
      dailyHours: exam.goals.dailyHours.toString(),
      weeklyHours: exam.goals.weeklyHours.toString()
    });
    setEditingExam(exam);
    setShowForm(true);
  };

  const handleDelete = async (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(examId);
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTimeRemaining = (examDate: Date) => {
    const now = new Date();
    const timeDiff = examDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'Past due';
    if (daysDiff === 0) return 'Today!';
    if (daysDiff === 1) return '1 day left';
    return `${daysDiff} days left`;
  };

  const getProgressPercentage = (exam: Exam) => {
    const now = new Date();
    const totalTime = exam.date.getTime() - exam.createdAt.getTime();
    const elapsedTime = now.getTime() - exam.createdAt.getTime();
    return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header Section with Enhanced Design */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Your Exams
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Master your preparation with intelligent exam management
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                icon={Plus}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Add Exam
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <div>
                <p className="text-blue-100 text-xs font-medium">Total Exams</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-green-100 text-xs font-medium">Upcoming</p>
                <p className="text-xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="text-red-100 text-xs font-medium">Urgent</p>
                <p className="text-xl font-bold">{stats.urgent}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <div>
                <p className="text-purple-100 text-xs font-medium">High Priority</p>
                <p className="text-xl font-bold">{stats.highPriority}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-yellow-100 text-xs font-medium">Study Hours</p>
                <p className="text-xl font-bold">{stats.totalStudyHours}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <div>
                <p className="text-teal-100 text-xs font-medium">Completed</p>
                <p className="text-xl font-bold">{stats.past}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Form with Better Design */}
        {showForm && (
          <Card className="mb-8 p-0 overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold">
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </h2>
              <p className="opacity-90 mt-1">
                {editingExam ? 'Update your exam details' : 'Add a new exam to track your preparation'}
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Exam Name"
                    placeholder="e.g., Mathematics Final"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    required
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />

                  <Input
                    label="Exam Date"
                    type="date"
                    value={formData.date}
                    onChange={(value) => setFormData({ ...formData, date: value })}
                    required
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>

                  <Input
                    label="Daily Study Goal (hours)"
                    type="number"
                    step="0.5"
                    placeholder="e.g., 2"
                    value={formData.dailyHours}
                    onChange={(value) => setFormData({ ...formData, dailyHours: value })}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />

                  <Input
                    label="Weekly Study Goal (hours)"
                    type="number"
                    step="0.5"
                    placeholder="e.g., 14"
                    value={formData.weeklyHours}
                    onChange={(value) => setFormData({ ...formData, weeklyHours: value })}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus & Topics
                  </label>
                  <textarea
                    placeholder="📚 List the main topics, chapters, or areas you need to cover for this exam..."
                    value={formData.syllabus}
                    onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {editingExam ? '✏️ Update Exam' : '➕ Create Exam'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={resetForm}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Enhanced Search and Filter Section */}
        {exams.length > 0 && (
          <Card className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="date">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'secondary'}
                  size="sm"
                  icon={Grid}
                  onClick={() => setViewMode('grid')}
                  className="transition-all duration-200"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'secondary'}
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                  className="transition-all duration-200"
                >
                  List
                </Button>
              </div>
            </div>
          </Card>
        )}

        {filteredExams.length === 0 && exams.length > 0 ? (
          <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No exams found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('all');
              }}
              variant="secondary"
            >
              Clear Filters
            </Button>
          </Card>
        ) : exams.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Ready to ace your exams?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Start your journey to exam success. Add your first exam and let us help you create the perfect study plan.
            </p>
            <Button 
              onClick={() => setShowForm(true)} 
              icon={Plus}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Add Your First Exam
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
            'space-y-4'
          }>
            {filteredExams.map((exam, index) => {
              const timeRemaining = getTimeRemaining(exam.date);
              const isUrgent = timeRemaining.includes('day') && parseInt(timeRemaining) <= 7;
              const isPastDue = timeRemaining === 'Past due';
              const isToday = timeRemaining === 'Today!';
              const progress = getProgressPercentage(exam);

              return (
                <Card 
                  key={exam.id} 
                  className={`
                    p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1
                    ${isUrgent ? 'ring-2 ring-red-400 ring-opacity-60 shadow-red-100' : ''}
                    ${isPastDue ? 'ring-2 ring-gray-400 ring-opacity-60 opacity-75' : ''}
                    ${isToday ? 'ring-2 ring-green-400 ring-opacity-60 shadow-green-100' : ''}
                    ${viewMode === 'list' ? 'flex items-center gap-6' : ''}
                    animate-fade-in bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 backdrop-blur-sm
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                            {exam.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getPriorityColor(exam.priority)}`}>
                              {exam.priority.toUpperCase()} PRIORITY
                            </span>
                            {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                            {isToday && <Star className="w-4 h-4 text-green-500 animate-pulse" />}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit}
                            onClick={() => handleEdit(exam)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-all duration-200"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(exam.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">
                              {exam.date.toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm font-semibold px-2 py-1 rounded-lg ${
                            isPastDue ? 'text-gray-500 bg-gray-100 dark:bg-gray-700' :
                            isToday ? 'text-green-700 bg-green-100 dark:bg-green-900/20' :
                            isUrgent ? 'text-red-700 bg-red-100 dark:bg-red-900/20' : 
                            'text-blue-700 bg-blue-100 dark:bg-blue-900/20'
                          }`}>
                            <Clock className="w-4 h-4" />
                            {timeRemaining}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-600" />
                            Study Goals
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {exam.goals.dailyHours}h
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">Daily</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {exam.goals.weeklyHours}h
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">Weekly</div>
                            </div>
                          </div>
                        </div>

                        {exam.syllabus && (
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-green-600" />
                              Syllabus Overview
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                              {exam.syllabus}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <div className="flex items-center justify-between w-full gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {exam.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(exam.priority)}`}>
                              {exam.priority.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {exam.date.toLocaleDateString()}
                            </span>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {timeRemaining}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {exam.goals.dailyHours}h daily
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {exam.goals.weeklyHours}h weekly
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit}
                            onClick={() => handleEdit(exam)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(exam.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
