import React from 'react';
import { BookOpen, Calendar, AlertTriangle, Target, Timer } from 'lucide-react';
import { Card } from './ui/Card';

interface ExamStatsProps {
  stats: {
    total: number;
    upcoming: number;
    past: number;
    urgent: number;
    highPriority: number;
    today: number;
  };
}

export const ExamStats: React.FC<ExamStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Exams',
      value: stats.total,
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-100'
    },
    {
      label: 'Upcoming',
      value: stats.upcoming,
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      textColor: 'text-green-100'
    },
    {
      label: 'Urgent',
      value: stats.urgent,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-pink-500',
      textColor: 'text-red-100'
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: Target,
      gradient: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-100'
    },
    {
      label: 'Today',
      value: stats.today,
      icon: Timer,
      gradient: 'from-teal-500 to-cyan-500',
      textColor: 'text-teal-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.label}
            className={`p-4 bg-gradient-to-r ${stat.gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0">
                <p className={`${stat.textColor} text-xs font-medium truncate`}>
                  {stat.label}
                </p>
                <p className="text-xl font-bold">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
