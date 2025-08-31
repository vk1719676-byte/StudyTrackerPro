import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, Clock, AlertTriangle, Edit, Trash2, Search, Filter, BarChart3, Award, Target, TrendingUp, BookOpen, Star, Timer, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SyllabusTracker } from '../components/SyllabusTracker';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, addExam, updateExam, deleteExam } from '../services/firestore';
import { Exam, Subject } from '../types';

export const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedSyllabus, setExpandedSyllabus] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    syllabus: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Update current time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserExams(user.uid, (examData) => {
      // Ensure all exams have the required fields for syllabus tracking
      const enhancedExams = examData.map(exam => ({
        ...exam,
        subjects: exam.subjects || [],
        overallProgress: exam.overallProgress || 0
      }));
      setExams(enhancedExams);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Enhanced statistics calculations
  const stats = useMemo(() => {
    const now = currentTime;
    const upcomingExams = exams.filter(exam => exam.date >= now);
    const pastExams = exams.filter(exam => exam.date < now);
    const urgentExams = exams.filter(exam => {
      const daysDiff = Math.ceil((exam.date.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff <= 7 && daysDiff >= 0;
    });
    const highPriorityCount = exams.filter(exam => exam.priority === 'high').length;
    const todayExams = exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.toDateString() === now.toDateString();
    });

    const totalChapters = exams.reduce((acc, exam) => 
      acc + exam.subjects.reduce((subAcc, subject) => subAcc + subject.chapters.length, 0), 0);
    const completedChapters = exams.reduce((acc, exam) => 
      acc + exam.subjects.reduce((subAcc, subject) => 
        subAcc + subject.chapters.filter(chapter => chapter.isCompleted).length, 0), 0);

    return {
      total: exams.length,
      upcoming: upcomingExams.length,
      past: pastExams.length,
      urgent: urgentExams.length,
      highPriority: highPriorityCount,
      today: todayExams.length,
      totalChapters,
      completedChapters,
      averageProgress: exams.length > 0 ? Math.round(exams.reduce((acc, exam) => acc + exam.overallProgress, 0) / exams.length) : 0
    };
  }, [exams, currentTime]);

  // Enhanced filtered and sorted exams
  const filteredExams = useMemo(() => {
    let filtered = exams.filter(exam => {
      const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.syllabus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.subjects.some(subject => 
                             subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             subject.chapters.some(chapter => 
                               chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
                             )
                           );
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
    });
    setEditingExam(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const examData: Partial<Exam> = {
      name: formData.name,
      date: new Date(formData.date),
      syllabus: formData.syllabus,
      priority: formData.priority,
      userId: user.uid,
      createdAt: editingExam?.createdAt || new Date(),
      subjects: editingExam?.subjects || [],
      overallProgress: editingExam?.overallProgress || 0
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
    });
    setEditingExam(exam);
    setShowForm(true);
  };

  const handleDelete = async (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam and all its syllabus data?')) {
      try {
        await deleteExam(examId);
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleUpdateExam = async (examId: string, updates: Partial<Exam>) => {
    try {
      await updateExam(examId, updates);
    } catch (error) {
      console.error('Error updating exam:', error);
    }
  };

  const toggleSyllabusExpansion = (examId: string) => {
    const newExpanded = new Set(expandedSyllabus);
    if (newExpanded.has(examId)) {
      newExpanded.delete(examId);
    } else {
      newExpanded.add(examId);
    }
    setExpandedSyllabus(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAdvancedTimeRemaining = (examDate: Date) => {
    const now = currentTime;
    const timeDiff = examDate.getTime() - now.getTime();
    
    if (timeDiff < 0) {
      return { text: 'Past due', type: 'past', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' };
    }
    
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (days === 0 && hours === 0 && minutes === 0) {
      return { 
        text: `${seconds}s`, 
        type: 'critical', 
        color: 'text-red-600 animate-pulse', 
        bgColor: 'bg-red-100 dark:bg-red-900/30 ring-2 ring-red-400 ring-opacity-60' 
      };
    }
    
    if (days === 0 && hours < 24) {
      return { 
        text: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`, 
        type: 'urgent', 
        color: 'text-orange-600 font-bold', 
        bgColor: 'bg-orange-100 dark:bg-orange-900/30 ring-2 ring-orange-400 ring-opacity-60' 
      };
    }
    
    if (days === 0) {
      return { 
        text: 'Today!', 
        type: 'today', 
        color: 'text-green-600 font-bold animate-pulse', 
        bgColor: 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400 ring-opacity-60' 
      };
    }
    
    if (days <= 3) {
      return { 
        text: `${days}d ${hours}h`, 
        type: 'warning', 
        color: 'text-red-600 font-semibold', 
        bgColor: 'bg-red-50 dark:bg-red-900/20 ring-1 ring-red-300 ring-opacity-50' 
      };
    }
    
    if (days <= 7) {
      return { 
        text: `${days} days`, 
        type: 'caution', 
        color: 'text-yellow-600 font-medium', 
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
      };
    }
    
    return { 
      text: `${days} days`, 
      type: 'normal', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50 dark:bg-blue-900/20' 
    };
  };

  const getProgressPercentage = (exam: Exam) => {
    const now = currentTime;
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

        {/* Enhanced Statistics Dashboard */}
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
          
          <Card className="p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <div>
                <p className="text-teal-100 text-xs font-medium">Today</p>
                <p className="text-xl font-bold">{stats.today}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <div>
                <p className="text-orange-100 text-xs font-medium">Avg Progress</p>
                <p className="text-xl font-bold">{stats.averageProgress}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Form */}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exam Description (Optional)
                  </label>
                  <textarea
                    placeholder="📚 Brief description of this exam..."
                    value={formData.syllabus}
                    onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                    rows={3}
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
                    placeholder="Search exams, subjects, chapters..."
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
              Start your journey to exam success. Add your first exam and track your syllabus progress with our advanced study management system.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam, index) => {
              const timeData = getAdvancedTimeRemaining(exam.date);
              const isUrgent = timeData.type === 'urgent' || timeData.type === 'warning';
              const isPastDue = timeData.type === 'past';
              const isToday = timeData.type === 'today';
              const isCritical = timeData.type === 'critical';
              const progress = getProgressPercentage(exam);
              const isSyllabusExpanded = expandedSyllabus.has(exam.id);

              return (
                <Card 
                  key={exam.id} 
                  className={`
                    border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden
                    ${timeData.bgColor}
                    ${isCritical ? 'animate-pulse shadow-red-500/50' : ''}
                    ${isPastDue ? 'opacity-75' : ''}
                    animate-fade-in bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 backdrop-blur-sm
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated Background Effect for Critical Exams */}
                  {isCritical && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 animate-pulse"></div>
                  )}
                  
                  {/* Urgent Exam Glow Effect */}
                  {isUrgent && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-pulse"></div>
                  )}

                  <div className="relative z-10 p-6">
                    {/* Time Progress Bar */}
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
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getPriorityColor(exam.priority)}`}>
                            {exam.priority.toUpperCase()} PRIORITY
                          </span>
                          {isCritical && <Zap className="w-4 h-4 text-red-500 animate-bounce" />}
                          {isUrgent && <AlertTriangle className="w-4 h-4 text-orange-500 animate-pulse" />}
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

                      {/* Advanced Countdown Timer */}
                      <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${timeData.bgColor}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Timer className={`w-5 h-5 ${timeData.color}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Time Remaining
                            </span>
                          </div>
                          {isCritical && (
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-red-500 animate-bounce" />
                              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                                Critical
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={`text-3xl font-bold mt-2 ${timeData.color} tracking-tight`}>
                          {timeData.text}
                        </div>
                        {timeData.type === 'critical' && (
                          <div className="mt-2 text-xs text-red-600 font-medium animate-pulse">
                            🚨 EXAM STARTING SOON!
                          </div>
                        )}
                        {timeData.type === 'today' && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            🎯 Good luck with your exam today!
                          </div>
                        )}
                      </div>

                      {/* Syllabus Progress Overview */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-green-600" />
                            Syllabus Progress
                          </h4>
                          <button
                            onClick={() => toggleSyllabusExpansion(exam.id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                          >
                            <span className="text-sm font-medium">
                              {isSyllabusExpanded ? 'Hide Details' : 'Manage Syllabus'}
                            </span>
                            {isSyllabusExpanded ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                            }
                          </button>
                        </div>
                        
                        {/* Overall Progress */}
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">{exam.overallProgress}%</span>
                            {exam.overallProgress === 100 && <Award className="w-4 h-4 text-yellow-500" />}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-700"
                            style={{ width: `${exam.overallProgress}%` }}
                          ></div>
                        </div>
                        
                        {exam.subjects.length > 0 && (
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>{exam.subjects.filter(s => s.isCompleted).length}/{exam.subjects.length} subjects completed</span>
                            <span>{stats.completedChapters}/{stats.totalChapters} chapters done</span>
                          </div>
                        )}
                      </div>

                      {/* Traditional Syllabus Section */}
                      {exam.syllabus && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-green-600" />
                            Exam Description
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {exam.syllabus}
                          </p>
                        </div>
                      )}
                      
                      {/* Exam Status Indicator */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            isCritical ? 'bg-red-500 animate-ping' :
                            isUrgent ? 'bg-orange-500 animate-pulse' :
                            isToday ? 'bg-green-500 animate-pulse' :
                            isPastDue ? 'bg-gray-400' : 'bg-blue-500'
                          }`}></div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {isCritical ? 'CRITICAL' :
                             isUrgent ? 'URGENT' :
                             isToday ? 'TODAY' :
                             isPastDue ? 'PAST DUE' : 'SCHEDULED'}
                          </span>
                        </div>
                        {(isCritical || isUrgent) && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-bold text-red-600">
                              ACTION NEEDED
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Syllabus Tracker */}
                  {isSyllabusExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 p-6">
                      <SyllabusTracker 
                        exam={exam} 
                        onUpdateExam={handleUpdateExam} 
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
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
      `}</style>
    </div>
  );
};

export default Exams;
