import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Camera, FileText, Brain, Lightbulb, Calculator, HelpCircle, BookOpen, Zap, Send, X, Tag, AlertCircle } from 'lucide-react';
import { StudyNote, NoteTemplate } from '../../types/notes';
import { Exam } from '../../types';

interface QuickNoteInputProps {
  onCreateNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  exams: Exam[];
  className?: string;
}

const noteTemplates: NoteTemplate[] = [
  {
    id: 'lecture',
    name: 'Lecture Notes',
    category: 'lecture',
    template: '# Lecture: [Topic]\n\n## Key Points\n- \n\n## Questions\n- \n\n## Action Items\n- ',
    icon: 'BookOpen',
    description: 'Structured template for lecture notes'
  },
  {
    id: 'concept',
    name: 'Concept Map',
    category: 'concept',
    template: '# Concept: [Name]\n\n## Definition\n\n## Key Characteristics\n- \n\n## Related Concepts\n- \n\n## Examples\n- ',
    icon: 'Brain',
    description: 'Organize complex concepts and relationships'
  },
  {
    id: 'formula',
    name: 'Formula & Equations',
    category: 'formula',
    template: '# Formula: [Name]\n\n## Formula\n```\n[Write formula here]\n```\n\n## Variables\n- \n\n## Applications\n- \n\n## Examples\n- ',
    icon: 'Calculator',
    description: 'Mathematical formulas and equations'
  },
  {
    id: 'question',
    name: 'Study Questions',
    category: 'question',
    template: '# Study Questions: [Topic]\n\n## Questions\n1. \n2. \n3. \n\n## Answers\n1. \n2. \n3. ',
    icon: 'HelpCircle',
    description: 'Practice questions and answers'
  },
  {
    id: 'summary',
    name: 'Summary',
    category: 'summary',
    template: '# Summary: [Topic]\n\n## Overview\n\n## Key Points\n- \n\n## Important Details\n- \n\n## Takeaways\n- ',
    icon: 'FileText',
    description: 'Summarize important information'
  },
  {
    id: 'flashcard',
    name: 'Flashcard',
    category: 'flashcard',
    template: '# Flashcard\n\n## Front\n[Question or term]\n\n## Back\n[Answer or definition]\n\n## Hints\n- ',
    icon: 'Zap',
    description: 'Quick flashcard format'
  }
];

const iconMap = {
  BookOpen,
  Brain,
  Calculator,
  HelpCircle,
  FileText,
  Zap
};

export const QuickNoteInput: React.FC<QuickNoteInputProps> = ({ 
  onCreateNote, 
  exams, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [priority, setPriority] = useState<StudyNote['priority']>('medium');
  const [category, setCategory] = useState<StudyNote['category']>('concept');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      recognition.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setContent(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startVoiceInput = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const applyTemplate = (template: NoteTemplate) => {
    setContent(template.template);
    setCategory(template.category);
    setTitle(template.name);
    setShowTemplates(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!content.trim() || !title.trim()) return;

    const note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
      title: title.trim(),
      content: content.trim(),
      subject: subject || 'General',
      tags,
      category,
      priority,
      examId: selectedExam || undefined,
    };

    onCreateNote(note);
    
    // Reset form
    setContent('');
    setTitle('');
    setSubject('');
    setTags([]);
    setPriority('medium');
    setCategory('concept');
    setSelectedExam('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!isExpanded) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-2 border-dashed border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex flex-col items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Quick Study Note
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Capture ideas, concepts, and insights instantly
              </p>
            </div>
          </div>
        </button>

        {/* Floating Templates Preview */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex gap-2">
            {noteTemplates.slice(0, 3).map((template) => {
              const IconComponent = iconMap[template.icon as keyof typeof iconMap];
              return (
                <div
                  key={template.id}
                  className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 dark:border-gray-700/50"
                >
                  <IconComponent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create Study Note</h3>
                <p className="text-white/80 text-sm">Capture your thoughts and insights</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Title and Subject Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics, Physics..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Templates */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Templates
              </label>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
              >
                {showTemplates ? 'Hide' : 'Show All'}
              </button>
            </div>
            
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 transition-all duration-300 ${showTemplates ? 'max-h-96' : 'max-h-20 overflow-hidden'}`}>
              {noteTemplates.map((template) => {
                const IconComponent = iconMap[template.icon as keyof typeof iconMap];
                return (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="group p-4 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 text-left"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 rounded-lg transition-colors duration-200">
                        <IconComponent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Content
              </label>
              <div className="flex gap-2">
                {recognition.current && (
                  <button
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                    title={isListening ? 'Stop voice input' : 'Start voice input'}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all duration-200"
                  title="Add image"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start writing your note... (Ctrl+Enter to save)"
                className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none font-mono"
              />
              {isListening && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Listening...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StudyNote['category'])}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="concept">Concept</option>
                <option value="lecture">Lecture</option>
                <option value="formula">Formula</option>
                <option value="question">Question</option>
                <option value="summary">Summary</option>
                <option value="flashcard">Flashcard</option>
                <option value="research">Research</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as StudyNote['priority'])}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Linked Exam */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Link to Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">No exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} - {exam.subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200"
              >
                Add
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span>Ctrl+Enter to save quickly</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || !title.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
