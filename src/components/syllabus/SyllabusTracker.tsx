import React, { useState } from 'react';
import { Plus, BarChart3, Target, TrendingUp, BookOpen, Clock, Award, Zap } from 'lucide-react';
import { SyllabusTracker as SyllabusTrackerType, Subject, Chapter } from '../../types';
import { SubjectSection } from './SubjectSection';

interface SyllabusTrackerProps {
  syllabusTracker: SyllabusTrackerType;
  onUpdateTracker: (tracker: SyllabusTrackerType) => void;
}

const SUBJECT_COLORS = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#8B5CF6', '#6366F1', '#14B8A6', '#F97316'
];

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({ 
  syllabusTracker, 
  onUpdateTracker 
}) => {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectWeight, setNewSubjectWeight] = useState('');

  const addSubject = () => {
    if (!newSubjectName.trim()) return;

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      chapters: [],
      color: SUBJECT_COLORS[syllabusTracker.subjects.length % SUBJECT_COLORS.length],
      weight: newSubjectWeight ? parseFloat(newSubjectWeight) : undefined,
      createdAt: new Date(),
    };

    const updatedTracker = {
      ...syllabusTracker,
      subjects: [...syllabusTracker.subjects, newSubject],
    };

    updateTrackerStats(updatedTracker);
    setNewSubjectName('');
    setNewSubjectWeight('');
    setShowAddSubject(false);
  };

  const updateSubject = (updatedSubject: Subject) => {
    const updatedSubjects = syllabusTracker.subjects.map(subj =>
      subj.id === updatedSubject.id ? updatedSubject : subj
    );
    
    const updatedTracker = {
      ...syllabusTracker,
      subjects: updatedSubjects,
    };

    updateTrackerStats(updatedTracker);
  };

  const deleteSubject = (subjectId: string) => {
    const updatedSubjects = syllabusTracker.subjects.filter(subj => subj.id !== subjectId);
    const updatedTracker = {
      ...syllabusTracker,
      subjects: updatedSubjects,
    };

    updateTrackerStats(updatedTracker);
  };

  const updateTrackerStats = (tracker: SyllabusTrackerType) => {
    const allChapters = tracker.subjects.flatMap(subj => subj.chapters);
    const completedChapters = allChapters.filter(ch => ch.completed);
    
    const updatedTracker = {
      ...tracker,
      totalProgress: allChapters.length > 0 ? (completedChapters.length / allChapters.length) * 100 : 0,
      completedChapters: completedChapters.length,
      totalChapters: allChapters.length,
      estimatedTotalHours: allChapters.reduce((sum, ch) => sum + (ch.estimatedHours || 0), 0),
      actualTotalHours: completedChapters.reduce((sum, ch) => sum + (ch.estimatedHours || 0), 0),
    };

    onUpdateTracker(updatedTracker);
  };

  const getMotivationalMessage = () => {
    const progress = syllabusTracker.totalProgress;
    if (progress === 100) return { text: "🎉 Excellent! You've completed your entire syllabus!", icon: Award, color: "text-green-600" };
    if (progress >= 80) return { text: "🚀 Almost there! You're in the final stretch!", icon: TrendingUp, color: "text-blue-600" };
    if (progress >= 60) return { text: "💪 Great progress! Keep up the momentum!", icon: Target, color: "text-purple-600" };
    if (progress >= 40) return { text: "📚 You're making solid progress! Stay focused!", icon: BookOpen, color: "text-indigo-600" };
    if (progress >= 20) return { text: "🌟 Good start! Keep building your knowledge!", icon: Zap, color: "text-yellow-600" };
    return { text: "🎯 Ready to begin your preparation journey?", icon: Target, color: "text-gray-600" };
  };

  const motivational = getMotivationalMessage();

  return (
    <div className="space-y-6">
      {/* Overall Progress Dashboard */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Syllabus Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your preparation across all subjects
              </p>
            </div>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(syllabusTracker.totalProgress)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Overall Progress
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {syllabusTracker.completedChapters}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Chapters Done
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {syllabusTracker.subjects.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Subjects
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {syllabusTracker.estimatedTotalHours || 0}h
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total Study Time
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Completion
            </span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {syllabusTracker.completedChapters}/{syllabusTracker.totalChapters} chapters
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${syllabusTracker.totalProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className={`flex items-center gap-3 p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 ${motivational.color}`}>
          <motivational.icon className="w-5 h-5" />
          <span className="text-sm font-medium">
            {motivational.text}
          </span>
        </div>
      </div>

      {/* Add Subject Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Subjects ({syllabusTracker.subjects.length})
        </h3>
        <button
          onClick={() => setShowAddSubject(!showAddSubject)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddSubject && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Add New Subject
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Subject name (e.g., Calculus, Physics)"
              className="px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            />
            
            <input
              type="number"
              value={newSubjectWeight}
              onChange={(e) => setNewSubjectWeight(e.target.value)}
              placeholder="Weight % (optional)"
              min="0"
              max="100"
              className="px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            />
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={addSubject}
              disabled={!newSubjectName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Add Subject
            </button>
            <button
              onClick={() => setShowAddSubject(false)}
              className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subjects List */}
      <div className="space-y-4">
        {syllabusTracker.subjects.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No subjects added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Break down your exam syllabus into subjects and chapters for better organization and tracking.
            </p>
            <button
              onClick={() => setShowAddSubject(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Add Your First Subject
            </button>
          </div>
        ) : (
          syllabusTracker.subjects.map((subject) => (
            <SubjectSection
              key={subject.id}
              subject={subject}
              onUpdateSubject={updateSubject}
              onDeleteSubject={deleteSubject}
            />
          ))
        )}
      </div>
    </div>
  );
};
