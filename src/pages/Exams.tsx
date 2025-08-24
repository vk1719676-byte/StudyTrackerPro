import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, addExam, updateExam, deleteExam } from '../services/firestore';
import { Exam } from '../types';

export const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    syllabus: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dailyHours: '',
    weeklyHours: ''
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserExams(user.uid, (examData) => {
      setExams(examData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      syllabus: '',
      priority: 'medium',
      dailyHours: '',
      weeklyHours: ''
    });
    setEditingExam(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const examData = {
      name: formData.name,
      date: new Date(formData.date),
      syllabus: formData.syllabus,
      priority: formData.priority,
      goals: {
        dailyHours: parseFloat(formData.dailyHours) || 0,
        weeklyHours: parseFloat(formData.weeklyHours) || 0,
        topicProgress: {}
      },
      userId: user.uid,
      createdAt: new Date()
    };

    try {
      if (editingExam) {
        await updateExam(editingExam.id, examData);
      } else {
        await addExam(examData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam: Exam) => {
    setFormData({
      name: exam.name,
      date: exam.date.toISOString().split('T')[0],
      syllabus: exam.syllabus,
      priority: exam.priority,
      dailyHours: exam.goals.dailyHours.toString(),
      weeklyHours: exam.goals.weeklyHours.toString()
    });
    setEditingExam(exam);
    setShowForm(true);
  };

  const handleDelete = async (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(examId);
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTimeRemaining = (examDate: Date) => {
    const now = new Date();
    const timeDiff = examDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'Past due';
    if (daysDiff === 0) return 'Today!';
    if (daysDiff === 1) return '1 day left';
    return `${daysDiff} days left`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Your Exams
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your upcoming exams and track your preparation progress
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            icon={Plus}
          >
            Add Exam
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {editingExam ? 'Edit Exam' : 'Add New Exam'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Exam Name"
                  placeholder="e.g., Mathematics Final"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />

                <Input
                  label="Exam Date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => setFormData({ ...formData, date: value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <Input
                  label="Daily Study Goal (hours)"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 2"
                  value={formData.dailyHours}
                  onChange={(value) => setFormData({ ...formData, dailyHours: value })}
                />

                <Input
                  label="Weekly Study Goal (hours)"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 14"
                  value={formData.weeklyHours}
                  onChange={(value) => setFormData({ ...formData, weeklyHours: value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Syllabus/Topics
                </label>
                <textarea
                  placeholder="List the main topics or chapters to cover..."
                  value={formData.syllabus}
                  onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingExam ? 'Update Exam' : 'Add Exam'}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {exams.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No exams yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your first exam to start tracking your preparation progress
            </p>
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Add Your First Exam
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const timeRemaining = getTimeRemaining(exam.date);
              const isUrgent = timeRemaining.includes('day') && parseInt(timeRemaining) <= 7;

              return (
                <Card 
                  key={exam.id} 
                  className={`p-6 ${isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
                  hover
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {exam.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(exam.priority)}`}>
                          {exam.priority.toUpperCase()}
                        </span>
                        {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEdit(exam)}
                        className="p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(exam.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {exam.date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {timeRemaining}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Study Goals</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div>Daily: {exam.goals.dailyHours}h</div>
                        <div>Weekly: {exam.goals.weeklyHours}h</div>
                      </div>
                    </div>

                    {exam.syllabus && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Syllabus</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {exam.syllabus}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
