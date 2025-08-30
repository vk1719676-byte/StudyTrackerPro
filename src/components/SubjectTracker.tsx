import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Palette, Award, TrendingUp, Edit3, Trash2, Brain, Target, Clock } from 'lucide-react';
import { Subject, Chapter } from '../types';
import { ChapterTracker } from './ChapterTracker';
import { Button } from './ui/Button';

interface SubjectTrackerProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
  examId: string;
}

export const SubjectTracker: React.FC<SubjectTrackerProps> = ({
  subjects,
  onSubjectsChange,
  examId
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const subjectColors = [
    'bg-gradient-to-r from-red-500 to-pink-600',
    'bg-gradient-to-r from-blue-500 to-cyan-600',
    'bg-gradient-to-r from-green-500 to-emerald-600',
    'bg-gradient-to-r from-purple-500 to-indigo-600',
    'bg-gradient-to-r from-yellow-500 to-orange-600',
    'bg-gradient-to-r from-teal-500 to-cyan-600',
    'bg-gradient-to-r from-pink-500 to-rose-600',
    'bg-gradient-to-r from-violet-500 to-purple-600',
  ];

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      chapters: [],
      completed: false,
      progress: 0,
      examId,
      color: subjectColors[subjects.length % subjectColors.length],
      description: '',
      weight: 100 / (subjects.length + 1), // Auto-distribute weight
    };

    // Redistribute weights
    const updatedSubjects = subjects.map(subject => ({
      ...subject,
      weight: 100 / (subjects.length + 1)
    }));

    onSubjectsChange([...updatedSubjects, newSubject]);
    setNewSubjectName('');
  };

  const deleteSubject = (subjectId: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    // Redistribute weights
    const redistributedSubjects = updatedSubjects.map(subject => ({
      ...subject,
      weight: updatedSubjects.length > 0 ? 100 / updatedSubjects.length : 0
    }));
    onSubjectsChange(redistributedSubjects);
  };

  const startEditing = (subject: Subject) => {
    setEditingSubject(subject.id);
    setEditingName(subject.name);
  };

  const saveEdit = (subjectId: string) => {
    if (!editingName.trim()) return;
    
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId ? { ...subject, name: editingName.trim() } : subject
    );
    onSubjectsChange(updatedSubjects);
    setEditingSubject(null);
    setEditingName('');
  };

  const updateSubjectChapters = (subjectId: string, chapters: Chapter[]) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const totalTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
        const completedTopics = chapters.reduce((sum, chapter) => 
          sum + chapter.topics.filter(topic => topic.completed).length, 0
        );
        const completed = chapters.length > 0 && chapters.every(chapter => chapter.completed);
        const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
        
        return {
          ...subject,
          chapters,
          completed,
          progress
        };
      }
      return subject;
    });
    onSubjectsChange(updatedSubjects);
  };

  const updateSubjectWeight = (subjectId: string, weight: number) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId ? { ...subject, weight } : subject
    );
    onSubjectsChange(updatedSubjects);
  };

  const totalChapters = subjects.reduce((sum, subject) => sum + subject.chapters.length, 0);
  const totalTopics = subjects.reduce((sum, subject) => 
    sum + subject.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.topics.length, 0), 0
  );
  const completedChapters = subjects.reduce((sum, subject) => 
    sum + subject.chapters.filter(chapter => chapter.completed).length, 0
  );
  const completedTopics = subjects.reduce((sum, subject) => 
    sum + subject.chapters.reduce((chapterSum, chapter) => 
      chapterSum + chapter.topics.filter(topic => topic.completed).length, 0
    ), 0
  );
  const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Subject Summary */}
      {subjects.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg">
                  Subject Analysis
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Complete breakdown of your study progress
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {Math.round(overallProgress)}%
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Overall Progress</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{subjects.length}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Subjects</p>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalChapters}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Chapters</p>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalTopics}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Topics</p>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{completedTopics}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Completed</p>
            </div>
          </div>

          <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
              style={{ width: `${Math.max(overallProgress, 0)}%` }}
            >
              {overallProgress > 20 && (
                <span className="text-xs font-bold text-white">
                  {Math.round(overallProgress)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Subject */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new subject..."
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSubject()}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        />
        <Button
          onClick={addSubject}
          icon={Plus}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Add Subject
        </Button>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.map((subject, index) => {
          const isExpanded = expandedSubjects.has(subject.id);
          const subjectChapters = subject.chapters.length;
          const subjectTopics = subject.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
          const completedChapters = subject.chapters.filter(chapter => chapter.completed).length;

          return (
            <div
              key={subject.id}
              className={`
                border-2 rounded-2xl transition-all duration-300 hover:shadow-xl overflow-hidden
                ${subject.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700' 
                  : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600'
                }
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Subject Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleSubject(subject.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>

                    <div className={`w-4 h-4 rounded-full ${subject.color || 'bg-purple-500'}`}></div>

                    <div className="flex-1">
                      {editingSubject === subject.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(subject.id)}
                          onBlur={() => saveEdit(subject.id)}
                          className="w-full px-3 py-2 text-lg font-bold border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          autoFocus
                        />
                      ) : (
                        <h3
                          className={`text-xl font-bold transition-all duration-200 ${
                            subject.completed
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {subject.name}
                        </h3>
                      )}
                      
                      <div className="flex items-center gap-6 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {subjectChapters} chapters
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="w-4 h-4" />
                          {subjectTopics} topics
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {Math.round(subject.progress)}% done
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Weight Input */}
                    <div className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(subject.weight || 0)}
                        onChange={(e) => updateSubjectWeight(subject.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Weight %</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit3}
                      onClick={() => startEditing(subject)}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-600"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => deleteSubject(subject.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                    />
                  </div>
                </div>

                {/* Subject Progress Visualization */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subject Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {Math.round(subject.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        subject.completed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : subject.color || 'bg-gradient-to-r from-purple-500 to-pink-600'
                      }`}
                      style={{ width: `${Math.max(subject.progress, 0)}%` }}
                    ></div>
                  </div>

                  {/* Chapter Progress Indicators */}
                  {subjectChapters > 0 && (
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{completedChapters}/{subjectChapters} chapters completed</span>
                      <span>{subjectTopics} total topics</span>
                    </div>
                  )}
                </div>

                {/* Subject Status Badge */}
                {subject.completed && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                    <Award className="w-4 h-4" />
                    Subject Mastered!
                  </div>
                )}
              </div>

              {/* Subject Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-600 pt-6 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
                  <ChapterTracker
                    chapters={subject.chapters}
                    onChaptersChange={(chapters) => updateSubjectChapters(subject.id, chapters)}
                    subjectId={subject.id}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold mb-2">No subjects added yet</h4>
          <p className="text-sm mb-6">Start organizing your exam preparation by adding subjects!</p>
        </div>
      )}
    </div>
  );
};
