import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, BookOpen, CheckCircle2, Circle, Target, Trash2, Edit3, Save, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Subject, Chapter, SyllabusTracker } from '../types';

interface SyllabusTrackerProps {
  syllabusTracker: SyllabusTracker;
  onUpdate: (tracker: SyllabusTracker) => void;
  readonly?: boolean;
}

export const SyllabusTrackerComponent: React.FC<SyllabusTrackerProps> = ({
  syllabusTracker,
  onUpdate,
  readonly = false
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const calculateSubjectProgress = (subject: Subject): number => {
    if (subject.chapters.length === 0) return 0;
    const completedChapters = subject.chapters.filter(ch => ch.completed).length;
    return Math.round((completedChapters / subject.chapters.length) * 100);
  };

  const updateSyllabusTracker = (updatedTracker: SyllabusTracker) => {
    // Recalculate progress
    const totalChapters = updatedTracker.subjects.reduce((acc, sub) => acc + sub.chapters.length, 0);
    const completedChapters = updatedTracker.subjects.reduce((acc, sub) => 
      acc + sub.chapters.filter(ch => ch.completed).length, 0);
    const completedSubjects = updatedTracker.subjects.filter(sub => 
      sub.chapters.length > 0 && sub.chapters.every(ch => ch.completed)).length;
    
    const finalTracker: SyllabusTracker = {
      ...updatedTracker,
      totalProgress: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
      completedSubjects,
      completedChapters,
      totalChapters
    };

    onUpdate(finalTracker);
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      chapters: [],
      priority: 'medium',
      completed: false
    };

    const updatedTracker = {
      ...syllabusTracker,
      subjects: [...syllabusTracker.subjects, newSubject]
    };

    updateSyllabusTracker(updatedTracker);
    setNewSubjectName('');
    setShowAddSubject(false);
  };

  const updateSubject = (subjectId: string, updates: Partial<Subject>) => {
    const updatedTracker = {
      ...syllabusTracker,
      subjects: syllabusTracker.subjects.map(sub =>
        sub.id === subjectId ? { ...sub, ...updates } : sub
      )
    };
    updateSyllabusTracker(updatedTracker);
  };

  const deleteSubject = (subjectId: string) => {
    const updatedTracker = {
      ...syllabusTracker,
      subjects: syllabusTracker.subjects.filter(sub => sub.id !== subjectId)
    };
    updateSyllabusTracker(updatedTracker);
  };

  const addChapter = (subjectId: string) => {
    if (!newChapterName.trim()) return;

    const newChapter: Chapter = {
      id: Date.now().toString(),
      name: newChapterName.trim(),
      completed: false
    };

    const updatedTracker = {
      ...syllabusTracker,
      subjects: syllabusTracker.subjects.map(sub =>
        sub.id === subjectId 
          ? { ...sub, chapters: [...sub.chapters, newChapter] }
          : sub
      )
    };

    updateSyllabusTracker(updatedTracker);
    setNewChapterName('');
  };

  const updateChapter = (subjectId: string, chapterId: string, updates: Partial<Chapter>) => {
    const updatedTracker = {
      ...syllabusTracker,
      subjects: syllabusTracker.subjects.map(sub =>
        sub.id === subjectId
          ? {
              ...sub,
              chapters: sub.chapters.map(ch =>
                ch.id === chapterId ? { ...ch, ...updates } : ch
              )
            }
          : sub
      )
    };
    updateSyllabusTracker(updatedTracker);
  };

  const deleteChapter = (subjectId: string, chapterId: string) => {
    const updatedTracker = {
      ...syllabusTracker,
      subjects: syllabusTracker.subjects.map(sub =>
        sub.id === subjectId
          ? { ...sub, chapters: sub.chapters.filter(ch => ch.id !== chapterId) }
          : sub
      )
    };
    updateSyllabusTracker(updatedTracker);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Syllabus Progress
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {syllabusTracker.totalProgress}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {syllabusTracker.completedChapters} / {syllabusTracker.totalChapters} chapters
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${syllabusTracker.totalProgress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {syllabusTracker.completedSubjects} of {syllabusTracker.subjects.length} subjects completed
        </div>
      </div>

      {/* Add Subject Button */}
      {!readonly && (
        <div className="mb-4">
          {!showAddSubject ? (
            <Button
              onClick={() => setShowAddSubject(true)}
              icon={Plus}
              variant="ghost"
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
            >
              Add Subject
            </Button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Subject name..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                autoFocus
              />
              <Button onClick={addSubject} icon={Save} size="sm" />
              <Button onClick={() => setShowAddSubject(false)} icon={X} variant="ghost" size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Subjects List */}
      <div className="space-y-3">
        {syllabusTracker.subjects.map((subject) => {
          const progress = calculateSubjectProgress(subject);
          const isExpanded = expandedSubjects.has(subject.id);

          return (
            <Card key={subject.id} className={`overflow-hidden border-l-4 ${getPriorityColor(subject.priority)} transition-all duration-300 hover:shadow-lg`}>
              <div className="p-4">
                {/* Subject Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      onClick={() => toggleSubject(subject.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </Button>
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      {editingSubject === subject.id ? (
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
                          onBlur={() => setEditingSubject(null)}
                          onKeyPress={(e) => e.key === 'Enter' && setEditingSubject(null)}
                          className="font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-purple-400 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {subject.name}
                        </h4>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.chapters.length} chapters
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!readonly && (
                    <div className="flex items-center gap-1">
                      <select
                        value={subject.priority}
                        onChange={(e) => updateSubject(subject.id, { priority: e.target.value as any })}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <Button
                        onClick={() => setEditingSubject(subject.id)}
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteSubject(subject.id)}
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Chapters (Expanded View) */}
                {isExpanded && (
                  <div className="ml-8 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    {/* Add Chapter */}
                    {!readonly && (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="New chapter name..."
                          value={newChapterName}
                          onChange={(e) => setNewChapterName(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          onKeyPress={(e) => e.key === 'Enter' && addChapter(subject.id)}
                        />
                        <Button 
                          onClick={() => addChapter(subject.id)} 
                          icon={Plus} 
                          size="sm"
                          disabled={!newChapterName.trim()}
                        />
                      </div>
                    )}

                    {/* Chapters List */}
                    <div className="space-y-1">
                      {subject.chapters.map((chapter) => (
                        <div 
                          key={chapter.id} 
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md
                            ${chapter.completed 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                            }
                          `}
                        >
                          {!readonly && (
                            <Button
                              onClick={() => updateChapter(subject.id, chapter.id, { completed: !chapter.completed })}
                              variant="ghost"
                              size="sm"
                              className="p-1 hover:bg-transparent"
                            >
                              {chapter.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 hover:text-green-600" />
                              )}
                            </Button>
                          )}
                          
                          <div className="flex-1">
                            {editingChapter === chapter.id ? (
                              <input
                                type="text"
                                value={chapter.name}
                                onChange={(e) => updateChapter(subject.id, chapter.id, { name: e.target.value })}
                                onBlur={() => setEditingChapter(null)}
                                onKeyPress={(e) => e.key === 'Enter' && setEditingChapter(null)}
                                className="font-medium bg-transparent border-b border-purple-400 focus:outline-none text-sm"
                                autoFocus
                              />
                            ) : (
                              <span className={`text-sm font-medium transition-all duration-200 ${
                                chapter.completed 
                                  ? 'text-green-700 dark:text-green-400 line-through' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {chapter.name}
                              </span>
                            )}
                            {chapter.estimatedHours && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                ⏱️ {chapter.estimatedHours}h estimated
                              </div>
                            )}
                          </div>

                          {!readonly && (
                            <div className="flex items-center gap-1">
                              <Button
                                onClick={() => setEditingChapter(chapter.id)}
                                variant="ghost"
                                size="sm"
                                className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => deleteChapter(subject.id, chapter.id)}
                                variant="ghost"
                                size="sm"
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {subject.chapters.length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                        No chapters added yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showAddSubject && (
        <Card className="p-4 border-2 border-dashed border-purple-300 dark:border-purple-600">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Subject name..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              autoFocus
            />
            <Button onClick={addSubject} icon={Save} size="sm" disabled={!newSubjectName.trim()} />
            <Button onClick={() => setShowAddSubject(false)} icon={X} variant="ghost" size="sm" />
          </div>
        </Card>
      )}

      {syllabusTracker.subjects.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No subjects in syllabus yet</p>
          {!readonly && (
            <Button
              onClick={() => setShowAddSubject(true)}
              icon={Plus}
              variant="ghost"
              className="mt-2"
            >
              Add Your First Subject
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
