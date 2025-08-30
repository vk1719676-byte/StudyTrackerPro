import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, BookOpen, Clock, Target, TrendingUp, Edit3, Trash2, Brain } from 'lucide-react';
import { Chapter, SyllabusTopic } from '../types';
import { Button } from './ui/Button';

interface ChapterTrackerProps {
  chapters: Chapter[];
  onChaptersChange: (chapters: Chapter[]) => void;
  subjectId: string;
}

export const ChapterTracker: React.FC<ChapterTrackerProps> = ({
  chapters,
  onChaptersChange,
  subjectId
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [newChapterName, setNewChapterName] = useState('');
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const addChapter = () => {
    if (!newChapterName.trim()) return;

    const newChapter: Chapter = {
      id: Date.now().toString(),
      name: newChapterName.trim(),
      topics: [],
      completed: false,
      progress: 0,
      subjectId,
      estimatedHours: 0,
      actualHours: 0,
      importance: 'medium',
    };

    onChaptersChange([...chapters, newChapter]);
    setNewChapterName('');
  };

  const deleteChapter = (chapterId: string) => {
    const updatedChapters = chapters.filter(chapter => chapter.id !== chapterId);
    onChaptersChange(updatedChapters);
  };

  const startEditing = (chapter: Chapter) => {
    setEditingChapter(chapter.id);
    setEditingName(chapter.name);
  };

  const saveEdit = (chapterId: string) => {
    if (!editingName.trim()) return;
    
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId ? { ...chapter, name: editingName.trim() } : chapter
    );
    onChaptersChange(updatedChapters);
    setEditingChapter(null);
    setEditingName('');
  };

  const updateChapterImportance = (chapterId: string, importance: 'low' | 'medium' | 'high') => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId ? { ...chapter, importance } : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const getImportanceColor = (importance?: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
  const completedTopics = chapters.reduce((sum, chapter) => 
    sum + chapter.topics.filter(topic => topic.completed).length, 0
  );
  const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Chapter Summary */}
      {chapters.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
                Chapter Overview
              </h4>
            </div>
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {chapters.filter(c => c.completed).length}/{chapters.length} chapters
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Total Topics</p>
              <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{totalTopics}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Completed</p>
              <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{completedTopics}</p>
            </div>
          </div>
          <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(overallProgress, 0)}%` }}
            >
              {overallProgress > 15 && (
                <span className="text-xs font-bold text-white">
                  {Math.round(overallProgress)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Chapter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new chapter..."
          value={newChapterName}
          onChange={(e) => setNewChapterName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addChapter()}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        />
        <Button
          onClick={addChapter}
          icon={Plus}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Add Chapter
        </Button>
      </div>

      {/* Chapters List */}
      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const completedTopicsCount = chapter.topics.filter(topic => topic.completed).length;
          const totalTopicsCount = chapter.topics.length;
          const chapterProgress = totalTopicsCount > 0 ? (completedTopicsCount / totalTopicsCount) * 100 : 0;

          return (
            <div
              key={chapter.id}
              className={`
                border-2 rounded-xl transition-all duration-300 hover:shadow-lg
                ${chapter.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700' 
                  : 'bg-gradient-to-r from-white to-gray-50 border-gray-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Chapter Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      {editingChapter === chapter.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(chapter.id)}
                          onBlur={() => saveEdit(chapter.id)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          autoFocus
                        />
                      ) : (
                        <h4
                          className={`font-bold text-lg transition-all duration-200 ${
                            chapter.completed
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {chapter.name}
                        </h4>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {completedTopicsCount}/{totalTopicsCount} topics
                        </span>
                        {totalTopicsCount > 0 && (
                          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {Math.round(chapterProgress)}% complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Importance Level */}
                    <select
                      value={chapter.importance || 'medium'}
                      onChange={(e) => updateChapterImportance(chapter.id, e.target.value as any)}
                      className={`px-2 py-1 text-xs border rounded-lg ${getImportanceColor(chapter.importance)} transition-all duration-200`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit3}
                      onClick={() => startEditing(chapter)}
                      className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 text-indigo-600"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => deleteChapter(chapter.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                    />
                  </div>
                </div>

                {/* Chapter Progress Bar */}
                {totalTopicsCount > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          chapter.completed 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                        }`}
                        style={{ width: `${Math.max(chapterProgress, 0)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chapter Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-4 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Chapter details can be viewed here</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-semibold mb-2">No chapters added yet</h4>
          <p className="text-sm">Start organizing your study material by adding chapters!</p>
        </div>
      )}
    </div>
  );
};
