import React from 'react';
import { Search } from 'lucide-react';
import { Card } from './ui/Card';

interface ExamFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterPriority: 'all' | 'high' | 'medium' | 'low';
  onFilterChange: (filter: 'all' | 'high' | 'medium' | 'low') => void;
  sortBy: 'date' | 'priority' | 'name';
  onSortChange: (sort: 'date' | 'priority' | 'name') => void;
  examCount: number;
}

export const ExamFilters: React.FC<ExamFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterPriority,
  onFilterChange,
  sortBy,
  onSortChange,
  examCount
}) => {
  if (examCount === 0) return null;

  return (
    <Card className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>
    </Card>
  );
};
