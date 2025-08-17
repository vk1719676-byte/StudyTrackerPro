import React, { useState, useEffect } from 'react';
import { Clock, Calendar, BookOpen, Star, Filter } from 'lucide-react';
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

  const filteredSessions = sessions.filter(session => {
    const examMatch = !filterExam || session.examId === filterExam;
    const subjectMatch = !filterSubject || session.subject.toLowerCase().includes(filterSubject.toLowerCase());
    return examMatch && subjectMatch;
  });

  const uniqueSubjects = [...new Set(sessions.map(s => s.subject))];

  const totalStudyTime = filteredSessions.reduce((total, session) => total + session.duration, 0);
  const averageSession = filteredSessions.length > 0 ? totalStudyTime / filteredSessions.length : 0;
  const averageEfficiency = filteredSessions.length > 0 
    ? filteredSessions.reduce((total, session) => total + session.efficiency, 0) / filteredSessions.length 
    : 0;

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Study Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and analyze your study sessions and progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatDuration(totalStudyTime)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatDuration(Math.round(averageSession))}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Efficiency</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {averageEfficiency.toFixed(1)}/5
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Filters:</span>
            </div>
            
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {(filterExam || filterSubject) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterExam('');
                  setFilterSubject('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No study sessions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a study session from the dashboard to see your progress here
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="p-6" hover>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {session.subject}
                      </h3>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs font-medium">
                        {getExamName(session.examId)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Topic: {session.topic}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Efficiency</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= session.efficiency
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {session.notes && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Notes:</strong> {session.notes}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};