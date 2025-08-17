import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, CheckCircle, Clock, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  category: 'daily' | 'weekly' | 'monthly' | 'exam';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetHours: '',
    deadline: '',
    category: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'exam'
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
    });

    const unsubscribeSessions = getUserSessions(user.uid, (sessionData) => {
      setSessions(sessionData);
      updateGoalProgress(sessionData);
      setLoading(false);
    });

    // Load goals from localStorage
    const savedGoals = localStorage.getItem(`goals-${user.uid}`);
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt)
      }));
      setGoals(parsedGoals);
    }

    return () => {
      unsubscribeExams();
      unsubscribeSessions();
    };
  }, [user]);

  const updateGoalProgress = (sessionData: StudySession[]) => {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        let currentHours = 0;
        const now = new Date();

        switch (goal.category) {
          case 'daily':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            currentHours = sessionData
              .filter(session => {
                const sessionDate = new Date(session.date);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate.getTime() === today.getTime();
              })
              .reduce((total, session) => total + session.duration / 60, 0);
            break;

          case 'weekly':
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            currentHours = sessionData
              .filter(session => new Date(session.date) >= weekStart)
              .reduce((total, session) => total + session.duration / 60, 0);
            break;

          case 'monthly':
            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            currentHours = sessionData
              .filter(session => new Date(session.date) >= monthStart)
              .reduce((total, session) => total + session.duration / 60, 0);
            break;

          case 'exam':
            currentHours = sessionData
              .filter(session => new Date(session.date) >= goal.createdAt)
              .reduce((total, session) => total + session.duration / 60, 0);
            break;
        }

        const status = currentHours >= goal.targetHours ? 'completed' : 
                      new Date() > goal.deadline ? 'paused' : 'active';

        return { ...goal, currentHours: Math.round(currentHours * 10) / 10, status };
      });

      // Save updated goals
      if (user) {
        localStorage.setItem(`goals-${user.uid}`, JSON.stringify(updatedGoals));
      }

      return updatedGoals;
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetHours: '',
      deadline: '',
      category: 'weekly'
    });
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetHours: parseFloat(formData.targetHours),
      currentHours: editingGoal?.currentHours || 0,
      deadline: new Date(formData.deadline),
      category: formData.category,
      status: editingGoal?.status || 'active',
      createdAt: editingGoal?.createdAt || new Date()
    };

    if (editingGoal) {
      setGoals(prev => prev.map(goal => goal.id === editingGoal.id ? goalData : goal));
    } else {
      setGoals(prev => [...prev, goalData]);
    }

    // Save to localStorage
    const updatedGoals = editingGoal 
      ? goals.map(goal => goal.id === editingGoal.id ? goalData : goal)
      : [...goals, goalData];
    localStorage.setItem(`goals-${user.uid}`, JSON.stringify(updatedGoals));

    resetForm();
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      targetHours: goal.targetHours.toString(),
      deadline: goal.deadline.toISOString().split('T')[0],
      category: goal.category
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      if (user) {
        localStorage.setItem(`goals-${user.uid}`, JSON.stringify(updatedGoals));
      }
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentHours / goal.targetHours) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return Clock;
      case 'weekly': return Calendar;
      case 'monthly': return TrendingUp;
      case 'exam': return Award;
      default: return Target;
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalHoursThisWeek = sessions
    .filter(session => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return new Date(session.date) >= weekStart;
    })
    .reduce((total, session) => total + session.duration / 60, 0);

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
              Study Goals 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set and track your study goals to stay motivated and achieve success
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} icon={Plus}>
            Add Goal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activeGoals.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {completedGoals.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(totalHoursThisWeek * 10) / 10}h
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Goal Form */}
        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Goal Title"
                  placeholder="e.g., Study 2 hours daily"
                  value={formData.title}
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="daily">Daily Goal</option>
                    <option value="weekly">Weekly Goal</option>
                    <option value="monthly">Monthly Goal</option>
                    <option value="exam">Exam Preparation</option>
                  </select>
                </div>

                <Input
                  label="Target Hours"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 10"
                  value={formData.targetHours}
                  onChange={(value) => setFormData({ ...formData, targetHours: value })}
                  required
                />

                <Input
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(value) => setFormData({ ...formData, deadline: value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe your goal and motivation..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first study goal to start tracking your progress
            </p>
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Create Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const Icon = getCategoryIcon(goal.category);
              const progress = getProgressPercentage(goal);
              const isOverdue = new Date() > goal.deadline && goal.status !== 'completed';

              return (
                <Card 
                  key={goal.id} 
                  className={`p-6 ${isOverdue ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
                  hover
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {goal.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEdit(goal)}
                        className="p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {goal.currentHours}h / {goal.targetHours}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            goal.status === 'completed' 
                              ? 'bg-green-500' 
                              : 'bg-gradient-to-r from-purple-500 to-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.round(progress)}% complete
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="capitalize font-medium">{goal.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {goal.deadline.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.description}
                      </p>
                    )}

                    {goal.status === 'completed' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          🎉 Goal Completed!
                        </p>
                      </div>
                    )}

                    {isOverdue && goal.status !== 'completed' && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          ⚠️ Goal Overdue
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