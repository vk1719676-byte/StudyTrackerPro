import React, { useState } from 'react';
import { Plus, BookOpen, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Subject, Chapter } from '../../types';
import { SubjectCard } from './SubjectCard';

interface SyllabusTrackerProps {
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  subjects,
  onUpdateSubjects,
}) => {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Calculate overall progress
  const totalChapters = subjects.reduce((sum, subject) => sum + subject.chapters.length, 0);
  const completedChapters = subjects.reduce(
    (sum, subject) => sum + subject.chapters.filter(chapter => chapter.completed).length, 
    0
  );
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
        chapters: [],
        createdAt: new Date(),
      };
      onUpdateSubjects([...subjects, newSubject]);
      setNewSubjectName('');
      setShowAddSubject(false);
    }
  };

  const handleUpdateSubject = (subjectId: string, updates: Partial<Subject>) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId ? { ...subject, ...updates } : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject and all its chapters?')) {
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
      onUpdateSubjects(updatedSubjects);
    }
  };

  const handleAddChapter = (subjectId: string, chapterData: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = {
      ...chapterData,
      id: Date.now().toString(),
    };
    
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId 
        ? { ...subject, chapters: [...subject.chapters, newChapter] }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const handleUpdateChapter = (subjectId: string, chapterId: string, updates: Partial<Chapter>) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            chapters: subject.chapters.map(chapter =>
              chapter.id === chapterId ? { ...chapter, ...updates } : chapter
            )
          }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const handleDeleteChapter = (subjectId: string, chapterId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            chapters: subject.chapters.filter(chapter => chapter.id !== chapterId)
          }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const getProgressColor = () => {
    if (overallProgress === 100) return 'from-green-500 to-emerald-600';
    if (overallProgress >= 75) return 'from-blue-500 to-cyan-600';
    if (overallProgress >= 50) return 'from-yellow-500 to-orange-500';
    if (overallProgress >= 25) return 'from-orange-500 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Syllabus Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subjects.length} subjects • {totalChapters} total chapters
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(overallProgress)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {completedChapters}/{totalChapters} completed
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Add Subject Button */}
      {showAddSubject ? (
        <Card className="p-4">
          <form onSubmit={handleAddSubject} className="flex gap-3">
            <Input
              placeholder="Subject name (e.g., Mathematics, Physics)..."
              value={newSubjectName}
              onChange={setNewSubjectName}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" type="submit" className="px-4">
              Add
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => {
                setShowAddSubject(false);
                setNewSubjectName('');
              }}
              className="px-4"
            >
              Cancel
            </Button>
          </form>
        </Card>
      ) : (
        <Button
          onClick={() => setShowAddSubject(true)}
          icon={Plus}
          variant="ghost"
          className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-600 hover:text-purple-600 transition-all duration-200"
        >
          Add Subject
        </Button>
      )}

      {/* Subjects List */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
              onAddChapter={handleAddChapter}
              onUpdateChapter={handleUpdateChapter}
              onDeleteChapter={handleDeleteChapter}
            />
          ))}
        </div>
      )}

      {subjects.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No subjects added yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start organizing your exam syllabus by adding subjects and chapters
          </p>
          <Button
            onClick={() => setShowAddSubject(true)}
            icon={Plus}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Add Your First Subject
          </Button>
        </Card>
      )}
    </div>
  );
};
