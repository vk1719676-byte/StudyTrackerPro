import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Star, Clock, Tag, BookOpen, Brain, Calculator, HelpCircle, FileText, Zap, Flame, TrendingUp, Share, Download, MoreVertical, Edit, Trash2, Eye, Copy, ArrowUpRight, Sparkles } from 'lucide-react';
import { StudyNote, NotesFilter } from '../../types/notes';
import { Exam } from '../../types';

interface StudyNotesPanelProps {
  notes: StudyNote[];
  exams: Exam[];
  onCreateNote: () => void;
  onEditNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
  className?: string;
}

const categoryConfig = {
  lecture: { icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', gradient: 'from-blue-500 to-blue-600' },
  concept: { icon: Brain, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', gradient: 'from-purple-500 to-purple-600' },
  formula: { icon: Calculator, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', gradient: 'from-green-500 to-green-600' },
  question: { icon: HelpCircle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', gradient: 'from-orange-500 to-orange-600' },
  summary: { icon: FileText, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', gradient: 'from-indigo-500 to-indigo-600' },
  flashcard: { icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', gradient: 'from-yellow-500 to-yellow-600' },
  research: { icon: TrendingUp, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30', gradient: 'from-pink-500 to-pink-600' }
};

const priorityConfig = {
  low: { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', dot: 'bg-gray-400' },
  medium: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', dot: 'bg-blue-500' },
  high: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', dot: 'bg-orange-500' },
  urgent: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', dot: 'bg-red-500' }
};

export const StudyNotesPanel: React.FC<StudyNotesPanelProps> = ({
  notes,
  exams,
  onCreateNote,
  onEditNote,
  onDeleteNote,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<NotesFilter>({});
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'category' | 'alphabetical'>('recent');

  // Get unique subjects and tags for filter options
  const allSubjects = useMemo(() => 
    Array.from(new Set(notes.map(note => note.subject))).sort(), 
    [notes]
  );
  
  const allTags = useMemo(() => 
    Array.from(new Set(notes.flatMap(note => note.tags))).sort(), 
    [notes]
  );

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply filters
    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search) ||
        note.subject.toLowerCase().includes(search) ||
        note.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filter.subjects?.length) {
      filtered = filtered.filter(note => filter.subjects!.includes(note.subject));
    }

    if (filter.categories?.length) {
      filtered = filtered.filter(note => filter.categories!.includes(note.category));
    }

    if (filter.tags?.length) {
      filtered = filtered.filter(note => 
        filter.tags!.some(tag => note.tags.includes(tag))
      );
    }

    if (filter.priority?.length) {
      filtered = filtered.filter(note => filter.priority!.includes(note.priority));
    }

    if (filter.examId) {
      filtered = filtered.filter(note => note.examId === filter.examId);
    }

    // Apply sorting
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    return filtered;
  }, [notes, filter, sortBy]);

  // Analytics
  const analytics = useMemo(() => {
    const totalNotes = notes.length;
    const byCategory = notes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentNotes = notes.filter(note => {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return new Date(note.createdAt) > dayAgo;
    }).length;

    const highPriorityNotes = notes.filter(note => 
      note.priority === 'high' || note.priority === 'urgent'
    ).length;

    return {
      totalNotes,
      byCategory,
      recentNotes,
      highPriorityNotes
    };
  }, [notes]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header with Analytics */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Study Notes</h2>
            <p className="text-white/80 text-lg">Your knowledge repository</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{analytics.totalNotes}</div>
              <div className="text-sm text-white/80">Total Notes</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{analytics.recentNotes}</div>
              <div className="text-sm text-white/80">Today</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{analytics.highPriorityNotes}</div>
              <div className="text-sm text-white/80">Priority</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{Object.keys(analytics.byCategory).length}</div>
              <div className="text-sm text-white/80">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes, content, tags..."
              value={filter.search || ''}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value || undefined }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filter.subjects?.[0] || ''}
              onChange={(e) => setFilter(prev => ({ 
                ...prev, 
                subjects: e.target.value ? [e.target.value] : undefined 
              }))}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="recent">Recent</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
              <option value="alphabetical">A-Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onCreateNote}
              className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              New Note
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filter.search || filter.subjects?.length || filter.categories?.length || filter.tags?.length) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {filter.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                  Search: "{filter.search}"
                  <button
                    onClick={() => setFilter(prev => ({ ...prev, search: undefined }))}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filter.subjects?.map(subject => (
                <span key={subject} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  Subject: {subject}
                  <button
                    onClick={() => setFilter(prev => ({ 
                      ...prev, 
                      subjects: prev.subjects?.filter(s => s !== subject) 
                    }))}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              ))}

              <button
                onClick={() => setFilter({})}
                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Display */}
      {filteredNotes.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredNotes.map((note) => {
            const categoryInfo = categoryConfig[note.category];
            const priorityInfo = priorityConfig[note.priority];
            const Icon = categoryInfo.icon;
            const linkedExam = exams.find(e => e.id === note.examId);
            
            if (viewMode === 'list') {
              return (
                <div
                  key={note.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-3 ${categoryInfo.bg} rounded-xl flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${categoryInfo.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                            {note.title}
                          </h3>
                          <div className={`w-3 h-3 ${priorityInfo.dot} rounded-full flex-shrink-0`}></div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {truncateContent(note.content, 120)}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-3 py-1 ${priorityInfo.bg} ${priorityInfo.color} rounded-full font-medium capitalize`}>
                            {note.priority}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {note.subject}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(new Date(note.updatedAt))}
                          </span>
                          {linkedExam && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              📚 {linkedExam.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                      <button
                        onClick={() => onEditNote(note)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                        <Share className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={note.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Priority stripe */}
                <div className={`h-1 bg-gradient-to-r ${categoryInfo.gradient}`}></div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${categoryInfo.bg} rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${categoryInfo.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${priorityInfo.dot} rounded-full`}></div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {note.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {truncateContent(note.content)}
                    </p>
                  </div>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
                          +{note.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {note.subject}
                      </span>
                      {linkedExam && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          📚 {linkedExam.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(new Date(note.updatedAt))}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onEditNote(note)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold rounded-xl transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200">
                      <Share className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all duration-200">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-6 inline-block">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {filter.search || filter.subjects?.length || filter.categories?.length ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {filter.search || filter.subjects?.length || filter.categories?.length 
                ? 'Try adjusting your search criteria or filters.' 
                : 'Start capturing your study insights and ideas.'}
            </p>
            <button
              onClick={onCreateNote}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              Create Your First Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
