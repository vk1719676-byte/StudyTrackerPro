import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { SyllabusTrackerComponent } from './SyllabusTracker';
import { ExamFormData, Exam } from '../types';

interface ExamFormProps {
  showForm: boolean;
  editingExam: Exam | null;
  formData: ExamFormData;
  onFormDataChange: (data: ExamFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({
  showForm,
  editingExam,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  if (!showForm) return null;

  return (
    <Card className="mb-8 p-0 overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold">
          {editingExam ? 'Edit Exam' : 'Create New Exam'}
        </h2>
        <p className="opacity-90 mt-1">
          {editingExam ? 'Update your exam details' : 'Add a new exam to track your preparation'}
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Exam Name"
              placeholder="e.g., Mathematics Final"
              value={formData.name}
              onChange={(value) => onFormDataChange({ ...formData, name: value })}
              required
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
            />

            <Input
              label="Exam Date"
              type="date"
              value={formData.date}
              onChange={(value) => onFormDataChange({ ...formData, date: value })}
              required
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => onFormDataChange({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              General Syllabus Description (Optional)
            </label>
            <textarea
              placeholder="📚 General description of what this exam covers..."
              value={formData.syllabus}
              onChange={(e) => onFormDataChange({ ...formData, syllabus: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none"
            />
          </div>

          {/* Structured Syllabus Tracker */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Structured Syllabus Tracker
              </h3>
            </div>
            
            {formData.syllabusTracker ? (
              <SyllabusTrackerComponent
                syllabusTracker={formData.syllabusTracker}
                onUpdate={(tracker) => onFormDataChange({ ...formData, syllabusTracker: tracker })}
              />
            ) : (
              <Card className="p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Create Structured Syllabus
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Organize your exam preparation with subjects and chapters for better tracking.
                </p>
                <Button
                  type="button"
                  onClick={() => onFormDataChange({ 
                    ...formData, 
                    syllabusTracker: {
                      subjects: [],
                      totalProgress: 0,
                      completedSubjects: 0,
                      completedChapters: 0,
                      totalChapters: 0
                    }
                  })}
                  icon={Plus}
                  variant="ghost"
                  className="border-2 border-dashed border-purple-300 dark:border-purple-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  Create Syllabus Structure
                </Button>
              </Card>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {editingExam ? '✏️ Update Exam' : '➕ Create Exam'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
