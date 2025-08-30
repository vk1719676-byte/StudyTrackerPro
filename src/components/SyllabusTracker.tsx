import React from 'react';
import { Book, TrendingUp, Target, Clock } from 'lucide-react';
import { Subject, SyllabusTopic } from '../types';
import { SubjectTracker } from './SubjectTracker';

interface SyllabusTrackerProps {
  topics?: SyllabusTopic[]; // Legacy support
  onTopicsChange?: (topics: SyllabusTopic[]) => void; // Legacy support
  subjects?: Subject[]; // New hierarchical structure
  onSubjectsChange?: (subjects: Subject[]) => void; // New hierarchical structure
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
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Study Material Tracker
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organize your syllabus by subjects, chapters, and topics
            </p>
          </div>
        </div>

        <SubjectTracker
          subjects={subjects}
          onSubjectsChange={onSubjectsChange}
          examId={examId}
        />
      </div>
    );
  }

  // Legacy support for simple topics
  if (!onTopicsChange) return null;

  const completedCount = topics.filter(topic => topic.completed).length;
  const progressPercentage = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Syllabus Topics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your study progress topic by topic
          </p>
        </div>
      </div>

      {topics.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900 dark:text-blue-100">Progress Overview</span>
            </div>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
              {completedCount}/{topics.length} completed
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPercentage, 0)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Simple topic list for legacy support */}
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
              ${topic.completed
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600'
              }
            `}
          >
            <button
              onClick={() => {
                const updatedTopics = topics.map(t =>
                  t.id === topic.id ? { ...t, completed: !t.completed } : t
                );
                onTopicsChange(updatedTopics);
              }}
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${topic.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-blue-500'
                }
              `}
            >
              {topic.completed && <Target className="w-3 h-3" />}
            </button>
            <span
              className={`flex-1 transition-all duration-200 ${
                topic.completed
                  ? 'text-green-700 dark:text-green-300 line-through'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {topic.name}
            </span>
          </div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Ready to add some topics to track?</p>
        </div>
      )}
    </div>
  );
};
