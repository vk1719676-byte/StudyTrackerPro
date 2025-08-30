import React, { useState } from 'react';
import { Plus, BookOpen, Check, X, Star, Target, Zap, ChevronDown, ChevronUp, Book } from 'lucide-react';

interface SyllabusTopic {
  id: string;
  name: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Chapter {
  id: string;
  name: string;
  topics: SyllabusTopic[];
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon: Icon,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation';
  
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-600 dark:text-gray-400 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px] min-w-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px] sm:min-h-[40px]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
    </button>
  );
};

interface SyllabusTrackerProps {
  chapters: Chapter[];
  onChaptersChange: (chapters: Chapter[]) => void;
  readOnly?: boolean;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  chapters,
  onChaptersChange,
  readOnly = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicPriority, setNewTopicPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeChapter, setActiveChapter] = useState<string>('');

  // Calculate overall progress
  const allTopics = chapters.flatMap(chapter => chapter.topics);
  const completedTopics = allTopics.filter(topic => topic.completed);
  const completedChapters = chapters.filter(chapter => 
    chapter.topics.length > 0 && chapter.topics.every(topic => topic.completed)
  );
  const progressPercentage = allTopics.length > 0 ? (completedTopics.length / allTopics.length) * 100 : 0;

  const addChapter = () => {
    if (!newChapterName.trim()) return;
    
    const newChapter: Chapter = {
      id: Date.now().toString(),
      name: newChapterName.trim(),
      topics: [],
    };
    
    onChaptersChange([...chapters, newChapter]);
    setNewChapterName('');
  };

  const removeChapter = (chapterId: string) => {
    onChaptersChange(chapters.filter(chapter => chapter.id !== chapterId));
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      newSet.delete(chapterId);
      return newSet;
    });
  };

  const addTopicToChapter = (chapterId: string) => {
    if (!newTopicName.trim()) return;
    
    const newTopic: SyllabusTopic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      completed: false,
      priority: newTopicPriority,
    };
    
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId
        ? { ...chapter, topics: [...chapter.topics, newTopic] }
        : chapter
    );
    
    onChaptersChange(updatedChapters);
    setNewTopicName('');
    setNewTopicPriority('medium');
    setActiveChapter('');
  };

  const toggleTopic = (chapterId: string, topicId: string) => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId
        ? {
            ...chapter,
            topics: chapter.topics.map(topic =>
              topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
            )
          }
        : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const removeTopic = (chapterId: string, topicId: string) => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId
        ? { ...chapter, topics: chapter.topics.filter(topic => topic.id !== topicId) }
        : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const updateTopicPriority = (chapterId: string, topicId: string, priority: 'low' | 'medium' | 'high') => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId
        ? {
            ...chapter,
            topics: chapter.topics.map(topic =>
              topic.id === topicId ? { ...topic, priority } : topic
            )
          }
        : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const toggleChapterExpansion = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const getChapterProgress = (chapter: Chapter) => {
    if (chapter.topics.length === 0) return 0;
    const completed = chapter.topics.filter(topic => topic.completed).length;
    return (completed / chapter.topics.length) * 100;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
      case 'medium': return <Target className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      case 'low': return <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 mx-4 sm:mx-0">
      {/* Header */}
      <div 
        className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-gray-200/50 dark:border-gray-600/50 cursor-pointer hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 touch-manipulation"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="p-2 bg-purple-600/10 rounded-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Syllabus Progress
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 text-sm sm:text-base">
                {completedChapters.length} of {chapters.length} chapters • {completedTopics.length} of {allTopics.length} topics
              </p>
            </div>
          </div>
          
          {/* Mobile-optimized progress indicator */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  className="stroke-gray-200 dark:stroke-gray-600"
                  strokeWidth="2"
                />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  className="stroke-purple-600"
                  strokeWidth="2"
                  strokeDasharray={`${progressPercentage * 100.53 / 100} 100.53`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.7s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            <div className="transform transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 sm:mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Add New Chapter Form */}
          {!readOnly && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Add New Chapter
                </h5>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter chapter name..."
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addChapter()}
                    className="flex-1 px-4 py-3 sm:py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 text-base sm:text-sm placeholder:text-gray-500"
                  />
                  <Button
                    onClick={addChapter}
                    icon={Plus}
                    disabled={!newChapterName.trim()}
                    className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-sm hover:shadow-md w-full sm:w-auto justify-center min-h-[44px]"
                  >
                    Add Chapter
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Chapters List */}
          {chapters.length > 0 ? (
            <div className="space-y-4 sm:space-y-3">
              {chapters.map((chapter, chapterIndex) => {
                const chapterProgress = getChapterProgress(chapter);
                const isChapterExpanded = expandedChapters.has(chapter.id);
                const isChapterCompleted = chapter.topics.length > 0 && chapter.topics.every(topic => topic.completed);
                
                return (
                  <div
                    key={chapter.id}
                    className="bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group"
                    style={{ animationDelay: `${chapterIndex * 100}ms` }}
                  >
                    {/* Chapter Header */}
                    <div 
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600/50 dark:hover:to-gray-500/50 transition-all duration-200"
                      onClick={() => toggleChapterExpansion(chapter.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isChapterCompleted ? 'bg-green-600/10' : 'bg-blue-600/10'}`}>
                            <Book className={`w-4 h-4 sm:w-5 sm:h-5 ${isChapterCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className={`text-base sm:text-lg font-semibold transition-all duration-200 truncate ${isChapterCompleted ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                              {chapter.name}
                            </h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {chapter.topics.filter(t => t.completed).length} of {chapter.topics.length} topics completed
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {/* Chapter Progress Circle */}
                          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 transform -rotate-90" viewBox="0 0 36 36">
                              <circle
                                cx="18" cy="18" r="14"
                                fill="none"
                                className="stroke-gray-200 dark:stroke-gray-600"
                                strokeWidth="3"
                              />
                              <circle
                                cx="18" cy="18" r="14"
                                fill="none"
                                className={isChapterCompleted ? 'stroke-green-500' : 'stroke-blue-500'}
                                strokeWidth="3"
                                strokeDasharray={`${chapterProgress * 87.96 / 100} 87.96`}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                {Math.round(chapterProgress)}%
                              </span>
                            </div>
                          </div>
                          
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeChapter(chapter.id);
                              }}
                              className="p-2 hover:bg-red-100 active:bg-red-200 dark:hover:bg-red-900/20 dark:active:bg-red-900/30 text-red-500 min-h-[36px] sm:min-h-auto justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-4 h-4 sm:w-3 sm:h-3" />
                            </Button>
                          )}
                          
                          <div className="transform transition-transform duration-200">
                            {isChapterExpanded ? (
                              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chapter Content */}
                    {isChapterExpanded && (
                      <div className="p-4 space-y-3">
                        {/* Add Topic Form */}
                        {!readOnly && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700/50">
                            <div className="space-y-3">
                              <h6 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Add Topic to {chapter.name}
                              </h6>
                              <input
                                type="text"
                                placeholder="Enter topic name..."
                                value={activeChapter === chapter.id ? newTopicName : ''}
                                onChange={(e) => {
                                  setActiveChapter(chapter.id);
                                  setNewTopicName(e.target.value);
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && addTopicToChapter(chapter.id)}
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 text-sm placeholder:text-gray-500"
                              />
                              <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                  value={activeChapter === chapter.id ? newTopicPriority : 'medium'}
                                  onChange={(e) => {
                                    setActiveChapter(chapter.id);
                                    setNewTopicPriority(e.target.value as any);
                                  }}
                                  className="flex-1 px-3 py-2 border border-blue-200 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm"
                                >
                                  <option value="low">Low Priority</option>
                                  <option value="medium">Medium Priority</option>
                                  <option value="high">High Priority</option>
                                </select>
                                <Button
                                  onClick={() => addTopicToChapter(chapter.id)}
                                  icon={Plus}
                                  disabled={!newTopicName.trim() || activeChapter !== chapter.id}
                                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                                >
                                  Add Topic
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Topics List */}
                        {chapter.topics.length > 0 ? (
                          <div className="space-y-2">
                            {chapter.topics.map((topic, topicIndex) => (
                              <div
                                key={topic.id}
                                className={`
                                  group flex items-start sm:items-center gap-3 p-3 rounded-lg border transition-all duration-200 ml-4
                                  ${topic.completed 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' 
                                    : 'bg-gray-50 dark:bg-gray-600/30 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50 active:bg-gray-150 dark:active:bg-gray-600/70'
                                  }
                                `}
                                style={{ animationDelay: `${(chapterIndex * 100) + (topicIndex * 50)}ms` }}
                              >
                                {/* Completion Checkbox */}
                                <div className="relative flex-shrink-0 mt-0.5 sm:mt-0">
                                  <input
                                    type="checkbox"
                                    checked={topic.completed}
                                    onChange={() => !readOnly && toggleTopic(chapter.id, topic.id)}
                                    disabled={readOnly}
                                    className="sr-only"
                                  />
                                  <div 
                                    className={`
                                      w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-200 touch-manipulation
                                      ${topic.completed 
                                        ? 'bg-green-500 border-green-500 shadow-sm' 
                                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 dark:border-gray-600 dark:hover:border-blue-500'
                                      }
                                    `}
                                    onClick={() => !readOnly && toggleTopic(chapter.id, topic.id)}
                                  >
                                    {topic.completed && (
                                      <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-white" />
                                    )}
                                  </div>
                                </div>

                                {/* Topic Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className={`
                                      text-sm font-medium transition-all duration-200 break-words
                                      ${topic.completed 
                                        ? 'text-green-700 dark:text-green-400 line-through opacity-75' 
                                        : 'text-gray-900 dark:text-gray-100'
                                      }
                                    `}>
                                      {topic.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {getPriorityIcon(topic.priority)}
                                      {/* Mobile: Show priority badge inline */}
                                      <span className={`
                                        sm:hidden px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200
                                        ${getPriorityColor(topic.priority)}
                                      `}>
                                        {topic.priority}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Desktop Priority Badge */}
                                <span className={`
                                  hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200
                                  ${getPriorityColor(topic.priority)}
                                `}>
                                  {topic.priority}
                                </span>

                                {/* Actions */}
                                {!readOnly && (
                                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                    <select
                                      value={topic.priority}
                                      onChange={(e) => updateTopicPriority(chapter.id, topic.id, e.target.value as any)}
                                      className="text-xs border border-gray-200 rounded px-2 py-2 sm:py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 min-h-[36px] sm:min-h-auto"
                                    >
                                      <option value="low">Low</option>
                                      <option value="medium">Med</option>
                                      <option value="high">High</option>
                                    </select>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTopic(chapter.id, topic.id)}
                                      className="p-2 hover:bg-red-100 active:bg-red-200 dark:hover:bg-red-900/20 dark:active:bg-red-900/30 text-red-500 min-h-[36px] sm:min-h-auto justify-center"
                                    >
                                      <X className="w-4 h-4 sm:w-3 sm:h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400 ml-4">
                            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">No topics in this chapter</p>
                            {!readOnly && (
                              <p className="text-xs mt-1">Add topics above to start tracking progress</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-8 text-gray-500 dark:text-gray-400">
              <Book className="w-12 h-12 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-2 opacity-50" />
              <p className="text-base sm:text-sm font-medium">No chapters added yet</p>
              {!readOnly && (
                <p className="text-sm sm:text-xs mt-2 sm:mt-1 px-4">Add chapters above to organize your study topics</p>
              )}
            </div>
          )}

          {/* Enhanced Progress Analytics */}
          {allTopics.length > 0 && (
            <div className="mt-6 sm:mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {chapters.length}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                    Chapters
                  </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {allTopics.length}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                    Total Topics
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-lg font-bold text-green-600 dark:text-green-400">
                    {completedChapters.length}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                    Complete Chapters
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
                    Overall Progress
                  </div>
                </div>
              </div>
              
              {/* Study Recommendations */}
              {allTopics.length > 0 && progressPercentage < 100 && (
                <div className="mt-4 p-4 sm:p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      Study Recommendations
                    </span>
                  </div>
                  {(() => {
                    const highPriorityIncomplete = allTopics.filter(t => !t.completed && t.priority === 'high').length;
                    const mediumPriorityIncomplete = allTopics.filter(t => !t.completed && t.priority === 'medium').length;
                    const incompleteChapters = chapters.filter(c => c.topics.length > 0 && !c.topics.every(t => t.completed)).length;
                    
                    if (highPriorityIncomplete > 0) {
                      return (
                        <p className="text-sm sm:text-xs text-purple-600 dark:text-purple-400 leading-relaxed">
                          🔥 Focus on {highPriorityIncomplete} high-priority topic{highPriorityIncomplete > 1 ? 's' : ''} across {incompleteChapters} chapter{incompleteChapters > 1 ? 's' : ''}
                        </p>
                      );
                    } else if (mediumPriorityIncomplete > 0) {
                      return (
                        <p className="text-sm sm:text-xs text-purple-600 dark:text-purple-400 leading-relaxed">
                          ⚡ Work through {mediumPriorityIncomplete} medium-priority topic{mediumPriorityIncomplete > 1 ? 's' : ''} in {incompleteChapters} chapter{incompleteChapters > 1 ? 's' : ''}
                        </p>
                      );
                    } else {
                      return (
                        <p className="text-sm sm:text-xs text-purple-600 dark:text-purple-400 leading-relaxed">
                          ✨ Great progress! Complete remaining topics in {incompleteChapters} chapter{incompleteChapters > 1 ? 's' : ''} at your own pace
                        </p>
                      );
                    }
                  })()}
                </div>
              )}

              {/* Completion Celebration */}
              {progressPercentage === 100 && allTopics.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50 text-center">
                  <div className="text-3xl sm:text-2xl mb-2">🎉</div>
                  <h3 className="text-lg sm:text-base font-bold text-green-700 dark:text-green-400 mb-1">
                    Congratulations!
                  </h3>
                  <p className="text-sm sm:text-xs text-green-600 dark:text-green-400">
                    You've completed all {chapters.length} chapters and {allTopics.length} topics!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      name: 'React Fundamentals',
      topics: [
        { id: '1-1', name: 'Introduction to React Hooks', completed: true, priority: 'high' },
        { id: '1-2', name: 'State Management with useState', completed: true, priority: 'high' },
        { id: '1-3', name: 'Effect Hook and Side Effects', completed: false, priority: 'high' },
      ]
    },
    {
      id: '2',
      name: 'Advanced React Patterns',
      topics: [
        { id: '2-1', name: 'Custom Hooks Development', completed: false, priority: 'medium' },
        { id: '2-2', name: 'Context API and useContext', completed: false, priority: 'medium' },
      ]
    },
    {
      id: '3',
      name: 'Performance & Optimization',
      topics: [
        { id: '3-1', name: 'Performance Optimization', completed: false, priority: 'low' },
      ]
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Learning Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4 sm:px-0">
            Track your study progress by chapters and topics
          </p>
        </div>
        
        <SyllabusTracker 
          chapters={chapters} 
          onChaptersChange={setChapters} 
        />
      </div>
    </div>
  );
}

export default App;
