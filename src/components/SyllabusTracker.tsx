import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Plus, Check, Clock, Star, BookOpen, Target, TrendingUp, Award, Zap, Timer, Brain, CheckCircle2, Circle, Edit2, Trash2, Save, X } from 'lucide-react';
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
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterDifficulty, setNewChapterDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Edit form states
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editChapterName, setEditChapterName] = useState('');
  const [editChapterDifficulty, setEditChapterDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Calculate comprehensive progress statistics
  const progressStats = useMemo(() => {
    const totalChapters = exam.subjects.reduce((acc, subject) => acc + subject.chapters.length, 0);
    const completedChapters = exam.subjects.reduce((acc, subject) => 
      acc + subject.chapters.filter(chapter => chapter.isCompleted).length, 0);
    const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    
    const subjectProgress = exam.subjects.map(subject => {
      const completed = subject.chapters.filter(ch => ch.isCompleted).length;
      const total = subject.chapters.length;
      return {
        ...subject,
        progress: total > 0 ? (completed / total) * 100 : 0,
        completedChapters: completed,
        totalChapters: total
      };
    });

    const totalStudyTime = exam.subjects.reduce((acc, subject) => 
      acc + subject.chapters.reduce((chAcc, chapter) => chAcc + (chapter.studyTime || 0), 0), 0);

    return {
      overallProgress: Math.round(overallProgress),
      totalChapters,
      completedChapters,
      totalStudyTime,
      subjectProgress,
      completedSubjects: exam.subjects.filter(s => s.isCompleted).length
    };
  }, [exam.subjects]);

  const toggleSubjectExpansion = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const calculateOverallProgress = (subjects: Subject[]) => {
    const totalChapters = subjects.reduce((acc, subject) => acc + subject.chapters.length, 0);
    const completedChapters = subjects.reduce((acc, subject) => 
      acc + subject.chapters.filter(chapter => chapter.isCompleted).length, 0);
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  const getRandomSubjectColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addSubject = async () => {
    if (!newSubjectName.trim()) return;
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      chapters: [],
      color: getRandomSubjectColor(),
      isCompleted: false
    };

    const updatedSubjects = [...exam.subjects, newSubject];
    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
    
    setNewSubjectName('');
    setShowAddSubject(false);
    
    // Auto-expand the new subject
    setExpandedSubjects(prev => new Set([...prev, newSubject.id]));
  };

  const addChapter = async (subjectId: string) => {
    if (!newChapterName.trim()) return;
    
    const newChapter: Chapter = {
      id: Date.now().toString(),
      name: newChapterName.trim(),
      isCompleted: false,
      difficulty: newChapterDifficulty,
      studyTime: 0
    };

    const updatedSubjects = exam.subjects.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = [...subject.chapters, newChapter];
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch.isCompleted) && updatedChapters.length > 0
        };
      }
      return subject;
    });

    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
    
    setNewChapterName('');
    setNewChapterDifficulty('medium');
    setShowAddChapter(null);
  };

  const toggleChapterCompletion = async (subjectId: string, chapterId: string) => {
    const updatedSubjects = exam.subjects.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = subject.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            const isCompleted = !chapter.isCompleted;
            return {
              ...chapter,
              isCompleted,
              completedAt: isCompleted ? new Date() : undefined
            };
          }
          return chapter;
        });
        
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch.isCompleted) && updatedChapters.length > 0
        };
      }
      return subject;
    });

    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
  };

  const startEditingSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setEditSubjectName(subject.name);
  };

  const saveSubjectEdit = async () => {
    if (!editingSubject || !editSubjectName.trim()) return;
    
    const updatedSubjects = exam.subjects.map(subject => 
      subject.id === editingSubject.id 
        ? { ...subject, name: editSubjectName.trim() }
        : subject
    );

    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
    
    setEditingSubject(null);
    setEditSubjectName('');
  };

  const cancelSubjectEdit = () => {
    setEditingSubject(null);
    setEditSubjectName('');
  };

  const startEditingChapter = (subjectId: string, chapter: Chapter) => {
    setEditingChapter({ subjectId, chapter });
    setEditChapterName(chapter.name);
    setEditChapterDifficulty(chapter.difficulty || 'medium');
  };

  const saveChapterEdit = async () => {
    if (!editingChapter || !editChapterName.trim()) return;
    
    const updatedSubjects = exam.subjects.map(subject => {
      if (subject.id === editingChapter.subjectId) {
        const updatedChapters = subject.chapters.map(chapter => 
          chapter.id === editingChapter.chapter.id
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
          isCompleted: updatedChapters.every(ch => ch.isCompleted) && updatedChapters.length > 0
        };
      }
      return subject;
    });

    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
    
    setEditingChapter(null);
    setEditChapterName('');
    setEditChapterDifficulty('medium');
  };

  const cancelChapterEdit = () => {
    setEditingChapter(null);
    setEditChapterName('');
    setEditChapterDifficulty('medium');
  };

  const deleteSubject = async (subjectId: string) => {
    if (!window.confirm('Are you sure you want to delete this subject and all its chapters?')) return;
    
    const updatedSubjects = exam.subjects.filter(subject => subject.id !== subjectId);
    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
  };

  const deleteChapter = async (subjectId: string, chapterId: string) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    
    const updatedSubjects = exam.subjects.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = subject.chapters.filter(chapter => chapter.id !== chapterId);
        return {
          ...subject,
          chapters: updatedChapters,
          isCompleted: updatedChapters.every(ch => ch.isCompleted) && updatedChapters.length > 0
        };
      }
      return subject;
    });

    await onUpdateExam(exam.id, { 
      subjects: updatedSubjects,
      overallProgress: calculateOverallProgress(updatedSubjects)
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
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

  return (
    <div className="space-y-6">
      {/* Overall Progress Dashboard */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Syllabus Progress
          </h3>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold text-blue-600">{progressStats.overallProgress}%</span>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{progressStats.completedChapters}/{progressStats.totalChapters} chapters</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progressStats.overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <Target className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Subjects</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{exam.subjects.length}</p>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{progressStats.completedSubjects}</p>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <Brain className="w-5 h-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Chapters</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{progressStats.totalChapters}</p>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <Timer className="w-5 h-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Study Time</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{Math.round(progressStats.totalStudyTime / 60)}h</p>
          </div>
        </div>

        {/* Add Subject Button */}
        <Button
          onClick={() => setShowAddSubject(true)}
          icon={Plus}
          variant="secondary"
          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 transition-all duration-200"
        >
          Add New Subject
        </Button>
      </Card>

      {/* Add Subject Form */}
      {showAddSubject && (
        <Card className="p-6 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-600 shadow-xl">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add New Subject
          </h4>
          <div className="flex gap-3">
            <Input
              placeholder="Subject name (e.g., Mathematics, Physics)"
              value={newSubjectName}
              onChange={setNewSubjectName}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addSubject()}
            />
            <Button 
              onClick={addSubject}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!newSubjectName.trim()}
            >
              Add
            </Button>
            <Button 
              onClick={() => {
                setShowAddSubject(false);
                setNewSubjectName('');
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Subject Form */}
      {editingSubject && (
        <Card className="p-6 bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-green-200 dark:border-green-600 shadow-xl">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-green-600" />
            Edit Subject
          </h4>
          <div className="flex gap-3">
            <Input
              placeholder="Subject name"
              value={editSubjectName}
              onChange={setEditSubjectName}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && saveSubjectEdit()}
            />
            <Button 
              onClick={saveSubjectEdit}
              icon={Save}
              className="bg-green-600 hover:bg-green-700"
              disabled={!editSubjectName.trim()}
            >
              Save
            </Button>
            <Button 
              onClick={cancelSubjectEdit}
              icon={X}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Chapter Form */}
      {editingChapter && (
        <Card className="p-6 bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-green-200 dark:border-green-600 shadow-xl">
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
            />
            <div className="flex items-center gap-3">
              <select
                value={editChapterDifficulty}
                onChange={(e) => setEditChapterDifficulty(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
              <Button 
                onClick={saveChapterEdit}
                icon={Save}
                className="bg-green-600 hover:bg-green-700"
                disabled={!editChapterName.trim()}
              >
                Save
              </Button>
              <Button 
                onClick={cancelChapterEdit}
                icon={X}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Subjects List */}
      <div className="space-y-4">
        {exam.subjects.map((subject) => {
          const subjectStats = progressStats.subjectProgress.find(s => s.id === subject.id);
          const isExpanded = expandedSubjects.has(subject.id);
          
          return (
            <Card key={subject.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Subject Header */}
              <div 
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                  subject.isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => toggleSubjectExpansion(subject.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {isExpanded ? 
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" />
                      }
                      {subject.isCompleted ? 
                        <CheckCircle2 className="w-6 h-6 text-green-600" /> :
                        <Circle className="w-6 h-6 text-gray-400" />
                      }
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {subject.name}
                        </h4>
                        {subject.isCompleted && <Award className="w-5 h-5 text-yellow-500" />}
                      </div>
                      
                      {/* Subject Progress Bar */}
                      <div className="flex items-center gap-3">
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
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[3rem]">
                          {Math.round(subjectStats?.progress || 0)}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[4rem]">
                          {subjectStats?.completedChapters || 0}/{subjectStats?.totalChapters || 0} chapters
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject Actions */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => startEditingSubject(subject)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => deleteSubject(subject.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Subject Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  {/* Chapter List */}
                  <div className="p-4 space-y-3">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                        <button
                          onClick={() => toggleChapterCompletion(subject.id, chapter.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                            chapter.isCompleted 
                              ? 'bg-green-600 border-green-600 text-white' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                          }`}
                        >
                          {chapter.isCompleted && <Check className="w-3 h-3" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium transition-all duration-200 ${
                              chapter.isCompleted 
                                ? 'text-gray-500 dark:text-gray-400 line-through' 
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {chapter.name}
                            </span>
                            {chapter.difficulty && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(chapter.difficulty)}`}>
                                {getDifficultyIcon(chapter.difficulty)} {chapter.difficulty}
                              </span>
                            )}
                          </div>
                          {chapter.completedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed {chapter.completedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        {chapter.studyTime && chapter.studyTime > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {Math.round(chapter.studyTime / 60)}h
                          </div>
                        )}
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit2}
                            onClick={() => startEditingChapter(subject.id, chapter)}
                            className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => deleteChapter(subject.id, chapter.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Chapter Form */}
                    {showAddChapter === subject.id ? (
                      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600">
                        <div className="space-y-3">
                          <Input
                            placeholder="Chapter name (e.g., Calculus, Derivatives)"
                            value={newChapterName}
                            onChange={setNewChapterName}
                            onKeyPress={(e) => e.key === 'Enter' && addChapter(subject.id)}
                          />
                          <div className="flex items-center gap-3">
                            <select
                              value={newChapterDifficulty}
                              onChange={(e) => setNewChapterDifficulty(e.target.value as any)}
                              className="px-3 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            >
                              <option value="easy">🟢 Easy</option>
                              <option value="medium">🟡 Medium</option>
                              <option value="hard">🔴 Hard</option>
                            </select>
                            <Button 
                              onClick={() => addChapter(subject.id)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={!newChapterName.trim()}
                            >
                              Add Chapter
                            </Button>
                            <Button 
                              onClick={() => {
                                setShowAddChapter(null);
                                setNewChapterName('');
                                setNewChapterDifficulty('medium');
                              }}
                              variant="secondary"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Button
                        onClick={() => setShowAddChapter(subject.id)}
                        variant="ghost"
                        icon={Plus}
                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      >
                        Add Chapter to {subject.name}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Study Insights Panel */}
      {exam.subjects.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Study Insights
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
              <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressStats.completedChapters > 0 ? Math.min(progressStats.completedChapters, 7) : 0} days
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
              <Zap className="w-8 h-8 mx-auto text-orange-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressStats.overallProgress}%
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
              <Brain className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Focus Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressStats.overallProgress > 75 ? 'A+' : progressStats.overallProgress > 50 ? 'B+' : progressStats.overallProgress > 25 ? 'C+' : 'F'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State for Subjects */}
      {exam.subjects.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600">
          <BookOpen className="w-16 h-16 mx-auto text-blue-400 mb-4" />
          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Subjects Added Yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start organizing your exam preparation by adding subjects and chapters
          </p>
          <Button
            onClick={() => setShowAddSubject(true)}
            icon={Plus}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Add Your First Subject
          </Button>
        </Card>
      )}
    </div>
  );
};
