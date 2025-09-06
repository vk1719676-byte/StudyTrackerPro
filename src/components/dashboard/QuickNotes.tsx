import React, { useState, useEffect, useRef } from 'react';
import { StickyNote, Plus, Edit3, Trash2, Save, X, Lightbulb, BookOpen, AlertCircle } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  color: string;
  bgGradient: string;
  createdAt: string;
  updatedAt: string;
}

const noteColors = [
  {
    color: 'text-yellow-700 dark:text-yellow-300',
    bgGradient: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 dark:from-yellow-900/30 dark:via-amber-900/20 dark:to-orange-900/30',
    border: 'border-yellow-200 dark:border-yellow-700'
  },
  {
    color: 'text-blue-700 dark:text-blue-300',
    bgGradient: 'bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 dark:from-blue-900/30 dark:via-sky-900/20 dark:to-cyan-900/30',
    border: 'border-blue-200 dark:border-blue-700'
  },
  {
    color: 'text-green-700 dark:text-green-300',
    bgGradient: 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30',
    border: 'border-green-200 dark:border-green-700'
  },
  {
    color: 'text-purple-700 dark:text-purple-300',
    bgGradient: 'bg-gradient-to-br from-purple-100 via-violet-50 to-pink-100 dark:from-purple-900/30 dark:via-violet-900/20 dark:to-pink-900/30',
    border: 'border-purple-200 dark:border-purple-700'
  }
];

interface QuickNotesProps {
  className?: string;
}

export const QuickNotes: React.FC<QuickNotesProps> = ({ className = '' }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('quickNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    } else {
      // Add a sample note
      const sampleNote: Note = {
        id: '1',
        content: 'Remember to review calculus derivatives before tomorrow\'s exam!',
        color: noteColors[0].color,
        bgGradient: noteColors[0].bgGradient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([sampleNote]);
      localStorage.setItem('quickNotes', JSON.stringify([sampleNote]));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length >= 0) {
      localStorage.setItem('quickNotes', JSON.stringify(notes));
    }
  }, [notes]);

  // Auto-focus textarea when adding new note
  useEffect(() => {
    if (showAddNote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showAddNote]);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const colorIndex = notes.length % noteColors.length;
    const selectedColor = noteColors[colorIndex];

    const note: Note = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      color: selectedColor.color,
      bgGradient: selectedColor.bgGradient,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([note, ...notes]);
    setNewNoteContent('');
    setShowAddNote(false);
  };

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNote(noteId);
    setEditContent(content);
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editContent.trim()) return;

    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, content: editContent.trim(), updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
    setEditContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/20 hover:border-gray-300/80 dark:hover:border-gray-600/80 transition-all duration-500 ${className}`}>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30">
              <StickyNote className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1 drop-shadow-sm">Quick Notes</h2>
              <p className="text-white/80 font-medium text-sm">Capture your study insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/30">
            <Lightbulb className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-bold text-sm">{notes.length} notes</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Add Note Button */}
        {!showAddNote && (
          <button
            onClick={() => setShowAddNote(true)}
            className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group mb-6"
          >
            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-lg">Add Quick Note</span>
          </button>
        )}

        {/* Add Note Form */}
        {showAddNote && (
          <div className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200/60 dark:border-orange-700/60">
            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100">New Note</h3>
            </div>
            <textarea
              ref={textareaRef}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note here... (study reminders, key insights, important dates)"
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleAddNote();
                }
              }}
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Press Ctrl+Enter to save quickly
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddNote(false);
                    setNewNoteContent('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className={`group relative ${note.bgGradient} rounded-2xl p-5 border-2 ${noteColors[index % noteColors.length].border} hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {editingNote === note.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none min-h-[80px]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingNote(null);
                          setEditContent('');
                        }}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                      <button
                        onClick={() => handleEditNote(note.id, note.content)}
                        className="p-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="pr-16 mb-4">
                      <p className={`${note.color} font-medium leading-relaxed whitespace-pre-wrap`}>
                        {note.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-semibold">Study Note</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-3 py-1 rounded-full">
                        {formatTimeAgo(note.updatedAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : !showAddNote && (
          <div className="text-center py-12">
            <div className="p-8 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-yellow-900/30 rounded-full mb-6 inline-block shadow-xl">
              <StickyNote className="w-16 h-16 text-orange-600 dark:text-orange-400 mx-auto" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-gray-100 text-2xl mb-3">
              No Notes Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Start capturing your study insights,<br />
              important reminders, and key concepts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
