import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, BookOpen, Search } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { ExamForm } from './components/ExamForm';
import { ExamCard } from './components/ExamCard';
import { ExamStats } from './components/ExamStats';
import { ExamFilters } from './components/ExamFilters';
import { useAuth } from './contexts/AuthContext';
import { getUserExams, addExam, updateExam, deleteExam } from './services/firestore';
import { Exam, ExamFormData } from './types';

export const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<ExamFormData>({
    name: '',
    date: '',
    syllabus: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Update current time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserExams(user.uid, (examData) => {
      setExams(examData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Enhanced statistics calculations
  const stats = useMemo(() => {
    const now = currentTime;
    const upcomingExams = exams.filter(exam => exam.date >= now);
    const pastExams = exams.filter(exam => exam.date < now);
    const urgentExams = exams.filter(exam => {
      const daysDiff = Math.ceil((exam.date.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff <= 7 && daysDiff >= 0;
    });
    const highPriorityCount = exams.filter(exam => exam.priority === 'high').length;
    const todayExams = exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.toDateString() === now.toDateString();
    });

    return {
      total: exams.length,
      upcoming: upcomingExams.length,
      past: pastExams.length,
      urgent: urgentExams.length,
      highPriority: highPriorityCount,
      today: todayExams.length,
    };
  }, [exams, currentTime]);

  // Enhanced filtered and sorted exams
  const filteredExams = useMemo(() => {
    let filtered = exams.filter(exam => {
      const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.syllabus.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || exam.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date.getTime() - b.date.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [exams, searchTerm, filterPriority, sortBy]);

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      syllabus: '',
      priority: 'medium',
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
      syllabusTracker: formData.syllabusTracker,
      priority: formData.priority,
      userId: user.uid,
      createdAt: editingExam?.createdAt || new Date(),
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
      syllabusTracker: exam.syllabusTracker,
    });
    setEditingExam(exam);
    setShowForm(true);
  };

  const handleDelete = async (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam? This will also delete all syllabus tracking data.')) {
      try {
        await deleteExam(examId);
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleUpdateSyllabus = async (examId: string, syllabusTracker: any) => {
    try {
      await updateExam(examId, { syllabusTracker });
    } catch (error) {
      console.error('Error updating syllabus:', error);
    }
  };

  const toggleCardExpansion = (examId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(examId)) {
      newExpanded.delete(examId);
    } else {
      newExpanded.add(examId);
    }
    setExpandedCards(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
        {/* Header Section with Enhanced Design */}
        <div className="relative mb-8 md:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Your Exams
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg">
                    Master your preparation with intelligent exam management
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                icon={Plus}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 w-full lg:w-auto"
              >
                <span className="hidden sm:inline">Add Exam</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <ExamStats stats={stats} />

        {/* Enhanced Form */}
        <ExamForm
          showForm={showForm}
          editingExam={editingExam}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {/* Enhanced Search and Filter Section */}
        <ExamFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterPriority={filterPriority}
          onFilterChange={setFilterPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
          examCount={exams.length}
        />

        {/* Content Display */}
        {filteredExams.length === 0 && exams.length > 0 ? (
          <Card className="p-8 md:p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <Search className="w-12 md:w-16 h-12 md:h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No exams found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base">
              Try adjusting your search terms or filters
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('all');
              }}
              variant="secondary"
            >
              Clear Filters
            </Button>
          </Card>
        ) : exams.length === 0 ? (
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Ready to ace your exams?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed text-sm md:text-base">
              Start your journey to exam success. Add your first exam and stay organized with deadlines, priorities, and structured syllabus tracking.
            </p>
            <Button 
              onClick={() => setShowForm(true)} 
              icon={Plus}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto"
            >
              Add Your First Exam
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredExams.map((exam, index) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                index={index}
                currentTime={currentTime}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateSyllabus={handleUpdateSyllabus}
                expandedCards={expandedCards}
                onToggleExpand={toggleCardExpansion}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-in-from-top-2 {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr 1fr;
          }
          
          .md\\:grid-cols-3 {
            grid-template-columns: 1fr 1fr;
          }
          
          .lg\\:grid-cols-5 {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .xl\\:grid-cols-3 {
            grid-template-columns: 1fr;
          }
        }

        /* Enhanced hover states */
        @media (hover: hover) {
          .hover\\:shadow-2xl:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          .hover\\:-translate-y-1:hover {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default Exams;
