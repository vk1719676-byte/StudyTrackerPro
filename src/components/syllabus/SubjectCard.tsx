import React, { useState } from 'react';
import { Plus, BookOpen, CheckCircle, Circle, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Subject, Chapter } from '../../types';
import { ChapterCard } from './ChapterCard';

interface SubjectCardProps {
  subject: Subject;
  onUpdateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddChapter: (subjectId: string, chapter: Omit<Chapter, 'id'>) => void;
  onUpdateChapter: (subjectId: string, chapterId: string, updates: Partial<Chapter>) => void;
  onDeleteChapter: (subjectId: string, chapterId: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onUpdateSubject,
  onDeleteSubject,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');

  const completedChapters = subject.chapters.filter(chapter => chapter.completed).length;
  const totalChapters = subject.chapters.length;
  const completionPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onUpdateSubject(subject.id, { name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterName.trim()) {
      onAddChapter(subject.id, {
        name: newChapterName.trim(),
        completed: false,
        createdAt: new Date(),
      });
      setNewChapterName('');
      setShowAddChapter(false);
    }
  };

  const getProgressColor = () => {
    if (completionPercentage === 100) return 'from-green-500 to-emerald-600';
    if (completionPercentage >= 75) return 'from-blue-500 to-cyan-600';
    if (completionPercentage >= 50) return 'from-yellow-500 to-orange-500';
    if (completionPercentage >= 25) return 'from-orange-500 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </Button>
          
          <BookOpen className="w-5 h-5 text-purple-600" />
          
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={setEditName}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="text-sm flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit} className="px-2 py-1 text-xs">
                Save
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => {
                  setIsEditing(false);
                  setEditName(subject.name);
                }}
                className="px-2 py-1 text-xs"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">
              {subject.name}
            </h4>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="w-3 h-3 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteSubject(subject.id)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Progress
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
            {completedChapters}/{totalChapters} chapters ({Math.round(completionPercentage)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Expanded Chapter View */}
      {isExpanded && (
        <div className="space-y-3 mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
          {subject.chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onUpdateChapter={(updates) => onUpdateChapter(subject.id, chapter.id, updates)}
              onDeleteChapter={() => onDeleteChapter(subject.id, chapter.id)}
            />
          ))}
          
          {/* Add Chapter Form */}
          {showAddChapter ? (
            <form onSubmit={handleAddChapter} className="flex gap-2 mt-3">
              <Input
                placeholder="Chapter name..."
                value={newChapterName}
                onChange={setNewChapterName}
                className="flex-1 text-sm"
                autoFocus
              />
              <Button size="sm" type="submit" className="px-3 py-1 text-xs">
                Add
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => {
                  setShowAddChapter(false);
                  setNewChapterName('');
                }}
                className="px-3 py-1 text-xs"
              >
                Cancel
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddChapter(true)}
              icon={Plus}
              className="w-full justify-center py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-500 hover:text-purple-600 transition-all duration-200"
            >
              Add Chapter
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
