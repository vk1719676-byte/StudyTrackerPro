import React, { useState, useEffect } from 'react';
import { Clock, Calendar, BookOpen, Star, Filter, TrendingUp, BarChart3, Target, Award, Search, SortDesc, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';

export const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filterExam, setFilterExam] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'efficiency'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribeSessions = getUserSessions(user.uid, (sessionData) => {
      setSessions(sessionData);
      setLoading(false);
    });

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
    });

    return () => {
      unsubscribeSessions();
      unsubscribeExams();
    };
  }, [user]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getExamName = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.name : 'Unknown Exam';
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Computer Science': 'bg-blue-500',
      'Mathematics': 'bg-green-500',
      'Physics': 'bg-purple-500',
      'Chemistry': 'bg-orange-500',
      'Biology': 'bg-red-500',
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-500';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 4) return 'text-green-600 dark:text-green-400';
    if (efficiency >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredAndSortedSessions = sessions
    .filter(session => {
      const examMatch = !filterExam || session.examId === filterExam;
      const subjectMatch = !filterSubject || session.subject.toLowerCase().includes(filterSubject.toLowerCase());
      const searchMatch = !searchTerm || 
        session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.notes && session.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      return examMatch && subjectMatch && searchMatch;
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'duration':
          aVal = a.duration;
          bVal = b.duration;
          break;
        case 'efficiency':
          aVal = a.efficiency;
          bVal = b.efficiency;
          break;
        default:
          return 0;
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  const uniqueSubjects = [...new Set(sessions.map(s => s.subject))];
  const totalStudyTime = filteredAndSortedSessions.reduce((total, session) => total + session.duration, 0);
  const averageSession = filteredAndSortedSessions.length > 0 ? totalStudyTime / filteredAndSortedSessions.length : 0;
  const averageEfficiency = filteredAndSortedSessions.length > 0 
    ? filteredAndSortedSessions.reduce((total, session) => total + session.efficiency, 0) / filteredAndSortedSessions.length 
    : 0;

  const totalSessions = filteredAndSortedSessions.length;
  const highEfficiencySessions = filteredAndSortedSessions.filter(s => s.efficiency >= 4).length;
  const thisWeekSessions = filteredAndSortedSessions.filter(s => {
    const sessionDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your study sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Study Sessions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Track and analyze your learning journey
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Eye className="w-4 h-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Study Time</p>
                <p className="text-3xl font-bold">{formatDuration(totalStudyTime)}</p>
                <p className="text-purple-200 text-xs mt-1">
                  {totalSessions} sessions
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Avg. Session</p>
                <p className="text-3xl font-bold">{formatDuration(Math.round(averageSession))}</p>
                <p className="text-blue-200 text-xs mt-1">
                  {thisWeekSessions} this week
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm mb-1">Avg. Efficiency</p>
                <p className="text-3xl font-bold">{averageEfficiency.toFixed(1)}/5</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 mr-1 ${
                        star <= Math.round(averageEfficiency)
                          ? 'text-yellow-200 fill-current'
                          : 'text-yellow-300/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">High Quality</p>
                <p className="text-3xl font-bold">{highEfficiencySessions}</p>
                <p className="text-green-200 text-xs mt-1">
                  {totalSessions > 0 ? Math.round((highEfficiencySessions / totalSessions) * 100) : 0}% of sessions
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="p-6 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sessions, topics, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Exams</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'date' | 'duration' | 'efficiency');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="duration-desc">Longest First</option>
                <option value="duration-asc">Shortest First</option>
                <option value="efficiency-desc">Best Efficiency</option>
                <option value="efficiency-asc">Lowest Efficiency</option>
              </select>

              {(filterExam || filterSubject || searchTerm) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterExam('');
                    setFilterSubject('');
                    setSearchTerm('');
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Sessions Display */}
        {filteredAndSortedSessions.length === 0 ? (
          <Card className="p-12 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {sessions.length === 0 ? 'No study sessions yet' : 'No sessions match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {sessions.length === 0 
                  ? 'Start your learning journey by creating your first study session'
                  : 'Try adjusting your filters to see more results'
                }
              </p>
              {(filterExam || filterSubject || searchTerm) && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setFilterExam('');
                    setFilterSubject('');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
            {filteredAndSortedSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" hover>
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getSubjectColor(session.subject)}`}></div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {session.subject}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.topic}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-700">
                      {getExamName(session.examId)}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatDuration(session.duration)}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Target className="w-5 h-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Efficiency</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-sm font-bold ${getEfficiencyColor(session.efficiency)}`}>
                          {session.efficiency}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Efficiency Stars */}
                  <div className="flex items-center justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 mx-0.5 transition-colors duration-200 ${
                          star <= session.efficiency
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Notes */}
                  {session.notes && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="font-semibold text-blue-800 dark:text-blue-400">Notes:</span> {session.notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
