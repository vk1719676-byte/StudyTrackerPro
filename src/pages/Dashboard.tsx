import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, X, Lightbulb, Rocket, Plus, ArrowRight, TrendingDown, Users, Settings, Send, MessageCircle, Loader, MapPin, PlayCircle, PauseCircle, SkipForward } from 'lucide-react';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { StudyTimer } from '../components/dashboard/StudyTimer';
import { Card } from '../components/ui/Card';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { EnhancedTextBanner } from '../components/banner/EnhancedTextBanner';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

// AI Question Interface
interface AIQuestion {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timestamp: Date;
  helpful: boolean | null;
}

// Study Plan Interface
interface StudyPlanItem {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  deadline: Date;
  completed: boolean;
  aiRecommended: boolean;
}

// Modern hero themes
const heroThemes = [
  {
    name: 'ocean',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    accent: 'from-blue-400 to-cyan-400',
    icon: Sparkles,
    particles: '✨',
    greeting: 'Ready to dive deep into learning?'
  },
  {
    name: 'forest',
    gradient: 'from-emerald-600 via-green-700 to-teal-800',
    accent: 'from-emerald-400 to-green-400',
    icon: Target,
    particles: '🎯',
    greeting: 'Let\'s grow your knowledge today!'
  },
  {
    name: 'sunset',
    gradient: 'from-orange-600 via-red-600 to-pink-700',
    accent: 'from-orange-400 to-red-400',
    icon: Zap,
    particles: '⚡',
    greeting: 'Energize your learning journey!'
  },
  {
    name: 'cosmic',
    gradient: 'from-purple-600 via-indigo-700 to-blue-800',
    accent: 'from-purple-400 to-pink-400',
    icon: Star,
    particles: '🌟',
    greeting: 'Reach for the stars with knowledge!'
  }
];

// Enhanced Card component with modern design
const ModernCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  gradient?: boolean;
}> = ({ children, className = '', hover = false, gradient = false }) => (
  <div className={`
    group relative overflow-hidden
    ${gradient 
      ? 'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800' 
      : 'bg-white dark:bg-gray-800'
    }
    rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-700/60
    ${hover ? 'hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/20 hover:border-gray-300/80 dark:hover:border-gray-600/80 hover:-translate-y-1 transition-all duration-500 cursor-pointer' : ''}
    transition-all duration-300
    ${className}
  `}>
    {children}
  </div>
);

// Modern stat card with improved design
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  change?: { value: number; type: 'increase' | 'decrease' };
  color: string;
  bgGradient: string;
}> = ({ icon: Icon, label, value, change, color, bgGradient }) => (
  <ModernCard hover className="p-6 h-full">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 ${bgGradient} rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-500`}>
        <Icon className={`w-6 h-6 ${color} drop-shadow-sm`} />
      </div>
      {change && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${
          change.type === 'increase' 
            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
        }`}>
          {change.type === 'increase' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change.value)}%
        </div>
      )}
    </div>
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </ModernCard>
);

// AI Question Solver Component
const AIQuestionSolver: React.FC<{
  sessions: StudySession[];
  exams: Exam[];
}> = ({ sessions, exams }) => {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<AIQuestion[]>([
    {
      id: '1',
      question: 'Explain the concept of derivatives in calculus',
      answer: 'A derivative represents the rate of change of a function with respect to one of its variables. It measures how much a function changes as its input changes. Geometrically, the derivative at a point is the slope of the tangent line to the function at that point. For example, if f(x) = x², then f\'(x) = 2x, meaning the rate of change at any point x is 2x.',
      subject: 'Mathematics',
      difficulty: 'medium',
      timestamp: new Date(Date.now() - 3600000),
      helpful: true
    },
    {
      id: '2',
      question: 'What is the difference between mitosis and meiosis?',
      answer: 'Mitosis and meiosis are both types of cell division, but serve different purposes:\n\nMitosis:\n• Produces 2 identical diploid cells\n• Used for growth and repair\n• Maintains chromosome number\n• No genetic recombination\n\nMeiosis:\n• Produces 4 genetically diverse haploid gametes\n• Used for sexual reproduction\n• Reduces chromosome number by half\n• Involves crossing over and genetic recombination',
      subject: 'Biology',
      difficulty: 'medium',
      timestamp: new Date(Date.now() - 7200000),
      helpful: null
    }
  ]);

  const getUniqueSubjects = () => {
    const sessionSubjects = [...new Set(sessions.map(s => s.subject))];
    const examSubjects = [...new Set(exams.map(e => e.subject))];
    return [...new Set([...sessionSubjects, ...examSubjects])].sort();
  };

  const simulateAIResponse = (question: string, subject: string): string => {
    // Simulate different types of responses based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('solve') || lowerQuestion.includes('calculate') || lowerQuestion.includes('find')) {
      return `To solve this ${subject.toLowerCase()} problem, let me break it down step by step:\n\n1. First, identify the given information and what we need to find\n2. Choose the appropriate formula or method\n3. Substitute the values and solve\n4. Check if the answer makes sense\n\nFor specific numerical problems, please provide the exact values and I'll walk through the complete solution with detailed calculations.`;
    } else if (lowerQuestion.includes('explain') || lowerQuestion.includes('what is') || lowerQuestion.includes('define')) {
      return `Great question about ${subject.toLowerCase()}! Let me explain this concept clearly:\n\nThis is a fundamental topic that builds on several key principles. The main idea is that understanding this concept requires breaking it down into smaller, manageable parts.\n\nKey points to remember:\n• Definition and core principles\n• How it relates to other concepts\n• Practical applications\n• Common misconceptions to avoid\n\nWould you like me to elaborate on any specific aspect of this topic?`;
    } else if (lowerQuestion.includes('difference') || lowerQuestion.includes('compare') || lowerQuestion.includes('vs')) {
      return `Here's a comprehensive comparison to help you understand the differences:\n\n**Key Distinctions:**\n\n1. **Purpose & Function:**\n   - First concept: [Primary role and characteristics]\n   - Second concept: [Primary role and characteristics]\n\n2. **Applications:**\n   - Different use cases and contexts\n   - When to use each approach\n\n3. **Important Notes:**\n   - Common similarities that might cause confusion\n   - Memory tips to distinguish between them\n\nThis comparison should help clarify the main differences in your ${subject.toLowerCase()} studies!`;
    } else {
      return `I'd be happy to help you with this ${subject.toLowerCase()} question!\n\nBased on your query, this involves several important concepts that are essential for mastering this subject. Let me provide a comprehensive answer:\n\nThe key to understanding this topic is recognizing the underlying principles and how they connect to what you've already learned.\n\n**Main Points:**\n• Core concept explanation\n• Step-by-step breakdown\n• Real-world applications\n• Tips for remembering\n\nWould you like me to dive deeper into any particular aspect of this topic?`;
    }
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newQuestion: AIQuestion = {
      id: Date.now().toString(),
      question: question.trim(),
      answer: simulateAIResponse(question, subject || 'General'),
      subject: subject || 'General',
      difficulty: question.length > 100 ? 'hard' : question.length > 50 ? 'medium' : 'easy',
      timestamp: new Date(),
      helpful: null
    };
    
    setQuestions(prev => [newQuestion, ...prev]);
    setQuestion('');
    setLoading(false);
  };

  const handleHelpfulVote = (questionId: string, helpful: boolean) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, helpful } : q
    ));
  };

  return (
    <ModernCard className="p-8 h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Question Solver</h2>
          <p className="text-gray-600 dark:text-gray-400">Get instant help with any study question</p>
        </div>
        <div className="ml-auto bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          AI Active
        </div>
      </div>

      {/* Question Input */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-3xl p-6 mb-8 border border-gray-200/60 dark:border-gray-700/60">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-gray-300/60 dark:border-gray-600/60 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          >
            <option value="">All Subjects</option>
            {getUniqueSubjects().map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any question about your studies... For example: 'Explain photosynthesis' or 'How do I solve quadratic equations?'"
            className="w-full p-4 pr-16 rounded-2xl border border-gray-300/60 dark:border-gray-600/60 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            disabled={loading}
          />
          <button
            onClick={handleSubmitQuestion}
            disabled={!question.trim() || loading}
            className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Questions History */}
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {questions.map((q) => (
          <div key={q.id} className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-700/30 dark:to-gray-800/50 rounded-3xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                  <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{q.subject}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      q.difficulty === 'easy' ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' :
                      q.difficulty === 'medium' ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' :
                      'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {q.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">Q: {q.question}</h4>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {q.answer}
                </pre>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleHelpfulVote(q.id, true)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      q.helpful === true 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 dark:bg-gray-700/50 dark:text-gray-400'
                    }`}
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleHelpfulVote(q.id, false)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      q.helpful === false 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:bg-gray-700/50 dark:text-gray-400'
                    }`}
                  >
                    👎
                  </button>
                </div>
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold text-sm bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-300">
                Ask Follow-up
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModernCard>
  );
};

// Smart Study Planner Component
const SmartStudyPlanner: React.FC<{
  sessions: StudySession[];
  exams: Exam[];
}> = ({ sessions, exams }) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Generate AI-powered study plan
  const generateStudyPlan = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI processing

    const subjects = [...new Set([...sessions.map(s => s.subject), ...exams.map(e => e.subject)])];
    const now = new Date();
    
    // Analyze past performance
    const subjectPerformance = subjects.map(subject => {
      const subjectSessions = sessions.filter(s => s.subject === subject);
      const avgEfficiency = subjectSessions.length > 0 
        ? subjectSessions.reduce((sum, s) => sum + s.efficiency, 0) / subjectSessions.length 
        : 0;
      
      return { subject, avgEfficiency, sessionCount: subjectSessions.length };
    });

    // Create study plan items
    const planItems: StudyPlanItem[] = [];
    let idCounter = 1;

    // Prioritize subjects with upcoming exams
    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      const daysUntil = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 0 && daysUntil <= 30) {
        const performance = subjectPerformance.find(p => p.subject === exam.subject);
        const priority = daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low';
        
        // Generate study topics based on exam proximity and past performance
        const topics = [
          'Review fundamentals and key concepts',
          'Practice problems and exercises',
          'Create summary notes and flashcards',
          'Take practice tests',
          'Review mistakes and weak areas'
        ];

        topics.forEach((topic, index) => {
          const studyDate = new Date(now);
          studyDate.setDate(studyDate.getDate() + Math.floor(daysUntil * (index + 1) / topics.length));
          
          planItems.push({
            id: (idCounter++).toString(),
            subject: exam.subject,
            topic,
            duration: performance && performance.avgEfficiency < 3 ? 45 : 30,
            priority: priority as 'high' | 'medium' | 'low',
            deadline: studyDate,
            completed: false,
            aiRecommended: true
          });
        });
      }
    });

    // Add general improvement recommendations
    subjectPerformance
      .filter(p => p.avgEfficiency < 3.5)
      .forEach(p => {
        planItems.push({
          id: (idCounter++).toString(),
          subject: p.subject,
          topic: 'Focus on improving study efficiency',
          duration: 25,
          priority: 'medium',
          deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          completed: false,
          aiRecommended: true
        });
      });

    setStudyPlan(planItems.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.deadline.getTime() - b.deadline.getTime();
    }));
    
    setGenerating(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setStudyPlan(prev => prev.map(item => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    ));
  };

  const getWeeklyPlan = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + (currentWeek * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return studyPlan.filter(item => 
      item.deadline >= weekStart && item.deadline <= weekEnd
    );
  };

  useEffect(() => {
    if (sessions.length > 0 && exams.length > 0) {
      generateStudyPlan();
    }
  }, [sessions, exams]);

  const weeklyPlan = getWeeklyPlan();
  const completedTasks = weeklyPlan.filter(item => item.completed).length;
  const totalTasks = weeklyPlan.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ModernCard className="p-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl shadow-xl">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Smart Study Planner</h2>
            <p className="text-gray-600 dark:text-gray-400">AI-generated personalized study schedule</p>
          </div>
        </div>
        <button
          onClick={generateStudyPlan}
          disabled={generating}
          className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {generating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Regenerate Plan
            </>
          )}
        </button>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl p-6 mb-8 border border-emerald-200/50 dark:border-emerald-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">
              This Week's Progress
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300 text-sm">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-emerald-900/30 px-4 py-2 rounded-2xl shadow-sm">
              {completionPercentage}%
            </div>
          </div>
        </div>
        
        <div className="w-full bg-emerald-200/50 dark:bg-emerald-800/30 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek <= 0}
              className="p-2 bg-white dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              ←
            </button>
            <span className="px-4 py-2 bg-white dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl">
              Week {currentWeek + 1}
            </span>
            <button
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="p-2 bg-white dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all duration-300"
            >
              →
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>AI-optimized schedule</span>
          </div>
        </div>
      </div>

      {/* Study Tasks */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {weeklyPlan.length > 0 ? weeklyPlan.map((item) => (
          <div key={item.id} className={`p-6 rounded-3xl border transition-all duration-300 ${
            item.completed 
              ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-600 opacity-75'
              : 'bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-700/30 dark:to-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600'
          }`}>
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskCompletion(item.id)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  item.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600 dark:bg-gray-700/50 dark:text-gray-500'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${item.completed ? 'scale-110' : ''} transition-transform duration-300`} />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h4 className={`font-bold text-lg ${
                    item.completed 
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {item.subject}
                  </h4>
                  <div className="flex items-center gap-2">
                    {item.aiRecommended && (
                      <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.priority === 'high' ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' :
                      item.priority === 'medium' ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' :
                      'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
                
                <p className={`mb-4 ${
                  item.completed 
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.topic}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{item.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.deadline.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {!item.completed && (
                    <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-300 group">
                      <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      Start Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <div className="p-6 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl mb-4 inline-block">
              {generating ? (
                <Loader className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-spin" />
              ) : (
                <MapPin className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
              {generating ? 'Generating Your Study Plan...' : 'No Study Plan Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {generating ? 'Our AI is analyzing your performance and creating an optimized schedule' : 'Click "Regenerate Plan" to create your personalized study schedule'}
            </p>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

// Enhanced session card
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <ModernCard hover className="p-6 h-full">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl shadow-md group-hover:scale-110 transition-all duration-300">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate mb-1">
            {session.subject}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {session.topic}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <div className="text-xl font-black text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-xl">
          {formatMinutes(session.duration)}
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center gap-1 justify-end">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              star <= session.efficiency
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm'
                : 'bg-gray-200 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(session.date).toLocaleDateString()}</span>
        </div>
        {exam && (
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300 truncate max-w-24">
            {exam.name}
          </div>
        )}
      </div>
    </div>
  </ModernCard>
);

export const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const { user, isPremium } = useAuth();

  // Get display name
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null;
  const displayName = savedDisplayName || user?.displayName || user?.email?.split('@')[0];

  useEffect(() => {
    if (!user) return;

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
      setLoading(false);
    });

    const unsubscribeSessions = getUserSessions(user.uid, (sessionData) => {
      setSessions(sessionData);
    });

    return () => {
      unsubscribeExams();
      unsubscribeSessions();
    };
  }, [user]);

  // Auto-rotate themes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % heroThemes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSessionAdded = () => {
    // Sessions updated via real-time listener
  };

  // Analytics calculations
  const todaysSessions = sessions.filter(session => 
    new Date(session.date).toDateString() === new Date().toDateString()
  );
  const todaysStudyTime = todaysSessions.reduce((total, session) => total + session.duration, 0);
  
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  const weeklyStudyTime = thisWeekSessions.reduce((total, session) => total + session.duration, 0);
  
  const averageEfficiency = sessions.length > 0 
    ? sessions.reduce((total, session) => total + session.efficiency, 0) / sessions.length 
    : 0;

  // Study streak calculation
  const calculateStudyStreak = () => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasSessionOnDate = sortedSessions.some(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });
      
      if (hasSessionOnDate) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  // Performance metrics
  const getPerformanceMetrics = () => {
    const last7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const previous7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= twoWeeksAgo && sessionDate < weekAgo;
    });

    const currentWeekTime = last7Days.reduce((total, session) => total + session.duration, 0);
    const previousWeekTime = previous7Days.reduce((total, session) => total + session.duration, 0);
    const timeChange = previousWeekTime > 0 ? ((currentWeekTime - previousWeekTime) / previousWeekTime) * 100 : 0;

    return {
      timeChange: Math.round(timeChange),
      sessionsThisWeek: last7Days.length,
      averageSessionLength: last7Days.length > 0 ? Math.round(currentWeekTime / last7Days.length) : 0
    };
  };

  // Upcoming deadlines
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= now && examDate <= nextWeek;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const studyStreak = calculateStudyStreak();
  const upcomingDeadlines = getUpcomingDeadlines();
  const performanceMetrics = getPerformanceMetrics();

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Preparing Your Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Loading your personalized learning insights...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentThemeData = heroThemes[currentTheme];
  const ThemeIcon = currentThemeData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-8 pb-24 md:pb-12">
        
        {/* Enhanced Text Banner */}
        <EnhancedTextBanner />
        
        {/* Modern Hero Section */}
        <div className="mb-10">
          <div className={`relative overflow-hidden bg-gradient-to-br ${currentThemeData.gradient} rounded-3xl p-8 md:p-12 text-white shadow-2xl`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2">
                      {getTimeGreeting()}, {displayName}!
                    </h1>
                    <p className="text-xl text-white/90 font-medium">
                      {currentThemeData.greeting}
                    </p>
                  </div>
                  {isPremium && <PremiumBadge size="lg" />}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {studyStreak > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                      <Flame className="w-4 h-4" />
                      <span>{studyStreak} day streak</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <Users className="w-4 h-4" />
                    <span>Level {Math.floor(sessions.length / 10) + 1}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className={`p-6 bg-gradient-to-br ${currentThemeData.accent} rounded-3xl shadow-2xl backdrop-blur-sm`}>
                  <ThemeIcon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          <StatCard
            icon={Clock}
            label="Today's Study"
            value={formatMinutes(todaysStudyTime)}
            change={performanceMetrics.timeChange > 0 ? { value: performanceMetrics.timeChange, type: 'increase' } : undefined}
            color="text-blue-600 dark:text-blue-400"
            bgGradient="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"
          />
          <StatCard
            icon={Target}
            label="Weekly Hours"
            value={formatMinutes(weeklyStudyTime)}
            change={{ value: 12, type: 'increase' }}
            color="text-emerald-600 dark:text-emerald-400"
            bgGradient="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
          />
          <StatCard
            icon={TrendingUp}
            label="Efficiency"
            value={`${averageEfficiency.toFixed(1)}/5`}
            change={{ value: 8, type: 'increase' }}
            color="text-purple-600 dark:text-purple-400"
            bgGradient="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
          />
          <StatCard
            icon={Flame}
            label="Study Streak"
            value={`${studyStreak} days`}
            color="text-orange-600 dark:text-orange-400"
            bgGradient="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30"
          />
        </div>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <AIQuestionSolver sessions={sessions} exams={exams} />
          <SmartStudyPlanner sessions={sessions} exams={exams} />
        </div>

        {/* Analytics and Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Performance Analytics */}
          <div className="lg:col-span-2">
            <ModernCard className="p-8 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Performance Analytics</h2>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold">
                  Real-time Data
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Weekly Progress</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Study Time</span>
                      <span className="text-sm font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        +{performanceMetrics.timeChange}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {performanceMetrics.sessionsThisWeek} completed
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Session Insights</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Duration</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatMinutes(performanceMetrics.averageSessionLength)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Best Time</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        10:00 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Study Streak Visualization */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-6 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Study Streak</span>
                  </div>
                  <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                    {studyStreak} days
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {[...Array(14)].map((_, i) => {
                    const dayIndex = 13 - i;
                    const hasStudied = dayIndex < studyStreak;
                    return (
                      <div
                        key={i}
                        className={`h-4 flex-1 rounded-lg transition-all duration-300 ${
                          hasStudied 
                            ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Last 14 days • Keep the momentum! 🔥
                </p>
              </div>
            </ModernCard>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <ModernCard className="p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Deadlines</h2>
              </div>
              
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.slice(0, 4).map((exam) => {
                    const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 3;
                    const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                    const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                    
                    return (
                      <div key={exam.id} className={`p-5 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-lg ${
                        isUrgent 
                          ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-500' 
                          : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-500'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 truncate">
                              {exam.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {exam.subject}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className={`text-sm font-bold px-3 py-2 rounded-xl ${
                              isUrgent ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40'
                            }`}>
                              {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatMinutes(totalStudyTime)} studied
                          </span>
                          <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                            totalStudyTime >= 300 ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40' : 
                            totalStudyTime >= 120 ? 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40' : 
                            'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40'
                          }`}>
                            {totalStudyTime >= 300 ? 'Well Prepared' : 
                             totalStudyTime >= 120 ? 'Good Progress' : 'Need More Time'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-6 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl mb-4 inline-block">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
                    No Upcoming Deadlines
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Great! You're all caught up 🎉
                  </p>
                </div>
              )}
            </ModernCard>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Recent Sessions</h2>
                  <p className="text-gray-600 dark:text-gray-400">Your latest study activities</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-300 group">
                View All Sessions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.slice(0, 6).map((session) => {
                const exam = exams.find(e => e.id === session.examId);
                return (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    exam={exam} 
                    formatMinutes={formatMinutes}
                  />
                );
              })}
            </div>
            
            {sessions.length > 6 && (
              <div className="text-center">
                <button className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Plus className="w-5 h-5" />
                  Load More Sessions
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
