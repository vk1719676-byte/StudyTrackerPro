import React from 'react';
import { Award, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Subject } from '../../types';

interface SyllabusProgressProps {
  subjects: Subject[];
}

export const SyllabusProgress: React.FC<SyllabusProgressProps> = ({ subjects }) => {
  const stats = React.useMemo(() => {
    const totalSubjects = subjects.length;
    const totalChapters = subjects.reduce((sum, subject) => sum + subject.chapters.length, 0);
    const completedChapters = subjects.reduce(
      (sum, subject) => sum + subject.chapters.filter(chapter => chapter.completed).length,
      0
    );
    const completedSubjects = subjects.filter(subject => 
      subject.chapters.length > 0 && subject.chapters.every(chapter => chapter.completed)
    ).length;
    
    const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    const subjectProgress = totalSubjects > 0 ? (completedSubjects / totalSubjects) * 100 : 0;

    return {
      totalSubjects,
      totalChapters,
      completedChapters,
      completedSubjects,
      overallProgress,
      subjectProgress,
    };
  }, [subjects]);

  if (subjects.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <div>
            <p className="text-blue-100 text-xs font-medium">Overall Progress</p>
            <p className="text-xl font-bold">{Math.round(stats.overallProgress)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="text-green-100 text-xs font-medium">Completed</p>
            <p className="text-xl font-bold">{stats.completedChapters}/{stats.totalChapters}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          <div>
            <p className="text-purple-100 text-xs font-medium">Subjects Done</p>
            <p className="text-xl font-bold">{stats.completedSubjects}/{stats.totalSubjects}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <div>
            <p className="text-orange-100 text-xs font-medium">Subject Progress</p>
            <p className="text-xl font-bold">{Math.round(stats.subjectProgress)}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
