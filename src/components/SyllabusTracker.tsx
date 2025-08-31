import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Check, 
  Clock, 
  Award, 
  BookOpen, 
  Target, 
  Brain, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Timer
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Subject, Chapter, Exam } from '../types';

interface SyllabusTrackerProps {
  exam: Exam;
  onUpdateExam: (examId: string, updates: Partial<Exam>) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({ exam, onUpdateExam }) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingChapter, setEditingChapter] = useState<{ subjectId: string; chapter: Chapter } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterDifficulty, setNewChapterDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Edit form states
  const [editSubjectName, setEditSubjectName] = useState('');
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
  const progressStats = useMemo(() => {
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
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
      
      // Find the subject and chapter to ensure they exist
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
            completedAt: isCompleted ? new Date() : undefined
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

  const startEditingSubject = (subject: Subject) => {
    if (!subject) return;
    setEditingSubject(subject);
    setEditSubjectName(subject.name || '');
  };

  const saveSubjectEdit = async () => {
    if (!editingSubject || !editSubjectName.trim() || isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      const updatedSubjects = safeSubjects.map(subject => 
        subject && subject.id === editingSubject.id 
          ? { ...subject, name: editSubjectName.trim() }
          : subject
      );

      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
      
      setEditingSubject(null);
      setEditSubjectName('');
    } catch (error) {
      console.error('Error saving subject edit:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelSubjectEdit = () => {
    setEditingSubject(null);
    setEditSubjectName('');
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

  const deleteSubject = async (subjectId: string) => {
    if (!window.confirm('Are you sure you want to delete this subject and all its chapters?') || isUpdating || !subjectId) return;
    
    try {
      setIsUpdating(true);
      
      const updatedSubjects = safeSubjects.filter(subject => subject && subject.id !== subjectId);
      await onUpdateExam(exam.id, { 
        subjects: updatedSubjects,
        overallProgress: calculateOverallProgress(updatedSubjects)
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteChapter = async (subjectId: string, chapterId: string) => {
    if (!window.confirm('Are you sure you want to delete this chapter?') || isUpdating || !subjectId || !chapterId) return;
    
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  // Early return with loading state if exam data is invalid
  if (!exam || !exam.id) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading exam data...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Overall Progress Dashboard */}
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-purple-900/20 border-0 shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                {exam.name || 'Exam Preparation'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your progress and stay organized
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3">
              <Award className="w-6 h-6 text-yellow-500" />
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">Overall Progress</p>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {progressStats.overallProgress}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-medium">Progress Overview</span>
              <span className="font-medium">{progressStats.completedChapters}/{progressStats.totalChapters} chapters completed</span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progressStats.overallProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Subjects</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{safeSubjects.length}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-green-600 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{progressStats.completedSubjects}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-purple-600 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Chapters</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{progressStats.totalChapters}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <Timer className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-orange-600 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Study Time</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{Math.round(progressStats.totalStudyTime / 60)}h</p>
            </div>
          </div>

          {/* Add Subject Button */}
          <div className="mt-6">
            <Button
              onClick={() => setShowAddSubject(true)}
              icon={Plus}
              variant="secondary"
              disabled={isUpdating}
              className="w-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 transition-all duration-200 py-3"
            >
              Add New Subject
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Subject Form */}
      {showAddSubject && (
        <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-600 shadow-xl">
          <div className="p-4 sm:p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add New Subject
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Subject name (e.g., Mathematics, Physics)"
                value={newSubjectName}
                onChange={setNewSubjectName}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                disabled={isUpdating}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={addSubject}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                  disabled={!newSubjectName.trim() || isUpdating}
                >
                  {isUpdating ? 'Adding...' : 'Add'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddSubject(false);
                    setNewSubjectName('');
                  }}
                  variant="secondary"
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Subject Form */}
      {editingSubject && (
        <Card className="overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-green-200 dark:border-green-600 shadow-xl">
          <div className="p-4 sm:p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-green-600" />
              Edit Subject
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Subject name"
                value={editSubjectName}
                onChange={setEditSubjectName}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && saveSubjectEdit()}
                disabled={isUpdating}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={saveSubjectEdit}
                  icon={Save}
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                  disabled={!editSubjectName.trim() || isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={cancelSubjectEdit}
                  icon={X}
                  variant="secondary"
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Chapter Form */}
      {editingChapter && (
        <Card className="overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-green-200 dark:border-green-600 shadow-xl">
          <div className="p-4 sm:p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-green-600" />
              Edit Chapter
            </h4>
            <div className="space-y-3">
              <Input
                placeholder="Chapter name"
                value={editChapterName}
                onChange={setEditChapterName}
                onKeyPress={(e) => e.key === 'Enter' && saveChapterEdit()}
                disabled={isUpdating}
              />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                  value={editChapterDifficulty}
                  onChange={(e) => setEditChapterDifficulty(e.target.value as any)}
                  className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isUpdating}
                >
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <Button 
                    onClick={saveChapterEdit}
                    icon={Save}
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    disabled={!editChapterName.trim() || isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    onClick={cancelChapterEdit}
                    icon={X}
                    variant="secondary"
                    disabled={isUpdating}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Subjects List */}
      <div className="space-y-4">
        {safeSubjects.map((subject) => {
          if (!subject || !subject.id) return null;
          
          const subjectStats = progressStats.subjectProgress.find(s => s && s.id === subject.id);
          const isExpanded = expandedSubjects.has(subject.id);
          const safeChapters = subject.chapters || [];
          
          return (
            <Card key={subject.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Subject Header */}
              <div 
                className={`p-4 sm:p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                  subject.isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => toggleSubjectExpansion(subject.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isExpanded ? 
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" />
                      }
                      {subject.isCompleted ? 
                        <CheckCircle2 className="w-6 h-6 text-green-600" /> :
                        <Circle className="w-6 h-6 text-gray-400" />
                      }
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                          {subject.name || 'Unnamed Subject'}
                        </h4>
                        {subject.isCompleted && <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />}
                      </div>
                      
                      {/* Subject Progress Bar */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm ${
                              subject.isCompleted ? 
                              'bg-gradient-to-r from-green-500 to-emerald-600' :
                              'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}
                            style={{ width: `${subjectStats?.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">
                          {Math.round(subjectStats?.progress || 0)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {subjectStats?.completedChapters || 0} of {subjectStats?.totalChapters || 0} chapters completed
                      </p>
                    </div>
                  </div>
                  
                  {/* Subject Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startEditingSubject(subject);
                      }}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg"
                      disabled={isUpdating}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteSubject(subject.id);
                      }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Subject Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  {/* Chapter List */}
                  <div className="p-4 space-y-3">
                    {safeChapters.map((chapter) => {
                      if (!chapter || !chapter.id) return null;
                      
                      return (
                        <div key={chapter.id} className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleChapterCompletion(subject.id, chapter.id);
                            }}
                            disabled={isUpdating}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 ${
                              chapter.isCompleted 
                                ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {chapter.isCompleted && <Check className="w-3 h-3" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <span className={`font-medium transition-all duration-200 truncate ${
                                chapter.isCompleted 
                                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {chapter.name || 'Unnamed Chapter'}
                              </span>
                              {chapter.difficulty && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getDifficultyColor(chapter.difficulty)}`}>
                                  {getDifficultyIcon(chapter.difficulty)} {chapter.difficulty}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                              {chapter.completedAt && (
                                <p className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Completed {new Date(chapter.completedAt).toLocaleDateString()}
                                </p>
                              )}
                              {chapter.studyTime && chapter.studyTime > 0 && (
                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {Math.round(chapter.studyTime / 60)}h studied
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                startEditingChapter(subject.id, chapter);
                              }}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg"
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
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                              disabled={isUpdating}
                            />
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Chapter Form */}
                    {showAddChapter === subject.id ? (
                      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600">
                        <div className="space-y-3">
                          <Input
                            placeholder="Chapter name (e.g., Calculus, Derivatives)"
                            value={newChapterName}
                            onChange={setNewChapterName}
                            onKeyPress={(e) => e.key === 'Enter' && addChapter(subject.id)}
                            disabled={isUpdating}
                          />
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <select
                              value={newChapterDifficulty}
                              onChange={(e) => setNewChapterDifficulty(e.target.value as any)}
                              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              disabled={isUpdating}
                            >
                              <option value="easy">🟢 Easy</option>
                              <option value="medium">🟡 Medium</option>
                              <option value="hard">🔴 Hard</option>
                            </select>
                            <div className="flex gap-2 flex-1 sm:flex-none">
                              <Button 
                                onClick={() => addChapter(subject.id)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                                disabled={!newChapterName.trim() || isUpdating}
                              >
                                {isUpdating ? 'Adding...' : 'Add Chapter'}
                              </Button>
                              <Button 
                                onClick={() => {
                                  setShowAddChapter(null);
                                  setNewChapterName('');
                                  setNewChapterDifficulty('medium');
                                }}
                                variant="secondary"
                                size="sm"
                                disabled={isUpdating}
                                className="flex-1 sm:flex-none"
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
                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg"
                        disabled={isUpdating}
                      >
                        <span className="truncate">Add Chapter to {subject.name || 'Subject'}</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State for Subjects */}
      {safeSubjects.length === 0 && (
        <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 shadow-lg">
          <div className="p-6 sm:p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-blue-400 mb-4" />
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Subjects Added Yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start organizing your exam preparation by adding subjects and their chapters to track your progress
            </p>
            <Button
              onClick={() => setShowAddSubject(true)}
              icon={Plus}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              disabled={isUpdating}
            >
              Add Your First Subject
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

