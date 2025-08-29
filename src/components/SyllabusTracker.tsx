import React, { useState } from 'react';
import { Plus, BookOpen, Check, X, Star, Target, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface SyllabusTopic {
  id: string;
  name: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
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
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

interface SyllabusTrackerProps {
  topics: SyllabusTopic[];
  onTopicsChange: (topics: SyllabusTopic[]) => void;
  readOnly?: boolean;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  topics,
  onTopicsChange,
  readOnly = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicPriority, setNewTopicPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const completedCount = topics.filter(topic => topic.completed).length;
  const progressPercentage = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  const addTopic = () => {
    if (!newTopicName.trim()) return;
    
    const newTopic: SyllabusTopic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      completed: false,
      priority: newTopicPriority,
    };
    
    onTopicsChange([...topics, newTopic]);
    setNewTopicName('');
    setNewTopicPriority('medium');
  };

  const toggleTopic = (topicId: string) => {
    const updatedTopics = topics.map(topic =>
      topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
    );
    onTopicsChange(updatedTopics);
  };

  const removeTopic = (topicId: string) => {
    onTopicsChange(topics.filter(topic => topic.id !== topicId));
  };

  const updateTopicPriority = (topicId: string, priority: 'low' | 'medium' | 'high') => {
    const updatedTopics = topics.map(topic =>
      topic.id === topicId ? { ...topic, priority } : topic
    );
    onTopicsChange(updatedTopics);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="w-3 h-3 text-red-500" />;
      case 'medium': return <Target className="w-3 h-3 text-yellow-500" />;
      case 'low': return <Star className="w-3 h-3 text-green-500" />;
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
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div 
        className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-gray-200/50 dark:border-gray-600/50 cursor-pointer hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Syllabus Progress
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {completedCount} of {topics.length} topics completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Circular Progress Indicator */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
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
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            <div className="transform transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Add New Topic Form */}
          {!readOnly && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Add a new topic or chapter..."
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
                <div className="flex gap-3">
                  <select
                    value={newTopicPriority}
                    onChange={(e) => setNewTopicPriority(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <Button
                    onClick={addTopic}
                    icon={Plus}
                    disabled={!newTopicName.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Topics List */}
          {topics.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Topics ({topics.length})
                </h5>
                {topics.length > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {completedCount} completed • {topics.length - completedCount} remaining
                  </div>
                )}
              </div>
              
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className={`
                    group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                    ${topic.completed 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' 
                      : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Completion Checkbox */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={topic.completed}
                      onChange={() => !readOnly && toggleTopic(topic.id)}
                      disabled={readOnly}
                      className="sr-only"
                    />
                    <div 
                      className={`
                        w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-200
                        ${topic.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:border-gray-600 dark:hover:border-purple-500'
                        }
                      `}
                      onClick={() => !readOnly && toggleTopic(topic.id)}
                    >
                      {topic.completed && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`
                        text-sm font-medium transition-all duration-200
                        ${topic.completed 
                          ? 'text-green-700 dark:text-green-400 line-through opacity-75' 
                          : 'text-gray-900 dark:text-gray-100'
                        }
                      `}>
                        {topic.name}
                      </span>
                      {getPriorityIcon(topic.priority)}
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200
                    ${getPriorityColor(topic.priority)}
                  `}>
                    {topic.priority}
                  </span>

                  {/* Actions */}
                  {!readOnly && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <select
                        value={topic.priority}
                        onChange={(e) => updateTopicPriority(topic.id, e.target.value as any)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Med</option>
                        <option value="high">High</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTopic(topic.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No topics added yet</p>
              {!readOnly && (
                <p className="text-xs mt-1">Add topics above to track your progress</p>
              )}
            </div>
          )}

          {/* Progress Summary */}
          {topics.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {topics.length}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Total Topics
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {completedCount}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Completed
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    Progress
                  </div>
                </div>
              </div>
              
              {/* Study Recommendations */}
              {topics.length > 0 && progressPercentage < 100 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      Study Recommendations
                    </span>
                  </div>
                  {(() => {
                    const highPriorityIncomplete = topics.filter(t => !t.completed && t.priority === 'high').length;
                    const mediumPriorityIncomplete = topics.filter(t => !t.completed && t.priority === 'medium').length;
                    
                    if (highPriorityIncomplete > 0) {
                      return (
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          🔥 Focus on {highPriorityIncomplete} high-priority topic{highPriorityIncomplete > 1 ? 's' : ''} first
                        </p>
                      );
                    } else if (mediumPriorityIncomplete > 0) {
                      return (
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ⚡ Work through {mediumPriorityIncomplete} medium-priority topic{mediumPriorityIncomplete > 1 ? 's' : ''} next
                        </p>
                      );
                    } else {
                      return (
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ✨ Great progress! Complete remaining topics at your own pace
                        </p>
                      );
                    }
                  })()}
                </div>
              )}

              {/* Completion Celebration */}
              {progressPercentage === 100 && topics.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <h3 className="text-base font-bold text-green-700 dark:text-green-400 mb-1">
                    Congratulations!
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    You've completed all topics!
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
