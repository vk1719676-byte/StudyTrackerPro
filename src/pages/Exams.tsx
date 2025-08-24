import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Calendar, Clock, AlertTriangle, Edit, Trash2, Search, Filter, 
  SortAsc, SortDesc, BarChart3, Timer, BookOpen, Target, TrendingUp,
  CheckCircle2, Circle, Play, Pause, RotateCcw, Download, Eye, EyeOff,
  Archive, Star, Award, Flame
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, addExam, updateExam, deleteExam } from '../services/firestore';
import { Exam } from '../types';

interface StudySession {
  date: Date;
  duration: number; // in minutes
  topics: string[];
  notes?: string;
}

interface EnhancedExam extends Exam {
  studySessions?: StudySession[];
  totalStudyTime?: number;
  completionPercentage?: number;
  category?: string;
  isStarred?: boolean;
  lastStudied?: Date;
}

export const Exams: React.FC = () => {
  const [exams, setExams] = useState<EnhancedExam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<EnhancedExam | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    syllabus: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dailyHours: '',
    weeklyHours: '',
    category: '',
    estimatedHours: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStats, setShowStats] = useState(false);
  const [studyTimer, setStudyTimer] = useState<{
    examId: string | null;
    startTime: Date | null;
    duration: number;
    isRunning: boolean;
  }>({
    examId: null,
    startTime: null,
    duration: 0,
    isRunning: false
  });
  const [selectedExams, setSelectedExams] = useState<Set<string>>(new Set());

  const { user } = useAuth();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (studyTimer.isRunning && studyTimer.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - studyTimer.startTime!.getTime()) / 1000);
        setStudyTimer(prev => ({ ...prev, duration: elapsed }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [studyTimer.isRunning, studyTimer.startTime]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserExams(user.uid, (examData) => {
      // Enhance exam data with additional properties
      const enhancedExams = examData.map(exam => ({
        ...exam,
        studySessions: exam.studySessions || [],
        totalStudyTime: exam.totalStudyTime || 0,
        completionPercentage: exam.completionPercentage || 0,
        category: exam.category || 'General',
        isStarred: exam.isStarred || false,
        lastStudied: exam.lastStudied
      }));
      setExams(enhancedExams);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(exams.map(exam => exam.category || 'General'));
    return Array.from(cats);
  }, [exams]);

  // Filter and sort exams
  const filteredAndSortedExams = useMemo(() => {
    let filtered = exams.filter(exam => {
      // Search filter
      if (searchQuery && !exam.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !exam.syllabus.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Priority filter
      if (filterBy !== 'all') {
        if (filterBy === 'urgent') {
          const timeRemaining = getTimeRemaining(exam.date);
          const isUrgent = timeRemaining.includes('day') && parseInt(timeRemaining) <= 7;
          if (!isUrgent) return false;
        } else if (exam.priority !== filterBy) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && exam.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Sort exams
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'progress':
          comparison = (b.completionPercentage || 0) - (a.completionPercentage || 0);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [exams, searchQuery, sortBy, sortOrder, filterBy, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const totalExams = exams.length;
    const urgentExams = exams.filter(exam => {
      const timeRemaining = getTimeRemaining(exam.date);
      return timeRemaining.includes('day') && parseInt(timeRemaining) <= 7;
    }).length;
    const totalStudyTime = exams.reduce((acc, exam) => acc + (exam.totalStudyTime || 0), 0);
    const avgProgress = totalExams > 0 ? 
      exams.reduce((acc, exam) => acc + (exam.completionPercentage || 0), 0) / totalExams : 0;

    return {
      totalExams,
      urgentExams,
      totalStudyTime: Math.floor(totalStudyTime / 60), // Convert to hours
      avgProgress: Math.round(avgProgress)
    };
  }, [exams]);

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      syllabus: '',
      priority: 'medium',
      dailyHours: '',
      weeklyHours: '',
      category: '',
      estimatedHours: ''
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
      category: formData.category || 'General',
      estimatedHours: parseFloat(formData.estimatedHours) || 0,
      goals: {
        dailyHours: parseFloat(formData.dailyHours) || 0,
        weeklyHours: parseFloat(formData.weeklyHours) || 0,
        topicProgress: {}
      },
      studySessions: [],
      totalStudyTime: 0,
      completionPercentage: 0,
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

  const handleEdit = (exam: EnhancedExam) => {
    setFormData({
      name: exam.name,
      date: exam.date.toISOString().split('T')[0],
      syllabus: exam.syllabus,
      priority: exam.priority,
      dailyHours: exam.goals.dailyHours.toString(),
      weeklyHours: exam.goals.weeklyHours.toString(),
      category: exam.category || '',
      estimatedHours: exam.estimatedHours?.toString() || ''
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

  const handleBulkDelete = async () => {
    if (selectedExams.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedExams.size} exam(s)?`)) {
      try {
        await Promise.all(Array.from(selectedExams).map(id => deleteExam(id)));
        setSelectedExams(new Set());
      } catch (error) {
        console.error('Error deleting exams:', error);
      }
    }
  };

  const toggleStarExam = async (exam: EnhancedExam) => {
    try {
      await updateExam(exam.id, { ...exam, isStarred: !exam.isStarred });
    } catch (error) {
      console.error('Error updating exam:', error);
    }
  };

  const startStudyTimer = (examId: string) => {
    setStudyTimer({
      examId,
      startTime: new Date(),
      duration: 0,
      isRunning: true
    });
  };

  const pauseStudyTimer = () => {
    setStudyTimer(prev => ({ ...prev, isRunning: false }));
  };

  const stopStudyTimer = async () => {
    if (studyTimer.examId && studyTimer.duration > 0) {
      // Save study session
      const exam = exams.find(e => e.id === studyTimer.examId);
      if (exam) {
        const newSession: StudySession = {
          date: new Date(),
          duration: Math.floor(studyTimer.duration / 60), // Convert to minutes
          topics: [],
          notes: ''
        };
        
        const updatedExam = {
          ...exam,
          studySessions: [...(exam.studySessions || []), newSession],
          totalStudyTime: (exam.totalStudyTime || 0) + studyTimer.duration,
          lastStudied: new Date()
        };

        await updateExam(exam.id, updatedExam);
      }
    }
    
    setStudyTimer({
      examId: null,
      startTime: null,
      duration: 0,
      isRunning: false
    });
  };

  const exportData = () => {
    const dataToExport = {
      exams: exams,
      exportDate: new Date(),
      stats: stats
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `exams_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Your Exams
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your upcoming exams and track your preparation progress
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowStats(!showStats)}
              icon={BarChart3}
              variant="secondary"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
            <Button
              onClick={exportData}
              icon={Download}
              variant="secondary"
            >
              Export
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              icon={Plus}
            >
              Add Exam
            </Button>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalExams}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Exams</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.urgentExams}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Urgent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalStudyTime}h
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.avgProgress}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Study Timer */}
        {studyTimer.examId && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Study Session Active
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {exams.find(e => e.id === studyTimer.examId)?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(studyTimer.duration)}
                </div>
                <div className="flex gap-2">
                  {studyTimer.isRunning ? (
                    <Button onClick={pauseStudyTimer} icon={Pause} size="sm" variant="secondary">
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={() => setStudyTimer(prev => ({ ...prev, isRunning: true, startTime: new Date() }))} icon={Play} size="sm">
                      Resume
                    </Button>
                  )}
                  <Button onClick={stopStudyTimer} icon={RotateCcw} size="sm" variant="secondary">
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <Button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              icon={sortOrder === 'asc' ? SortAsc : SortDesc}
              variant="secondary"
              size="sm"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="priority">Sort by Priority</option>
              <option value="progress">Sort by Progress</option>
            </select>

            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              icon={viewMode === 'grid' ? Eye : EyeOff}
              variant="secondary"
              size="sm"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedExams.size > 0 && (
          <Card className="mb-6 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedExams.size} exam(s) selected
              </span>
              <div className="flex gap-2">
                <Button onClick={handleBulkDelete} icon={Trash2} size="sm" variant="secondary">
                  Delete Selected
                </Button>
                <Button onClick={() => setSelectedExams(new Set())} size="sm" variant="ghost">
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Form */}
        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {editingExam ? 'Edit Exam' : 'Add New Exam'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Exam Name"
                  placeholder="e.g., Mathematics Final"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />

                <Input
                  label="Exam Date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => setFormData({ ...formData, date: value })}
                  required
                />

                <Input
                  label="Category/Subject"
                  placeholder="e.g., Mathematics, Science"
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <Input
                  label="Estimated Total Hours"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 50"
                  value={formData.estimatedHours}
                  onChange={(value) => setFormData({ ...formData, estimatedHours: value })}
                />

                <Input
                  label="Daily Study Goal (hours)"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 2"
                  value={formData.dailyHours}
                  onChange={(value) => setFormData({ ...formData, dailyHours: value })}
                />

                <Input
                  label="Weekly Study Goal (hours)"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 14"
                  value={formData.weeklyHours}
                  onChange={(value) => setFormData({ ...formData, weeklyHours: value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Syllabus/Topics
                </label>
                <textarea
                  placeholder="List the main topics or chapters to cover..."
                  value={formData.syllabus}
                  onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingExam ? 'Update Exam' : 'Add Exam'}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Exams Grid/List */}
        {filteredAndSortedExams.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {exams.length === 0 ? 'No exams yet' : 'No exams match your filters'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {exams.length === 0 
                ? 'Add your first exam to start tracking your preparation progress'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {exams.length === 0 && (
              <Button onClick={() => setShowForm(true)} icon={Plus}>
                Add Your First Exam
              </Button>
            )}
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredAndSortedExams.map((exam) => {
              const timeRemaining = getTimeRemaining(exam.date);
              const isUrgent = timeRemaining.includes('day') && parseInt(timeRemaining) <= 7;
              const progressPercentage = exam.completionPercentage || 0;
              const isSelected = selectedExams.has(exam.id);

              return (
                <Card 
                  key={exam.id} 
                  className={`p-6 transition-all duration-200 ${
                    isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                  } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
                    viewMode === 'list' ? 'flex items-center justify-between' : ''
                  }`}
                  hover
                >
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-6 flex-1' : ''}`}>
                    {/* Checkbox for selection */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newSelected = new Set(selectedExams);
                          if (e.target.checked) {
                            newSelected.add(exam.id);
                          } else {
                            newSelected.delete(exam.id);
                          }
                          setSelectedExams(newSelected);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className={`flex justify-between items-start ${viewMode === 'list' ? 'mb-0' : 'mb-4'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {exam.name}
                            </h3>
                            {exam.isStarred && <Star className="w-4 h-4 text-yellow-500" />}
                            {exam.category && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-full">
                                {exam.category}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(exam.priority)}`}>
                              {exam.priority.toUpperCase()}
                            </span>
                            {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </div>
                        </div>
                      </div>

                      {viewMode === 'grid' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {exam.date.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {timeRemaining}
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Study Goals</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <div>Daily: {exam.goals.dailyHours}h</div>
                              <div>Weekly: {exam.goals.weeklyHours}h</div>
                              {exam.totalStudyTime && (
                                <div>Total Studied: {Math.floor((exam.totalStudyTime || 0) / 3600)}h</div>
                              )}
                            </div>
                          </div>

                          {exam.lastStudied && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <BookOpen className="w-4 h-4" />
                              Last studied: {exam.lastStudied.toLocaleDateString()}
                            </div>
                          )}

                          {exam.syllabus && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Syllabus</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                {exam.syllabus}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex ${viewMode === 'list' ? 'gap-2' : 'gap-1 mt-4'}`}>
                    {studyTimer.examId !== exam.id && (
                      <Button
                        onClick={() => startStudyTimer(exam.id)}
                        icon={Timer}
                        size="sm"
                        variant="secondary"
                        className={viewMode === 'list' ? '' : 'flex-1'}
                      >
                        Study
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={exam.isStarred ? Star : Star}
                      onClick={() => toggleStarExam(exam)}
                      className={`${exam.isStarred ? 'text-yellow-500' : 'text-gray-400'} p-2`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(exam)}
                      className="p-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(exam.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
