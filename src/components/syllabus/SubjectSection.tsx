import React, { useState } from 'react';
import { Plus, BookOpen, BarChart3, ChevronDown, ChevronUp, Target, TrendingUp } from 'lucide-react';
import { Subject, Chapter } from '../../types';
import { ChapterItem } from './ChapterItem';

interface SubjectSectionProps {
  subject: Subject;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const SubjectSection: React.FC<SubjectSectionProps> = ({ 
  subject, 
  onUpdateSubject, 
  onDeleteSubject 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterHours, setNewChapterHours] = useState('');
  const [newChapterPriority, setNewChapterPriority] = useState<Chapter['priority']>('medium');

  const completedChapters = subject.chapters.filter(ch => ch.completed).length;
  const totalChapters = subject.chapters.length;
  const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  const totalEstimatedHours = subject.chapters.reduce((sum, ch) => sum + (ch.estimatedHours || 0), 0);
  const completedHours = subject.chapters
    .filter(ch => ch.completed)
    .reduce((sum, ch) => sum + (ch.estimatedHours || 0), 0);

  const addChapter = () => {
    if (!newChapterTitle.trim()) return;

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: newChapterTitle,
      completed: false,
      estimatedHours: newChapterHours ? parseFloat(newChapterHours) : undefined,
      priority: newChapterPriority,
      createdAt: new Date(),
    };

    onUpdateSubject({
      ...subject,
      chapters: [...subject.chapters, newChapter],
    });

    setNewChapterTitle('');
    setNewChapterHours('');
    setNewChapterPriority('medium');
    setShowAddChapter(false);
  };

  const updateChapter = (updatedChapter: Chapter) => {
    const updatedChapters = subject.chapters.map(ch =>
      ch.id === updatedChapter.id ? updatedChapter : ch
    );
    onUpdateSubject({
      ...subject,
      chapters: updatedChapters,
    });
  };

  const deleteChapter = (chapterId: string) => {
    const updatedChapters = subject.chapters.filter(ch => ch.id !== chapterId);
    onUpdateSubject({
      ...subject,
      chapters: updatedChapters,
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-600';
    if (progress >= 60) return 'from-blue-500 to-cyan-600';
    if (progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Subject Header */}
      <div 
        className="p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: subject.color }}
            ></div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {subject.name}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completedChapters}/{totalChapters} chapters
                </span>
                {totalEstimatedHours > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {completedHours}/{totalEstimatedHours}h
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Complete
              </div>
            </div>
            
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r transition-all duration-500 ${getProgressColor(progressPercentage)}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          {/* Quick Stats */}
          <div className="p-6 bg-gray-50 dark:bg-gray-750">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {totalChapters}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Total Chapters
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {completedChapters}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {totalEstimatedHours || 0}h
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Est. Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {subject.chapters.filter(ch => ch.priority === 'high').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  High Priority
                </div>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Chapters ({totalChapters})
              </h4>
              <button
                onClick={() => setShowAddChapter(!showAddChapter)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </div>

            {/* Add Chapter Form */}
            {showAddChapter && (
              <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="Chapter title"
                    className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={newChapterHours}
                      onChange={(e) => setNewChapterHours(e.target.value)}
                      placeholder="Estimated hours"
                      min="0"
                      step="0.5"
                      className="px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                    
                    <select
                      value={newChapterPriority}
                      onChange={(e) => setNewChapterPriority(e.target.value as Chapter['priority'])}
                      className="px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={addChapter}
                      disabled={!newChapterTitle.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                    >
                      Add Chapter
                    </button>
                    <button
                      onClick={() => setShowAddChapter(false)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chapters */}
            <div className="space-y-3">
              {subject.chapters.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No chapters added yet</p>
                  <p className="text-xs mt-1">Click "Add Chapter" to start organizing your syllabus</p>
                </div>
              ) : (
                subject.chapters.map((chapter) => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    onUpdate={updateChapter}
                    onDelete={deleteChapter}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
