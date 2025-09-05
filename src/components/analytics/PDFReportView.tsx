import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Target, Star, Activity, Calendar, TrendingUp, BookOpen, Award, Brain } from 'lucide-react';
import { StudySession, Exam } from '../../types';
import { format } from 'date-fns';

interface PDFReportViewProps {
  sessions: StudySession[];
  exams: Exam[];
  totalStudyTime: number;
  averageSessionTime: number;
  averageEfficiency: number;
  totalSessions: number;
  weeklyData: any[];
  dailyData: any[];
  subjectData: any[];
  efficiencyData: any[];
}

export const PDFReportView: React.FC<PDFReportViewProps> = ({
  sessions,
  exams,
  totalStudyTime,
  averageSessionTime,
  averageEfficiency,
  totalSessions,
  weeklyData,
  dailyData,
  subjectData,
  efficiencyData
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

  const generateDate = () => format(new Date(), 'MMMM dd, yyyy');
  const generateTime = () => format(new Date(), 'HH:mm');

  return (
    <div className="pdf-report-content bg-white text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="pdf-header text-center mb-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Analytics Report</h1>
        <div className="text-lg text-gray-600 mb-4">
          <p>Generated on {generateDate()} at {generateTime()}</p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            <span className="text-indigo-600 font-semibold">Comprehensive Learning Analytics</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="pdf-section mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Award className="w-7 h-7 text-indigo-600" />
          Executive Summary
        </h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-violet-100 rounded-lg">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Study Time</h3>
                <p className="text-2xl font-bold text-violet-600">{formatTime(totalStudyTime)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Sessions</h3>
                <p className="text-2xl font-bold text-blue-600">{totalSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Average Session</h3>
                <p className="text-2xl font-bold text-green-600">{formatTime(averageSessionTime)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Average Efficiency</h3>
                <p className="text-2xl font-bold text-yellow-600">{averageEfficiency.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="pdf-section mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-indigo-600" />
          Weekly Study Hours Trend
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Performance Chart */}
      <div className="pdf-section mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Activity className="w-7 h-7 text-indigo-600" />
          Daily Performance Trend
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis yAxisId="left" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="hours" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Study Hours"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Efficiency Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="pdf-section mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          Study Time by Subject
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {subjectData.slice(0, 8).map((subject, index) => {
            const maxHours = Math.max(...subjectData.map(s => s.hours));
            const percentage = (subject.hours / maxHours) * 100;
            
            return (
              <div key={subject.subject} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-900 font-semibold">
                      {subject.subject}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 font-bold">
                      {subject.hours}h
                    </div>
                    <div className="text-sm text-gray-500">
                      {subject.sessions} sessions
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Efficiency Distribution */}
      <div className="pdf-section mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Star className="w-7 h-7 text-indigo-600" />
          Efficiency Ratings Distribution
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {efficiencyData.map((entry, index) => (
              <div key={entry.rating} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {entry.rating}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {entry.count} sessions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Session Data */}
      <div className="pdf-section mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Calendar className="w-7 h-7 text-indigo-600" />
          Recent Study Sessions
        </h2>
        <div className="overflow-hidden">
          <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 border-b font-semibold text-gray-900">Date</th>
                <th className="text-left p-3 border-b font-semibold text-gray-900">Subject</th>
                <th className="text-left p-3 border-b font-semibold text-gray-900">Duration</th>
                <th className="text-left p-3 border-b font-semibold text-gray-900">Efficiency</th>
                <th className="text-left p-3 border-b font-semibold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(-15).reverse().map((session, index) => (
                <tr key={session.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 border-b text-sm">
                    {format(new Date(session.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-3 border-b text-sm font-medium">{session.subject}</td>
                  <td className="p-3 border-b text-sm">{formatTime(session.duration)}</td>
                  <td className="p-3 border-b text-sm">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: session.efficiency }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-1">{session.efficiency}/5</span>
                    </div>
                  </td>
                  <td className="p-3 border-b text-sm text-gray-600">
                    {session.notes || 'No notes'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="pdf-footer mt-12 pt-6 border-t-2 border-gray-200 text-center text-gray-500">
        <p className="text-sm">
          This report was generated automatically from your study tracking data.
          <br />
          For more detailed analytics and insights, visit your dashboard.
        </p>
        <p className="text-xs mt-2">
          Report generated on {generateDate()} • Total sessions analyzed: {totalSessions}
        </p>
      </div>
    </div>
  );
};
