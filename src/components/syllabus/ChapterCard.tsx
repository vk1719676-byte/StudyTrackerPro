import React, { useState } from 'react';
import { CheckCircle, Circle, Edit, Trash2, FileText, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Chapter } from '../../types';

interface ChapterCardProps {
  chapter: Chapter;
  onUpdateChapter: (updates: Partial<Chapter>) => void;
  onDeleteChapter: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  onUpdateChapter,
  onDeleteChapter,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(chapter.name);
  const [editNotes, setEditNotes] = useState(chapter.notes || '');
  const [showNotes, setShowNotes] = useState(false);

  const handleSave = () => {
    onUpdateChapter({
      name: editName.trim(),
      notes: editNotes.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(chapter.name);
    setEditNotes(chapter.notes || '');
    setIsEditing(false);
  };

  const toggleCompletion = () => {
    onUpdateChapter({ completed: !chapter.completed });
  };

  return (
    <div className={`
      p-3 rounded-lg border transition-all duration-200 
      ${chapter.completed 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
      }
    `}>
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editName}
            onChange={setEditName}
            className="text-sm"
            placeholder="Chapter name..."
          />
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Notes (optional)..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} icon={Save} className="px-2 py-1 text-xs">
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancel} icon={X} className="px-2 py-1 text-xs">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCompletion}
                className="p-1 hover:bg-transparent"
              >
                {chapter.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 hover:text-green-500" />
                )}
              </Button>
              
              <span className={`
                text-sm font-medium flex-1
                ${chapter.completed 
                  ? 'text-green-700 dark:text-green-400 line-through' 
                  : 'text-gray-700 dark:text-gray-300'
                }
              `}>
                {chapter.name}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {chapter.notes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                  className="p-1 text-gray-500 hover:text-purple-600"
                >
                  <FileText className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-blue-600"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteChapter}
                className="p-1 text-gray-500 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {showNotes && chapter.notes && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600/50 rounded text-xs text-gray-600 dark:text-gray-400">
              {chapter.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
