import { Book, TrendingUp, Target, Clock } from 'lucide-react';
import { Subject, SyllabusTopic } from '../types';
import { SubjectTracker } from './SubjectTracker';

interface SyllabusTrackerProps {
  topics?: SyllabusTopic[];
  onTopicsChange?: (topics: SyllabusTopic[]) => void;
  subjects?: Subject[];
  onSubjectsChange?: (subjects: Subject[]) => void;
  examId?: string;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  topics = [],
  onTopicsChange,
  subjects = [],
  onSubjectsChange,
  examId = ''
}) => {
  // If we have the new subject structure, use that
  if (onSubjectsChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
            {/* Header Section - Responsive */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Study Material Tracker
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                      Organize your syllabus by subjects, chapters, and topics
                    </p>
                  </div>
                </div>
                
                {/* Progress Stats - Mobile Responsive */}
                <div className="flex flex-wrap gap-2 sm:gap-4 sm:ml-auto">
                  {subjects.length > 0 && (
                    <>
                      <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                        <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Subjects</div>
                        <div className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-300">{subjects.length}</div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                        <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Completed</div>
                        <div className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300">
                          {subjects.filter(s => s.completed).length}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Subject Tracker Component */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <SubjectTracker
                subjects={subjects}
                onSubjectsChange={onSubjectsChange}
                examId={examId}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Legacy support for simple topics with mobile-first design
  if (!onTopicsChange) return null;

  const completedCount = topics.filter(topic => topic.completed).length;
  const progressPercentage = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Syllabus Topics
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Track your study progress topic by topic
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          {topics.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-700/30 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">Progress Overview</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300">
                    {completedCount}/{topics.length} completed
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-blue-200/50 dark:bg-blue-800/50 rounded-full h-3 sm:h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${Math.max(progressPercentage, 0)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Topics List - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-4">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className={`
                  group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                  ${topic.completed
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/50'
                    : 'bg-white/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }
                `}
              >
                {/* Mobile and Desktop Layout */}
                <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                  {/* Completion Button */}
                  <button
                    onClick={() => {
                      const updatedTopics = topics.map(t =>
                        t.id === topic.id ? { ...t, completed: !t.completed } : t
                      );
                      onTopicsChange?.(updatedTopics);
                    }}
                    className={`
                      flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110
                      ${topic.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                        : 'border-gray-300 hover:border-blue-500 dark:border-gray-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }
                    `}
                  >
                    {topic.completed ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span
                        className={`
                          text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 break-words
                          ${topic.completed
                            ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-75'
                            : 'text-gray-900 dark:text-gray-100'
                          }
                        `}
                      >
                        {topic.name}
                      </span>
                      
                      {/* Time spent indicator - responsive */}
                      {topic.timeSpent && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{topic.timeSpent}min</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Notes - Mobile friendly */}
                    {topic.notes && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 sm:line-clamp-1">
                        {topic.notes}
                      </p>
                    )}
                  </div>

                  {/* Topic Index - Hidden on mobile */}
                  <div className="hidden sm:flex flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Completion indicator line */}
                <div className={`
                  absolute bottom-0 left-0 h-1 transition-all duration-500
                  ${topic.completed 
                    ? 'w-full bg-gradient-to-r from-emerald-400 to-green-500' 
                    : 'w-0 bg-gradient-to-r from-blue-400 to-purple-500'
                  }
                `} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {topics.length === 0 && (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center shadow-xl border border-white/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Ready to Start Tracking?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Add your first topics to begin tracking your study progress and stay organized for your exam preparation.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Legacy support for simple topics - Mobile optimized
  if (!onTopicsChange) return null;

  const completedCount = topics.filter(topic => topic.completed).length;
  const progressPercentage = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Syllabus Topics
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Track your study progress topic by topic
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          {topics.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-700/30 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">Progress Overview</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300">
                    {completedCount}/{topics.length} completed
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-blue-200/50 dark:bg-blue-800/50 rounded-full h-3 sm:h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${Math.max(progressPercentage, 0)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Topics List */}
          <div className="space-y-3 sm:space-y-4">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className={`
                  group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                  ${topic.completed
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/50'
                    : 'bg-white/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }
                `}
              >
                <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                  {/* Completion Button */}
                  <button
                    onClick={() => {
                      const updatedTopics = topics.map(t =>
                        t.id === topic.id ? { ...t, completed: !t.completed } : t
                      );
                      onTopicsChange(updatedTopics);
                    }}
                    className={`
                      flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110
                      ${topic.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                        : 'border-gray-300 hover:border-blue-500 dark:border-gray-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }
                    `}
                  >
                    {topic.completed ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span
                        className={`
                          text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 break-words
                          ${topic.completed
                            ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-75'
                            : 'text-gray-900 dark:text-gray-100'
                          }
                        `}
                      >
                        {topic.name}
                      </span>
                      
                      {/* Time spent indicator */}
                      {topic.timeSpent && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{topic.timeSpent}min</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Notes */}
                    {topic.notes && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 sm:line-clamp-1">
                        {topic.notes}
                      </p>
                    )}
                  </div>

                  {/* Topic Index - Hidden on mobile */}
                  <div className="hidden sm:flex flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Completion indicator line */}
                <div className={`
                  absolute bottom-0 left-0 h-1 transition-all duration-500
                  ${topic.completed 
                    ? 'w-full bg-gradient-to-r from-emerald-400 to-green-500' 
                    : 'w-0 bg-gradient-to-r from-blue-400 to-purple-500'
                  }
                `} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {topics.length === 0 && (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center shadow-xl border border-white/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Ready to Start Tracking?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Add your first topics to begin tracking your study progress and stay organized for your exam preparation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
