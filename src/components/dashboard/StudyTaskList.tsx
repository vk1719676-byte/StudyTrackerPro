import React, { useState, useEffect, useRef } from 'react';
import { CheckSquare, Plus, Check, X, Calendar, Clock, AlertCircle, BookOpen, Target, Trash2, Edit3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const priorityConfig = {
  low: {
    color: 'text-blue-700 dark:text-blue-300',
    bgGradient: 'bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30',
    border: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500 text-white',
    label: 'Low'
  },
  medium: {
    color: 'text-orange-700 dark:text-orange-300',
    bgGradient: 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30',
    border: 'border-orange-200 dark:border-orange-700',
    badge: 'bg-orange-500 text-white',
    label: 'Medium'
  },
  high: {
    color: 'text-red-700 dark:text-red-300',
    bgGradient: 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30',
    border: 'border-red-200 dark:border-red-700',
    badge: 'bg-red-500 text-white',
    label: 'High'
  }
};

interface StudyTaskListProps {
  className?: string;
}

export const StudyTaskList: React.FC<StudyTaskListProps> = ({ className = '' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    } else {
      // Add sample tasks
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Review Chapter 5 - Calculus',
          description: 'Focus on derivatives and their applications',
          priority: 'high',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Complete Physics Lab Report',
          priority: 'medium',
          completed: false,
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('studyTasks', JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length >= 0) {
      localStorage.setItem('studyTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Auto-focus input when adding new task
  useEffect(() => {
    if (showAddTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddTask]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddTask(false);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className={`group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/20 hover:border-gray-300/80 dark:hover:border-gray-600/80 transition-all duration-500 ${className}`}>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30">
              <CheckSquare className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1 drop-shadow-sm">Study Tasks</h2>
              <p className="text-white/80 font-medium text-sm">Organize your study priorities</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/30">
              <Target className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">{pendingCount} pending</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/30">
              <Check className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">{completedCount} done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-2 rounded-2xl">
          {(['all', 'pending', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === filterOption
                  ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              <span className="ml-2 text-xs opacity-70">
                ({filterOption === 'all' ? tasks.length : 
                  filterOption === 'pending' ? pendingCount : completedCount})
              </span>
            </button>
          ))}
        </div>

        {/* Add Task Button */}
        {!showAddTask && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 group mb-6"
          >
            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-lg">Add Study Task</span>
          </button>
        )}

        {/* Add Task Form */}
        {showAddTask && (
          <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-700/60">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100">New Task</h3>
            </div>
            
            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title (e.g., Review Chapter 3)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              />
              
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Optional description..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none min-h-[80px]"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Organize your study priorities effectively
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.title.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => {
              const config = priorityConfig[task.priority];
              const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
              
              return (
                <div
                  key={task.id}
                  className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                    task.completed
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                      : `${config.bgGradient} ${config.border}`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold text-lg ${
                          task.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm mb-3 ${
                          task.completed
                            ? 'text-gray-500 dark:text-gray-400'
                            : config.color
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Task Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.badge}`}>
                            {config.label}
                          </span>
                          
                          {task.dueDate && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                              isOverdue
                                ? 'bg-red-500 text-white'
                                : task.completed
                                ? 'bg-gray-400 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              <span>{getDaysUntilDue(task.dueDate)}</span>
                            </div>
                          )}
                        </div>

                        {task.completed && task.completedAt && (
                          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            <Check className="w-3 h-3" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-8 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 rounded-full mb-6 inline-block shadow-xl">
              <CheckSquare className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-gray-100 text-2xl mb-3">
              {filter === 'completed' ? 'No Completed Tasks' : filter === 'pending' ? 'No Pending Tasks' : 'No Tasks Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {filter === 'completed' 
                ? 'Complete some tasks to see them here!' 
                : filter === 'pending'
                ? 'All caught up! No pending tasks.'
                : 'Start organizing your study priorities!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
