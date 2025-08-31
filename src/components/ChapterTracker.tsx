import React, { useState } from 'react';
import { Plus, BookOpen, CheckCircle2, Clock, Circle, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Chapter } from '../types';

interface ChapterTrackerProps {
  chapters: Chapter[];
  onAddChapter: (chapter: Omit<Chapter, 'id' | 'createdAt'>) => void;
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  onDeleteChapter: (chapterId: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ChapterTracker: React.FC<ChapterTrackerProps> = ({
  chapters,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
  isExpanded,
  onToggleExpand,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started' as Chapter['status'],
  });

  const completedChapters = chapters.filter(ch => ch.status === 'completed').length;
  const totalChapters = chapters.length;
  const completionPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'not-started' });
    setEditingChapter(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingChapter) {
      onUpdateChapter(editingChapter.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        completedAt: formData.status === 'completed' ? new Date() : undefined,
      });
    } else {
      onAddChapter({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        completedAt: formData.status === 'completed' ? new Date() : undefined,
      });
    }
    resetForm();
  };

  const handleEdit = (chapter: Chapter) => {
    setFormData({
      title: chapter.title,
      description: chapter.description || '',
      status: chapter.status,
    });
    setEditingChapter(chapter);
    setShowAddForm(true);
  };

  const handleStatusToggle = (chapter: Chapter) => {
    const newStatus = chapter.status === 'completed' ? 'not-started' : 
                     chapter.status === 'not-started' ? 'in-progress' : 'completed';
    
    onUpdateChapter(chapter.id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : undefined,
    });
  };

  const getStatusIcon = (status: Chapter['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Chapter['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'in-progress':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Chapter Progress Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-gray-900 dark:text-gray-100">
              Syllabus Progress
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedChapters} of {totalChapters} chapters completed
            </span>
            <span className="text-lg font-bold text-purple-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded Chapter Management */}
      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Add Chapter Button */}
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            icon={Plus}
            className="w-full border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
          >
            Add Chapter
          </Button>

          {/* Add/Edit Chapter Form */}
          {showAddForm && (
            <Card className="p-4 bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 border-purple-200 dark:border-purple-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Chapter Title"
                  placeholder="e.g., Chapter 1: Introduction"
                  value={formData.title}
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  required
                  className="border-purple-200 focus:border-purple-500"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Brief description of chapter content..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Chapter['status'] })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                  >
                    <option value="not-started">📝 Not Started</option>
                    <option value="in-progress">📖 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {editingChapter ? 'Update' : 'Add'} Chapter
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Chapters List */}
          {chapters.length > 0 ? (
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <Card 
                  key={chapter.id} 
                  className={`p-4 transition-all duration-300 hover:shadow-md ${getStatusColor(chapter.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleStatusToggle(chapter)}
                      className="flex-shrink-0 p-1 hover:scale-110 transition-transform duration-200"
                    >
                      {getStatusIcon(chapter.status)}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                        {chapter.title}
                      </h5>
                      {chapter.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {chapter.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          chapter.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          chapter.status === 'in-progress' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {chapter.status === 'completed' ? '✅ Completed' :
                           chapter.status === 'in-progress' ? '📖 In Progress' : '📝 Not Started'}
                        </span>
                        {chapter.completedAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Completed {chapter.completedAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(chapter)}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteChapter(chapter.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 border-dashed border-2 border-purple-300 dark:border-purple-700">
              <BookOpen className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                No chapters added yet
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Add First Chapter
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
