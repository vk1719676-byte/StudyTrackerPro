import React, { useState } from 'react';
import { Check, Clock, Edit, Trash2, AlertCircle, Star, Timer } from 'lucide-react';
import { Chapter } from '../../types';

interface ChapterItemProps {
  chapter: Chapter;
  onUpdate: (chapter: Chapter) => void;
  onDelete: (chapterId: string) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: chapter.title,
    estimatedHours: chapter.estimatedHours?.toString() || '',
    notes: chapter.notes || '',
    priority: chapter.priority,
  });

  const handleToggleComplete = () => {
    onUpdate({
      ...chapter,
      completed: !chapter.completed,
      completedAt: !chapter.completed ? new Date() : undefined,
    });
  };

  const handleSave = () => {
    onUpdate({
      ...chapter,
      title: editData.title,
      estimatedHours: editData.estimatedHours ? parseFloat(editData.estimatedHours) : undefined,
      notes: editData.notes,
      priority: editData.priority,
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Star className="w-3 h-3" />;
      case 'low': return <Check className="w-3 h-3" />;
      default: return null;
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            placeholder="Chapter title"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              value={editData.estimatedHours}
              onChange={(e) => setEditData({ ...editData, estimatedHours: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              placeholder="Est. hours"
              min="0"
              step="0.5"
            />
            
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value as Chapter['priority'] })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>
          
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
            placeholder="Chapter notes (optional)"
            rows={2}
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 border transition-all duration-300 group hover:shadow-md ${
      chapter.completed 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            chapter.completed
              ? 'bg-green-500 border-green-500 text-white transform scale-110'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:scale-110'
          }`}
        >
          {chapter.completed && <Check className="w-3 h-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium transition-all duration-200 ${
              chapter.completed 
                ? 'text-green-700 dark:text-green-300 line-through opacity-75' 
                : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300'
            }`}>
              {chapter.title}
            </h4>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(chapter.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${getPriorityColor(chapter.priority)}`}>
              {getPriorityIcon(chapter.priority)}
              {chapter.priority.toUpperCase()}
            </span>
            
            {chapter.estimatedHours && (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Timer className="w-3 h-3" />
                {chapter.estimatedHours}h
              </span>
            )}
            
            {chapter.completed && chapter.completedAt && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Check className="w-3 h-3" />
                Completed {chapter.completedAt.toLocaleDateString()}
              </span>
            )}
          </div>
          
          {chapter.notes && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {chapter.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
