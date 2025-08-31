import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Check, 
  Clock, 
  Star, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Zap, 
  Timer, 
  Brain, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  MoreVertical,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Subject, Chapter, Exam, ProgressStats } from '../types';

interface SyllabusTrackerProps {
  exam: Exam;
  onUpdateExam: (examId: string, updates: Partial<Exam>) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({ exam, onUpdateExam }) => {
  // State management
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingChapter, setEditingChapter] = useState<{ subjectId: string; chapter: Chapter } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSubjectActions, setShowSubjectActions] = useState<string | null>(null);
  
  // Form states
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterDifficulty, setNewChapterDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Edit form states
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectDescription, setEditSubjectDescription] = useState('');
  const [editChapterName, setEditChapterName] = useState('');
  const [editChapterDifficulty, setEditChapterDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Safe access to exam subjects with fallback
  const safeSubjects = useMemo(() => {
    if (!exam || !exam.subjects || !Array.isArray(exam.subjects)) {
      return [];
    }
    return exam.subjects.filter(subject => subject && typeof subject === 'object');
  }, [exam]);

  // Calculate comprehensive progress statistics
  const progressStats: ProgressStats = useMemo(() => {
    try {
      const totalChapters = safeSubjects.reduce((acc, subject) => {
        if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) return acc;
        return acc + subject.chapters.length;
      }, 0);
      
      const completedChapters = safeSubjects.reduce((acc, subject) => {
        if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) return acc;
        return acc + subject.chapters.filter(chapter => chapter && chapter.isCompleted).length;
      }, 0);
      
      const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
      
      const subjectProgress = safeSubjects.map(subject => {
        if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) {
          return {
            ...subject,
            progress: 0,
            completedChapters: 0,
            totalChapters: 0
          };
        }
        
        const completed = subject.chapters.filter(ch => ch && ch.isCompleted).length;
        const total = subject.chapters.length;
        return {
          ...subject,
          progress: total > 0 ? (completed / total) * 100 : 0,
          completedChapters: completed,
          totalChapters: total
        };
      });

      const totalStudyTime = safeSubjects.reduce((acc, subject) => {
        if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) return acc;
        return acc + subject.chapters.reduce((chAcc, chapter) => {
          if (!chapter) return chAcc;
          return chAcc + (chapter.studyTime || 0);
        }, 0);
      }, 0);

      return {
        overallProgress: Math.round(overallProgress),
        totalChapters,
        completedChapters,
        totalStudyTime,
        subjectProgress,
        completedSubjects: safeSubjects.filter(s => s && s.isCompleted).length
      };
    } catch (error) {
      console.error('Error calculating progress stats:', error);
      return {
        overallProgress: 0,
        totalChapters: 0,
        completedChapters: 0,
        totalStudyTime: 0,
        subjectProgress: [],
        completedSubjects: 0
      };
    }
  }, [safeSubjects]);

  // Helper functions
  const toggleSubjectExpansion = (subjectId: string) => {
    try {
      if (!subjectId) return;
      
      const newExpanded = new Set(expandedSubjects);
      if (newExpanded.has(subjectId)) {
        newExpanded.delete(subjectId);
      } else {
        newExpanded.add(subjectId);
      }
      setExpandedSubjects(newExpanded);
      // Close any open action menus
      setShowSubjectActions(null);
    } catch (error) {
      console.error('Error toggling subject expansion:', error);
    }
  };

  const calculateOverallProgress = (subjects: Subject[]) => {
    try {
      if (!subjects || !Array.isArray(subjects)) return 0;
      
      const totalChapters = subjects.reduce((acc, subject) => {
        if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) return acc;
        return acc + subject.chapters.length;
      }, 0);
      
      const completedChapters = subjects.reduce((acc, subject) => {
        if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) return acc;
        return acc + subject.chapters.filter(chapter => chapter && chapter.isCompleted).length;
      }, 0);
      
      return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      return 0;
    }
  };

  const getRandomSubjectColor = () => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-cyan-500 to-cyan-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // CRUD Operations
  const addSubject = async () => {
    if (!newSubjectName.trim() || isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      if (!exam || !exam.id) {
        console.error('Invalid exam data');
        return;
      }
      
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
        description: newSubjectDescription.trim() || undefined,
        chapters: [],
        color: getRandomSubjectColor(),
        isCompleted: false
      };

      const updatedSubjects = [...safeSubjects, newSubject];
      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
      
      setNewSubjectName('');
      setNewSubjectDescription('');
      setShowAddSubject(false);
      
      // Auto-expand the new subject
      setExpandedSubjects(prev => new Set([...prev, newSubject.id]));
    } catch (error) {
      console.error('Error adding subject:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const addChapter = async (subjectId: string) => {
    if (!newChapterName.trim() || isUpdating || !subjectId) return;
    
    try {
      setIsUpdating(true);
      
      const newChapter: Chapter = {
        id: Date.now().toString(),
        name: newChapterName.trim(),
        isCompleted: false,
        difficulty: newChapterDifficulty,
        studyTime: 0
      };

      const updatedSubjects = safeSubjects.map(subject => {
        if (!subject || subject.id !== subjectId) return subject;
        
        const currentChapters = subject.chapters || [];
        const updatedChapters = [...currentChapters, newChapter];
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch && ch.isCompleted) && updatedChapters.length > 0
        };
      });

      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
      
      setNewChapterName('');
      setNewChapterDifficulty('medium');
      setShowAddChapter(null);
    } catch (error) {
      console.error('Error adding chapter:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleChapterCompletion = async (subjectId: string, chapterId: string) => {
    if (isUpdating || !subjectId || !chapterId) return;
    
    try {
      setIsUpdating(true);
      
      const subject = safeSubjects.find(s => s && s.id === subjectId);
      if (!subject || !subject.chapters || !Array.isArray(subject.chapters)) {
        console.error('Subject not found or invalid');
        return;
      }
      
      const chapter = subject.chapters.find(c => c && c.id === chapterId);
      if (!chapter) {
        console.error('Chapter not found');
        return;
      }

      const updatedSubjects = safeSubjects.map(subject => {
        if (!subject || subject.id !== subjectId) return subject;
        
        const updatedChapters = (subject.chapters || []).map(chapter => {
          if (!chapter || chapter.id !== chapterId) return chapter;
          
          const isCompleted = !chapter.isCompleted;
          return {
            ...chapter,
            isCompleted,
            completedAt: isCompleted ? new Date() : undefined,
            studyTime: isCompleted ? (chapter.studyTime || 0) + 30 : chapter.studyTime
          };
        });
        
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch && ch.isCompleted) && updatedChapters.length > 0
        };
      });

      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
    } catch (error) {
      console.error('Error toggling chapter completion:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Edit operations
  const startEditingSubject = (subject: Subject) => {
    if (!subject) return;
    setEditingSubject(subject);
    setEditSubjectName(subject.name || '');
    setEditSubjectDescription(subject.description || '');
    setShowSubjectActions(null);
  };

  const saveSubjectEdit = async () => {
    if (!editingSubject || !editSubjectName.trim() || isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      const updatedSubjects = safeSubjects.map(subject => 
        subject && subject.id === editingSubject.id 
          ? { 
              ...subject, 
              name: editSubjectName.trim(),
              description: editSubjectDescription.trim() || undefined
            }
          : subject
      );

      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
      
      setEditingSubject(null);
      setEditSubjectName('');
      setEditSubjectDescription('');
    } catch (error) {
      console.error('Error saving subject edit:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelSubjectEdit = () => {
    setEditingSubject(null);
    setEditSubjectName('');
    setEditSubjectDescription('');
  };

  const startEditingChapter = (subjectId: string, chapter: Chapter) => {
    if (!subjectId || !chapter) return;
    setEditingChapter({ subjectId, chapter });
    setEditChapterName(chapter.name || '');
    setEditChapterDifficulty(chapter.difficulty || 'medium');
  };

  const saveChapterEdit = async () => {
    if (!editingChapter || !editChapterName.trim() || isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      const updatedSubjects = safeSubjects.map(subject => {
        if (!subject || subject.id !== editingChapter.subjectId) return subject;
        
        const updatedChapters = (subject.chapters || []).map(chapter => 
          chapter && chapter.id === editingChapter.chapter.id
            ? { 
                ...chapter, 
                name: editChapterName.trim(),
                difficulty: editChapterDifficulty
              }
            : chapter
        );
        
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch && ch.isCompleted) && updatedChapters.length > 0
        };
      });

      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
      
      setEditingChapter(null);
      setEditChapterName('');
      setEditChapterDifficulty('medium');
    } catch (error) {
      console.error('Error saving chapter edit:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelChapterEdit = () => {
    setEditingChapter(null);
    setEditChapterName('');
    setEditChapterDifficulty('medium');
  };

  // Delete operations
  const deleteSubject = async (subjectId: string) => {
    if (isUpdating || !subjectId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this subject and all its chapters? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      setIsUpdating(true);
      
      const updatedSubjects = safeSubjects.filter(subject => subject && subject.id !== subjectId);
      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
      setShowSubjectActions(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteChapter = async (subjectId: string, chapterId: string) => {
    if (isUpdating || !subjectId || !chapterId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      setIsUpdating(true);
      
      const updatedSubjects = safeSubjects.map(subject => {
        if (!subject || subject.id !== subjectId) return subject;
        
        const updatedChapters = (subject.chapters || []).filter(chapter => chapter && chapter.id !== chapterId);
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch && ch.isCompleted) && updatedChapters.length > 0
        };
      });

      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Utility functions
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': 
        return {
          color: 'text-green-700 bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
          icon: '🟢',
          label: 'Easy'
        };
      case 'medium': 
        return {
          color: 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
          icon: '🟡',
          label: 'Medium'
        };
      case 'hard': 
        return {
          color: 'text-red-700 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
          icon: '🔴',
          label: 'Hard'
        };
      default: 
        return {
          color: 'text-gray-700 bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600',
          icon: '⚪',
          label: 'Unknown'
        };
    }
  };

  // Close action menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowSubjectActions(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close forms on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddSubject(false);
        setShowAddChapter(null);
        cancelSubjectEdit();
        cancelChapterEdit();
        setShowSubjectActions(null);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Early return with loading state if exam data is invalid
  if (!exam || !exam.id) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <span className="mt-4 text-gray-600 dark:text-gray-400 text-center">Loading exam data...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Enhanced Overall Progress Dashboard */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-0 shadow-xl">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Syllabus Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {exam.name || 'Exam Preparation'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 rounded-xl px-4 py-3 shadow-lg flex-shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {progressStats.overallProgress}%
            </span>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="font-medium">Overall Progress</span>
            <span className="font-medium">{progressStats.completedChapters}/{progressStats.totalChapters} chapters</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 sm:h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progressStats.overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Responsive Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
          <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Subjects</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{safeSubjects.length}</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Completed</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{progressStats.completedSubjects}</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chapters</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{progressStats.totalChapters}</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 col-span-2 lg:col-span-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Study Time</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{Math.round(progressStats.totalStudyTime / 60)}h</p>
          </div>
        </div>

        {/* Add Subject Button */}
        <Button
          onClick={() => setShowAddSubject(true)}
          icon={Plus}
          variant="secondary"
          disabled={isUpdating}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 transition-all duration-200 hover:shadow-md text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Add New Subject</span>
          <span className="sm:hidden">Add Subject</span>
        </Button>
      </Card>

      {/* Add Subject Form */}
      {showAddSubject && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-600 shadow-xl">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add New Subject
          </h4>
          <div className="space-y-4">
            <Input
              placeholder="Subject name (e.g., Mathematics, Physics)"
              value={newSubjectName}
              onChange={setNewSubjectName}
              onKeyPress={(e) => e.key === 'Enter' && !newSubjectDescription && addSubject()}
              disabled={isUpdating}
            />
            <Input
              placeholder="Description (optional)"
              value={newSubjectDescription}
              onChange={setNewSubjectDescription}
              onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              disabled={isUpdating}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={addSubject}
                icon={Save}
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                disabled={!newSubjectName.trim() || isUpdating}
                loading={isUpdating}
              >
                {isUpdating ? 'Adding...' : 'Add Subject'}
              </Button>
              <Button 
                onClick={() => {
                  setShowAddSubject(false);
                  setNewSubjectName('');
                  setNewSubjectDescription('');
                }}
                icon={X}
                variant="secondary"
                disabled={isUpdating}
                className="flex-1 sm:flex-none h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Subject Form */}
      {editingSubject && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-green-200 dark:border-green-600 shadow-xl">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-green-600" />
            Edit Subject
          </h4>
          <div className="space-y-4">
            <Input
              placeholder="Subject name"
              value={editSubjectName}
              onChange={setEditSubjectName}
              onKeyPress={(e) => e.key === 'Enter' && !editSubjectDescription && saveSubjectEdit()}
              disabled={isUpdating}
            />
            <Input
              placeholder="Description (optional)"
              value={editSubjectDescription}
              onChange={setEditSubjectDescription}
              onKeyPress={(e) => e.key === 'Enter' && saveSubjectEdit()}
              disabled={isUpdating}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={saveSubjectEdit}
                icon={Save}
                className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                disabled={!editSubjectName.trim() || isUpdating}
                loading={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                onClick={cancelSubjectEdit}
                icon={X}
                variant="secondary"
                disabled={isUpdating}
                className="flex-1 sm:flex-none h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Chapter Form */}
      {editingChapter && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-green-200 dark:border-green-600 shadow-xl">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-green-600" />
            Edit Chapter
          </h4>
          <div className="space-y-4">
            <Input
              placeholder="Chapter name"
              value={editChapterName}
              onChange={setEditChapterName}
              onKeyPress={(e) => e.key === 'Enter' && saveChapterEdit()}
              disabled={isUpdating}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={editChapterDifficulty}
                onChange={(e) => setEditChapterDifficulty(e.target.value as any)}
                className="flex-1 h-11 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                disabled={isUpdating}
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
              <div className="flex gap-2">
                <Button 
                  onClick={saveChapterEdit}
                  icon={Save}
                  className="flex-1 sm:flex-none h-11 bg-green-600 hover:bg-green-700 text-sm"
                  disabled={!editChapterName.trim() || isUpdating}
                  loading={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={cancelChapterEdit}
                  icon={X}
                  variant="secondary"
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none h-11 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Subjects List */}
      <div className="space-y-4">
        {safeSubjects.map((subject) => {
          if (!subject || !subject.id) return null;
          
          const subjectStats = progressStats.subjectProgress.find(s => s && s.id === subject.id);
          const isExpanded = expandedSubjects.has(subject.id);
          const safeChapters = subject.chapters || [];
          const showActions = showSubjectActions === subject.id;
          
          return (
            <Card key={subject.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Subject Header */}
              <div className={`p-4 sm:p-5 transition-all duration-200 ${
                subject.isCompleted 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                    onClick={() => toggleSubjectExpansion(subject.id)}
                  >
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" /> : 
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" />
                      }
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                      >
                        {subject.isCompleted ? 
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 hover:text-green-700 transition-colors duration-200" /> :
                          <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                        }
                      </button>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                          {subject.name || 'Unnamed Subject'}
                        </h4>
                        {subject.isCompleted && <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />}
                      </div>
                      {subject.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                          {subject.description}
                        </p>
                      )}
                      
                      {/* Subject Progress Bar */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-700 ease-out ${
                              subject.isCompleted ? 
                              'bg-gradient-to-r from-green-500 to-emerald-600' :
                              'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}
                            style={{ width: `${subjectStats?.progress || 0}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                          <span className="font-bold">{Math.round(subjectStats?.progress || 0)}%</span>
                          <span className="hidden sm:inline">
                            ({subjectStats?.completedChapters || 0}/{subjectStats?.totalChapters || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject Actions - Mobile Optimized */}
                  <div className="relative flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={MoreVertical}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSubjectActions(showActions ? null : subject.id);
                      }}
                      className="w-10 h-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      disabled={isUpdating}
                    />
                    
                    {showActions && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20 min-w-[160px]">
                        <div className="p-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingSubject(subject);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                            disabled={isUpdating}
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Subject
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSubject(subject.id);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150"
                            disabled={isUpdating}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Subject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Subject Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Chapter List */}
                    {safeChapters.map((chapter) => {
                      if (!chapter || !chapter.id) return null;
                      
                      const difficultyConfig = getDifficultyConfig(chapter.difficulty);
                      
                      return (
                        <div key={chapter.id} className="group">
                          <div className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            {/* Completion Toggle */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleChapterCompletion(subject.id, chapter.id);
                              }}
                              disabled={isUpdating}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 ${
                                chapter.isCompleted 
                                  ? 'bg-green-600 border-green-600 text-white shadow-md' 
                                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {chapter.isCompleted && <Check className="w-3 h-3 sm:w-4 sm:h-4" />}
                            </button>
                            
                            {/* Chapter Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                <span className={`font-medium transition-all duration-200 truncate ${
                                  chapter.isCompleted 
                                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                                    : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                  {chapter.name || 'Unnamed Chapter'}
                                </span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {chapter.difficulty && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyConfig.color}`}>
                                      {difficultyConfig.icon} {difficultyConfig.label}
                                    </span>
                                  )}
                                  {chapter.studyTime && chapter.studyTime > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                      <Clock className="w-3 h-3" />
                                      {Math.round(chapter.studyTime / 60)}h
                                    </div>
                                  )}
                                </div>
                              </div>
                              {chapter.completedAt && (
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Completed {new Date(chapter.completedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            
                            {/* Chapter Actions - Always Visible on Mobile */}
                            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={Edit2}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  startEditingChapter(subject.id, chapter);
                                }}
                                className="w-8 h-8 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                disabled={isUpdating}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={Trash2}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteChapter(subject.id, chapter.id);
                                }}
                                className="w-8 h-8 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                disabled={isUpdating}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Chapter Form */}
                    {showAddChapter === subject.id ? (
                      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600">
                        <div className="space-y-4">
                          <Input
                            placeholder="Chapter name (e.g., Calculus, Derivatives)"
                            value={newChapterName}
                            onChange={setNewChapterName}
                            onKeyPress={(e) => e.key === 'Enter' && addChapter(subject.id)}
                            disabled={isUpdating}
                          />
                          <div className="flex flex-col sm:flex-row gap-3">
                            <select
                              value={newChapterDifficulty}
                              onChange={(e) => setNewChapterDifficulty(e.target.value as any)}
                              className="flex-1 h-11 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              disabled={isUpdating}
                            >
                              <option value="easy">🟢 Easy</option>
                              <option value="medium">🟡 Medium</option>
                              <option value="hard">🔴 Hard</option>
                            </select>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => addChapter(subject.id)}
                                icon={Plus}
                                size="sm"
                                className="flex-1 sm:flex-none h-11 bg-blue-600 hover:bg-blue-700 text-sm"
                                disabled={!newChapterName.trim() || isUpdating}
                                loading={isUpdating}
                              >
                                <span className="hidden sm:inline">{isUpdating ? 'Adding...' : 'Add Chapter'}</span>
                                <span className="sm:hidden">Add</span>
                              </Button>
                              <Button 
                                onClick={() => {
                                  setShowAddChapter(null);
                                  setNewChapterName('');
                                  setNewChapterDifficulty('medium');
                                }}
                                icon={X}
                                variant="secondary"
                                size="sm"
                                disabled={isUpdating}
                                className="flex-1 sm:flex-none h-11 text-sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Button
                        onClick={() => setShowAddChapter(subject.id)}
                        variant="ghost"
                        icon={Plus}
                        className="w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm sm:text-base"
                        disabled={isUpdating}
                      >
                        <span className="hidden sm:inline">Add Chapter to {subject.name || 'Subject'}</span>
                        <span className="sm:hidden">Add Chapter</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Enhanced Study Insights Panel */}
      {safeSubjects.length > 0 && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Study Insights
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Streak</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressStats.completedChapters > 0 ? Math.min(progressStats.completedChapters, 7) : 0} days
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressStats.overallProgress}%
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Focus Score</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressStats.overallProgress > 75 ? 'A+' : progressStats.overallProgress > 50 ? 'B+' : progressStats.overallProgress > 25 ? 'C+' : 'F'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State for Subjects */}
      {safeSubjects.length === 0 && (
        <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Subjects Added Yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Start organizing your exam preparation by adding subjects and chapters to track your progress
          </p>
          <Button
            onClick={() => setShowAddSubject(true)}
            icon={Plus}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6 text-sm sm:text-base"
            disabled={isUpdating}
          >
            Add Your First Subject
          </Button>
        </Card>
      )}
    </div>
  );
};
