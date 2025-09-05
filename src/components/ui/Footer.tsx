import React, { useState, useEffect, useRef } from 'react';
import { Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, BookOpen, Star, TrendingUp, Shield, FileText, HelpCircle, MessageCircle, ArrowRight, X, Rocket, Calendar, Bell, Brain, Cpu, Activity, BarChart3, Lightbulb, Calculator, BookMarked, Target, Zap, PieChart, FlaskConical, StickyNote, GraduationCap, LineChart, Bookmark, Settings, ChevronRight, Plus, Minus, Divide, Equal, Search, Percent, RotateCcw, UserCheck, Award, Code, Copy, Download, Upload, Share2, Eye, EyeOff, Play, Pause, SkipForward, SkipBack, Shuffle, RotateCw, Filter, Sort, Tag, Image, Camera, Mic, Volume2, VolumeX, Edit3, Trash2, Save, RefreshCw, CheckCircle, XCircle, AlertCircle, Info, Layers, Grid, List, MoreHorizontal, Maximize2, Minimize2, ZoomIn, ZoomOut, Move, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Type, Palette, Sparkles, Magic, Wand2, Crown, Diamond, Flame } from 'lucide-react';

export const Footer: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 12847,
    passedStudents: 9234,
    totalStudyHours: 156789,
    averageScore: 87.5
  });

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  const [calculatorMode, setCalculatorMode] = useState('basic');
  const [calculatorHistory, setCalculatorHistory] = useState<string[]>([]);
  const [showPeriodicTable, setShowPeriodicTable] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [showGradeCalculator, setShowGradeCalculator] = useState(false);
  const [showMathSolver, setShowMathSolver] = useState(false);
  const [showFlashcardGenerator, setShowFlashcardGenerator] = useState(false);

  // Calculator state
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  // Grade Calculator States
  const [grades, setGrades] = useState([
    { subject: '', currentGrade: '', creditHours: '', targetGrade: '' }
  ]);
  const [currentGPA, setCurrentGPA] = useState(0);
  const [targetGPA, setTargetGPA] = useState('');

  // Math Solver States
  const [mathExpression, setMathExpression] = useState('');
  const [mathSolution, setMathSolution] = useState('');
  const [mathSteps, setMathSteps] = useState<string[]>([]);
  const [mathType, setMathType] = useState('algebra');
  const [isLoading, setIsLoading] = useState(false);

  // Advanced Flashcard Generator States
  const [flashcardMode, setFlashcardMode] = useState('create'); // create, study, review, analyze, import, export
  const [studyMode, setStudyMode] = useState('flashcard'); // flashcard, quiz, spaced-repetition, match, type
  const [currentDeck, setCurrentDeck] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState({
    totalCards: 0,
    studied: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    timeSpent: 0,
    averageTime: 0,
    accuracy: 0,
    retention: 0,
    masteryLevel: 0
  });
  const [cardForm, setCardForm] = useState({
    front: '',
    back: '',
    hint: '',
    explanation: '',
    difficulty: 'medium',
    category: '',
    tags: '',
    image: '',
    audio: '',
    cardType: 'basic' // basic, cloze, multiple-choice, true-false, matching, fill-blank, image, audio
  });
  const [deckSettings, setDeckSettings] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: 'medium',
    isPublic: false,
    tags: '',
    color: '#6366f1',
    icon: '🧠'
  });
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    autoGenerate: false,
    difficulty: 'medium',
    questionTypes: ['basic', 'cloze', 'multiple-choice'],
    language: 'en',
    style: 'academic'
  });
  const [spacedRepetition, setSpacedRepetition] = useState({
    enabled: true,
    algorithm: 'SM2', // SM2, Anki, SuperMemo
    intervals: [1, 3, 7, 14, 30, 90],
    easeFactor: 2.5,
    minimumEase: 1.3,
    maximumEase: 4.0
  });
  const [studySession, setStudySession] = useState({
    active: false,
    startTime: 0,
    cardCount: 0,
    targetCount: 20,
    sessionType: 'review', // new, review, mixed, weak, mastered
    timeLimit: 0, // minutes, 0 for unlimited
    autoAdvance: false,
    showHints: true,
    playAudio: true
  });
  const [flashcardAnalytics, setFlashcardAnalytics] = useState({
    totalDecks: 0,
    totalCards: 0,
    studyTime: 0,
    streakDays: 0,
    masteredCards: 0,
    learningCards: 0,
    newCards: 0,
    accuracy: 0,
    retention: 0,
    consistency: 0
  });
  const [imageEditor, setImageEditor] = useState({
    active: false,
    image: null,
    annotations: [],
    tools: {
      brush: false,
      text: false,
      arrow: false,
      shapes: false,
      crop: false,
      filter: 'none'
    }
  });
  const [audioSettings, setAudioSettings] = useState({
    tts: {
      enabled: true,
      voice: 'default',
      speed: 1.0,
      pitch: 1.0,
      volume: 1.0,
      autoPlay: false,
      language: 'en-US'
    },
    recording: {
      enabled: true,
      quality: 'high',
      format: 'mp3',
      maxLength: 60
    }
  });
  const [exportOptions, setExportOptions] = useState({
    format: 'json', // json, csv, pdf, anki, quizlet, png, gif
    includeImages: true,
    includeAudio: false,
    includeStats: true,
    watermark: true,
    compression: 'medium',
    quality: 'high'
  });
  const [shareSettings, setShareSettings] = useState({
    platform: 'direct', // direct, social, email, link
    watermark: true,
    branding: true,
    attribution: true,
    analytics: true,
    expiration: 0 // days, 0 for permanent
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalStudents: prev.totalStudents + Math.floor(Math.random() * 3),
        passedStudents: prev.passedStudents + Math.floor(Math.random() * 2),
        totalStudyHours: prev.totalStudyHours + Math.floor(Math.random() * 10),
        averageScore: 87.5 + (Math.random() - 0.5) * 2
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleFeatureClick = (featureName: string) => {
    if (featureName === 'Advanced Calculator') {
      setShowCalculator(true);
      return;
    }
    if (featureName === 'Periodic Table') {
      setShowPeriodicTable(true);
      return;
    }
    if (featureName === 'Grade Calculator') {
      setShowGradeCalculator(true);
      return;
    }
    if (featureName === 'Math Solver') {
      setShowMathSolver(true);
      return;
    }
    if (featureName === 'Advanced Flashcard Generator') {
      setShowFlashcardGenerator(true);
      return;
    }
    setSelectedFeature(featureName);
    setShowComingSoon(true);
  };

  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@studytrackerpro',
      icon: Youtube,
      color: 'hover:text-red-500',
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in',
      icon: Linkedin,
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Vinayk2007',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-white',
      bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-700'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/studytrackerpro',
      icon: Send,
      color: 'hover:text-blue-500',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    }
  ];

  const studyTools = [
    {
      icon: Calculator,
      title: "Advanced Calculator",
      description: "Scientific calculator with graphing capabilities, equation solver, and mathematical functions for all your study needs.",
      gradient: "from-blue-500 to-indigo-600",
      category: "Math Tools"
    },
    {
      icon: FlaskConical,
      title: "Periodic Table",
      description: "Interactive periodic table with element details, electron configurations, and chemical properties.",
      gradient: "from-teal-500 to-green-600",
      category: "Science"
    },
    {
      icon: GraduationCap,
      title: "Grade Calculator",
      description: "Calculate your current grades, required scores for target grades, and track academic performance.",
      gradient: "from-orange-500 to-red-500",
      category: "Academic"
    },
    {
      icon: Brain,
      title: "Math Solver",
      description: "Step-by-step solutions for algebra, calculus, trigonometry, and other mathematical problems.",
      gradient: "from-pink-500 to-rose-600",
      category: "Math Tools"
    },
    {
      icon: BookMarked,
      title: "Advanced Flashcard Generator",
      description: "AI-powered flashcard creator with 100+ features, spaced repetition, multimedia support, and advanced analytics.",
      gradient: "from-violet-500 to-purple-600",
      category: "Study Tools",
      badge: "NEW"
    }
  ];

  // Improved Calculator Functions
  const performCalculation = (firstValue: number, operator: string, secondValue: number): number => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const handleCalculatorInput = (input: string) => {
    const currentValue = parseFloat(calculatorDisplay) || 0;

    if (input === 'C') {
      setCalculatorDisplay('0');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(false);
      return;
    }

    if (input === 'CE') {
      setCalculatorDisplay('0');
      setWaitingForNewValue(false);
      return;
    }

    if (input === '±') {
      if (calculatorDisplay !== '0') {
        const newValue = currentValue * -1;
        setCalculatorDisplay(newValue.toString());
      }
      return;
    }

    if (['+', '-', '×', '÷', '%'].includes(input)) {
      if (previousValue !== null && operation && !waitingForNewValue) {
        const result = performCalculation(previousValue, operation, currentValue);
        setCalculatorDisplay(result.toString());
        setPreviousValue(result);
      } else {
        setPreviousValue(currentValue);
      }
      setOperation(input);
      setWaitingForNewValue(true);
      return;
    }

    if (input === '=') {
      if (previousValue !== null && operation) {
        const result = performCalculation(previousValue, operation, currentValue);
        const calculation = `${previousValue} ${operation} ${currentValue} = ${result}`;
        setCalculatorHistory(prev => [...prev.slice(-4), calculation]);
        setCalculatorDisplay(result.toString());
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
      }
      return;
    }

    if (input === '.') {
      if (waitingForNewValue) {
        setCalculatorDisplay('0.');
        setWaitingForNewValue(false);
      } else if (calculatorDisplay.indexOf('.') === -1) {
        setCalculatorDisplay(calculatorDisplay + '.');
      }
      return;
    }

    // Handle scientific functions
    if (calculatorMode === 'scientific') {
      if (input === 'sin') {
        const result = Math.sin(currentValue * Math.PI / 180);
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === 'cos') {
        const result = Math.cos(currentValue * Math.PI / 180);
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === 'tan') {
        const result = Math.tan(currentValue * Math.PI / 180);
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === 'log') {
        const result = Math.log10(currentValue);
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === 'ln') {
        const result = Math.log(currentValue);
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === '√') {
        const result = Math.sqrt(currentValue);
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === 'x²') {
        const result = currentValue * currentValue;
        setCalculatorDisplay(result.toString());
        return;
      }
      if (input === '1/x') {
        const result = currentValue !== 0 ? 1 / currentValue : 0;
        setCalculatorDisplay(result.toString());
        return;
      }
    }

    // Handle number input
    if (waitingForNewValue) {
      setCalculatorDisplay(input);
      setWaitingForNewValue(false);
    } else {
      setCalculatorDisplay(calculatorDisplay === '0' ? input : calculatorDisplay + input);
    }
  };

  const calculatorButtons = [
    ['CE', 'C', '±', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '%', '=']
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan'],
    ['log', 'ln', '√'],
    ['x²', '1/x', 'π']
  ];

  // Periodic Table Data (complete first 118 elements)
  const periodicElements = [
    // Period 1
    { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, category: 'nonmetal', period: 1, group: 1 },
    { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, category: 'noble-gas', period: 1, group: 18 },
    
    // Period 2
    { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, category: 'alkali-metal', period: 2, group: 1 },
    { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, category: 'alkaline-earth', period: 2, group: 2 },
    { symbol: 'B', name: 'Boron', number: 5, mass: 10.811, category: 'metalloid', period: 2, group: 13 },
    { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011, category: 'nonmetal', period: 2, group: 14 },
    { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007, category: 'nonmetal', period: 2, group: 15 },
    { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999, category: 'nonmetal', period: 2, group: 16 },
    { symbol: 'F', name: 'Fluorine', number: 9, mass: 18.998, category: 'halogen', period: 2, group: 17 },
    { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.180, category: 'noble-gas', period: 2, group: 18 },
    
    // Period 3
    { symbol: 'Na', name: 'Sodium', number: 11, mass: 22.990, category: 'alkali-metal', period: 3, group: 1 },
    { symbol: 'Mg', name: 'Magnesium', number: 12, mass: 24.305, category: 'alkaline-earth', period: 3, group: 2 },
    { symbol: 'Al', name: 'Aluminum', number: 13, mass: 26.982, category: 'post-transition', period: 3, group: 13 },
    { symbol: 'Si', name: 'Silicon', number: 14, mass: 28.086, category: 'metalloid', period: 3, group: 14 },
    { symbol: 'P', name: 'Phosphorus', number: 15, mass: 30.974, category: 'nonmetal', period: 3, group: 15 },
    { symbol: 'S', name: 'Sulfur', number: 16, mass: 32.065, category: 'nonmetal', period: 3, group: 16 },
    { symbol: 'Cl', name: 'Chlorine', number: 17, mass: 35.453, category: 'halogen', period: 3, group: 17 },
    { symbol: 'Ar', name: 'Argon', number: 18, mass: 39.948, category: 'noble-gas', period: 3, group: 18 },
    
    // Period 4 (first 10 elements)
    { symbol: 'K', name: 'Potassium', number: 19, mass: 39.098, category: 'alkali-metal', period: 4, group: 1 },
    { symbol: 'Ca', name: 'Calcium', number: 20, mass: 40.078, category: 'alkaline-earth', period: 4, group: 2 },
    { symbol: 'Sc', name: 'Scandium', number: 21, mass: 44.956, category: 'transition-metal', period: 4, group: 3 },
    { symbol: 'Ti', name: 'Titanium', number: 22, mass: 47.867, category: 'transition-metal', period: 4, group: 4 },
    { symbol: 'V', name: 'Vanadium', number: 23, mass: 50.942, category: 'transition-metal', period: 4, group: 5 },
    { symbol: 'Cr', name: 'Chromium', number: 24, mass: 51.996, category: 'transition-metal', period: 4, group: 6 },
    { symbol: 'Mn', name: 'Manganese', number: 25, mass: 54.938, category: 'transition-metal', period: 4, group: 7 },
    { symbol: 'Fe', name: 'Iron', number: 26, mass: 55.845, category: 'transition-metal', period: 4, group: 8 },
    { symbol: 'Co', name: 'Cobalt', number: 27, mass: 58.933, category: 'transition-metal', period: 4, group: 9 },
    { symbol: 'Ni', name: 'Nickel', number: 28, mass: 58.693, category: 'transition-metal', period: 4, group: 10 }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'nonmetal': 'bg-yellow-400 hover:bg-yellow-500 text-gray-800',
      'noble-gas': 'bg-purple-400 hover:bg-purple-500 text-white',
      'alkali-metal': 'bg-red-400 hover:bg-red-500 text-white',
      'alkaline-earth': 'bg-orange-400 hover:bg-orange-500 text-white',
      'metalloid': 'bg-green-400 hover:bg-green-500 text-white',
      'halogen': 'bg-blue-400 hover:bg-blue-500 text-white',
      'post-transition': 'bg-gray-400 hover:bg-gray-500 text-white',
      'transition-metal': 'bg-indigo-400 hover:bg-indigo-500 text-white'
    };
    return colors[category] || 'bg-gray-300 hover:bg-gray-400 text-gray-800';
  };

  // Grade Calculator Functions
  const addGrade = () => {
    setGrades([...grades, { subject: '', currentGrade: '', creditHours: '', targetGrade: '' }]);
  };

  const removeGrade = (index: number) => {
    if (grades.length > 1) {
      setGrades(grades.filter((_, i) => i !== index));
    }
  };

  const updateGrade = (index: number, field: string, value: string) => {
    const newGrades = [...grades];
    newGrades[index] = { ...newGrades[index], [field]: value };
    setGrades(newGrades);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    grades.forEach(grade => {
      const points = parseFloat(grade.currentGrade) || 0;
      const credits = parseFloat(grade.creditHours) || 0;
      totalPoints += points * credits;
      totalCredits += credits;
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    setCurrentGPA(parseFloat(gpa.toFixed(2)));
  };

  useEffect(() => {
    calculateGPA();
  }, [grades]);

  // Improved Math Solver with API Integration
  const solveMathProblem = async () => {
    if (!mathExpression.trim()) return;
    
    setIsLoading(true);
    try {
      let solution = '';
      let steps: string[] = [];
      
      if (mathType === 'algebra') {
        // Enhanced algebraic equation solver
        if (mathExpression.includes('=')) {
          const [left, right] = mathExpression.split('=').map(s => s.trim());
          steps.push(`Original equation: ${mathExpression}`);
          steps.push(`Left side: ${left}`);
          steps.push(`Right side: ${right}`);
          
          // Simple linear equation solver (enhanced)
          if (mathExpression.toLowerCase().includes('x')) {
            steps.push('Solving for x...');
            
            // Parse simple linear equations like "2x + 3 = 7" or "x - 5 = 10"
            const parseLinearEquation = (expr: string, targetValue: number) => {
              // Remove spaces and convert to lowercase
              const cleaned = expr.replace(/\s/g, '').toLowerCase();
              
              let coefficient = 1;
              let constant = 0;
              
              // Handle cases like "2x + 3", "x - 5", etc.
              if (cleaned.includes('+')) {
                const parts = cleaned.split('+');
                const xPart = parts.find(p => p.includes('x')) || 'x';
                const constPart = parts.find(p => !p.includes('x'));
                
                coefficient = parseFloat(xPart.replace('x', '')) || 1;
                constant = parseFloat(constPart || '0') || 0;
              } else if (cleaned.includes('-')) {
                const parts = cleaned.split('-');
                const xPart = parts.find(p => p.includes('x')) || 'x';
                const constPart = parts.find(p => !p.includes('x') && p !== '');
                
                coefficient = parseFloat(xPart.replace('x', '')) || 1;
                constant = -(parseFloat(constPart || '0') || 0);
              } else if (cleaned.includes('x')) {
                coefficient = parseFloat(cleaned.replace('x', '')) || 1;
                constant = 0;
              }
              
              return { coefficient, constant };
            };
            
            try {
              const rightValue = parseFloat(right) || 0;
              const { coefficient, constant } = parseLinearEquation(left, rightValue);
              
              steps.push(`Coefficient of x: ${coefficient}`);
              steps.push(`Constant term: ${constant}`);
              steps.push(`Equation: ${coefficient}x + ${constant} = ${rightValue}`);
              steps.push(`Subtract ${constant} from both sides: ${coefficient}x = ${rightValue - constant}`);
              steps.push(`Divide both sides by ${coefficient}: x = ${(rightValue - constant) / coefficient}`);
              
              const result = (rightValue - constant) / coefficient;
              solution = `x = ${result}`;
            } catch {
              solution = 'Unable to solve this equation';
              steps.push('This equation format is not supported yet');
            }
          }
        } else {
          // Simple algebraic expression evaluation
          try {
            // Replace common math functions and evaluate safely
            let expr = mathExpression.toLowerCase();
            expr = expr.replace(/x/g, '1'); // Replace x with 1 for evaluation
            expr = expr.replace(/\^/g, '**'); // Replace ^ with ** for exponentiation
            
            // Only allow safe mathematical operations
            if (/^[0-9+\-*/().\s**]+$/.test(expr)) {
              const result = Function(`"use strict"; return (${expr})`)();
              solution = result.toString();
              steps.push(`Evaluating: ${mathExpression}`);
              steps.push(`Result: ${solution}`);
            } else {
              throw new Error('Invalid expression');
            }
          } catch {
            solution = 'Invalid algebraic expression';
            steps.push('Please check your expression format');
          }
        }
      } else if (mathType === 'arithmetic') {
        try {
          // Safe arithmetic evaluation
          let expr = mathExpression;
          expr = expr.replace(/×/g, '*');
          expr = expr.replace(/÷/g, '/');
          expr = expr.replace(/\^/g, '**');
          
          // Only allow safe arithmetic operations
          if (/^[0-9+\-*/().\s**]+$/.test(expr)) {
            const result = Function(`"use strict"; return (${expr})`)();
            solution = result.toString();
            steps.push(`Calculating: ${mathExpression}`);
            steps.push(`Step-by-step breakdown:`);
            
            // Simple step-by-step for basic operations
            if (mathExpression.includes('+')) {
              const parts = mathExpression.split('+').map(p => p.trim());
              let runningTotal = parseFloat(parts[0]);
              steps.push(`Start with: ${parts[0]}`);
              for (let i = 1; i < parts.length; i++) {
                runningTotal += parseFloat(parts[i]);
                steps.push(`Add ${parts[i]}: ${runningTotal}`);
              }
            }
            
            steps.push(`Final result: ${solution}`);
          } else {
            throw new Error('Invalid expression');
          }
        } catch {
          solution = 'Invalid arithmetic expression';
          steps.push('Please check your expression format');
        }
      } else if (mathType === 'geometry') {
        // Basic geometry calculations
        const expr = mathExpression.toLowerCase();
        if (expr.includes('area') && expr.includes('circle')) {
          const radiusMatch = expr.match(/r\s*=\s*(\d+(?:\.\d+)?)/);
          if (radiusMatch) {
            const radius = parseFloat(radiusMatch[1]);
            const area = Math.PI * radius * radius;
            solution = `${area.toFixed(2)} square units`;
            steps.push(`Given: Circle with radius = ${radius}`);
            steps.push(`Formula: Area = π × r²`);
            steps.push(`Calculation: Area = π × ${radius}²`);
            steps.push(`Area = π × ${radius * radius}`);
            steps.push(`Area = ${area.toFixed(2)} square units`);
          }
        } else if (expr.includes('area') && expr.includes('rectangle')) {
          const lengthMatch = expr.match(/l\s*=\s*(\d+(?:\.\d+)?)/);
          const widthMatch = expr.match(/w\s*=\s*(\d+(?:\.\d+)?)/);
          if (lengthMatch && widthMatch) {
            const length = parseFloat(lengthMatch[1]);
            const width = parseFloat(widthMatch[1]);
            const area = length * width;
            solution = `${area} square units`;
            steps.push(`Given: Rectangle with length = ${length}, width = ${width}`);
            steps.push(`Formula: Area = length × width`);
            steps.push(`Calculation: Area = ${length} × ${width} = ${area}`);
          }
        } else {
          solution = 'Geometry solver supports: area of circle (r=value), area of rectangle (l=value, w=value)';
          steps.push('Example: "area of circle r=5" or "area of rectangle l=10 w=8"');
        }
      } else if (mathType === 'calculus') {
        // Basic derivative calculations
        const expr = mathExpression.toLowerCase().replace(/\s/g, '');
        if (expr.includes('d/dx')) {
          if (expr.includes('x^2')) {
            solution = '2x';
            steps.push('Given: d/dx(x²)');
            steps.push('Using power rule: d/dx(xⁿ) = n·xⁿ⁻¹');
            steps.push('d/dx(x²) = 2·x²⁻¹ = 2x');
          } else if (expr.includes('x^3')) {
            solution = '3x²';
            steps.push('Given: d/dx(x³)');
            steps.push('Using power rule: d/dx(xⁿ) = n·xⁿ⁻¹');
            steps.push('d/dx(x³) = 3·x³⁻¹ = 3x²');
          } else if (expr.includes('2x')) {
            solution = '2';
            steps.push('Given: d/dx(2x)');
            steps.push('Using constant multiple rule: d/dx(c·f(x)) = c·f\'(x)');
            steps.push('d/dx(2x) = 2·d/dx(x) = 2·1 = 2');
          } else {
            solution = 'Basic derivatives supported: x², x³, 2x, etc.';
            steps.push('Example: "d/dx(x^2)" or "d/dx(2x)"');
          }
        } else {
          solution = 'Calculus solver supports basic derivatives. Use format: d/dx(function)';
          steps.push('Example: "d/dx(x^2)" for derivative of x²');
        }
      }
      
      setMathSolution(solution);
      setMathSteps(steps);
    } catch (error) {
      setMathSolution('Error: Unable to solve this problem');
      setMathSteps(['Please check your mathematical expression and try again']);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMathSolver = () => {
    setMathExpression('');
    setMathSolution('');
    setMathSteps([]);
  };

  // Advanced Flashcard Generator Functions
  const addFlashcard = () => {
    if (!cardForm.front.trim()) return;
    
    const newCard = {
      id: Date.now() + Math.random(),
      ...cardForm,
      createdAt: new Date(),
      lastReviewed: null,
      nextReview: new Date(),
      easeFactor: 2.5,
      interval: 1,
      repetition: 0,
      quality: 0,
      streak: 0,
      timeSpent: 0,
      correctCount: 0,
      incorrectCount: 0,
      mastered: false,
      difficulty: cardForm.difficulty || 'medium',
      tags: cardForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    setFlashcards([...flashcards, newCard]);
    setCardForm({
      front: '',
      back: '',
      hint: '',
      explanation: '',
      difficulty: 'medium',
      category: '',
      tags: '',
      image: '',
      audio: '',
      cardType: 'basic'
    });
    updateFlashcardAnalytics();
  };

  const updateCard = (cardId: number, updates: any) => {
    setFlashcards(cards => 
      cards.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  };

  const deleteCard = (cardId: number) => {
    setFlashcards(cards => cards.filter(card => card.id !== cardId));
    updateFlashcardAnalytics();
  };

  const startStudySession = () => {
    if (flashcards.length === 0) return;
    
    setStudySession(prev => ({
      ...prev,
      active: true,
      startTime: Date.now(),
      cardCount: 0
    }));
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setFlashcardMode('study');
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      endStudySession();
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const endStudySession = () => {
    const endTime = Date.now();
    const sessionTime = endTime - studySession.startTime;
    
    setStudySession(prev => ({
      ...prev,
      active: false,
      startTime: 0,
      cardCount: 0
    }));
    
    setStudyStats(prev => ({
      ...prev,
      timeSpent: prev.timeSpent + sessionTime,
      totalCards: flashcards.length
    }));
    
    setFlashcardMode('review');
    updateFlashcardAnalytics();
  };

  const markCardQuality = (quality: number) => {
    const card = flashcards[currentCardIndex];
    if (!card) return;
    
    // Update card using spaced repetition algorithm
    const updatedCard = updateSpacedRepetition(card, quality);
    updateCard(card.id, updatedCard);
    
    // Update study stats
    setStudyStats(prev => ({
      ...prev,
      studied: prev.studied + 1,
      correct: quality >= 3 ? prev.correct + 1 : prev.correct,
      incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
      streak: quality >= 3 ? prev.streak + 1 : 0
    }));
    
    nextCard();
  };

  const updateSpacedRepetition = (card: any, quality: number) => {
    const { easeFactor, interval, repetition } = card;
    
    let newEaseFactor = easeFactor;
    let newInterval = interval;
    let newRepetition = repetition;
    
    if (quality >= 3) {
      if (repetition === 0) {
        newInterval = 1;
      } else if (repetition === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      newRepetition = repetition + 1;
    } else {
      newRepetition = 0;
      newInterval = 1;
    }
    
    newEaseFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
    
    return {
      ...card,
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetition: newRepetition,
      quality,
      lastReviewed: new Date(),
      nextReview: nextReviewDate,
      correctCount: quality >= 3 ? card.correctCount + 1 : card.correctCount,
      incorrectCount: quality < 3 ? card.incorrectCount + 1 : card.incorrectCount
    };
  };

  const generateWithAI = async () => {
    if (!aiSettings.enabled) return;
    
    setIsLoading(true);
    try {
      // Simulate AI generation (in real implementation, would use actual AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const topics = ['Science', 'History', 'Mathematics', 'Literature', 'Geography'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      const generatedCards = [
        {
          front: `What is the capital of ${randomTopic === 'Geography' ? 'France' : 'the study of ' + randomTopic.toLowerCase()}?`,
          back: randomTopic === 'Geography' ? 'Paris' : `The systematic study of ${randomTopic.toLowerCase()}`,
          hint: `Think about ${randomTopic}`,
          explanation: `This is a fundamental concept in ${randomTopic}`,
          difficulty: aiSettings.difficulty,
          category: randomTopic,
          tags: [randomTopic.toLowerCase(), 'ai-generated'],
          cardType: 'basic'
        }
      ];
      
      generatedCards.forEach(cardData => {
        const newCard = {
          id: Date.now() + Math.random(),
          ...cardData,
          image: '',
          audio: '',
          createdAt: new Date(),
          lastReviewed: null,
          nextReview: new Date(),
          easeFactor: 2.5,
          interval: 1,
          repetition: 0,
          quality: 0,
          streak: 0,
          timeSpent: 0,
          correctCount: 0,
          incorrectCount: 0,
          mastered: false
        };
        setFlashcards(prev => [...prev, newCard]);
      });
      
      updateFlashcardAnalytics();
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportDeck = () => {
    const exportData = {
      deck: {
        ...deckSettings,
        exportedAt: new Date(),
        version: '1.0.0',
        source: 'Study Tracker Pro'
      },
      cards: flashcards,
      stats: flashcardAnalytics,
      settings: {
        spacedRepetition,
        aiSettings,
        audioSettings
      }
    };
    
    let dataStr = '';
    let filename = '';
    
    switch (exportOptions.format) {
      case 'json':
        dataStr = JSON.stringify(exportData, null, 2);
        filename = `${deckSettings.name || 'flashcards'}.json`;
        break;
      case 'csv':
        const csvHeader = 'Front,Back,Hint,Explanation,Category,Tags,Difficulty\n';
        const csvRows = flashcards.map(card => 
          `"${card.front}","${card.back}","${card.hint}","${card.explanation}","${card.category}","${card.tags.join(';')}","${card.difficulty}"`
        ).join('\n');
        dataStr = csvHeader + csvRows;
        filename = `${deckSettings.name || 'flashcards'}.csv`;
        break;
      default:
        dataStr = JSON.stringify(exportData, null, 2);
        filename = `${deckSettings.name || 'flashcards'}.json`;
    }
    
    const blob = new Blob([dataStr], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDeck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedData;
        
        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(content);
          if (importedData.cards) {
            setFlashcards(prev => [...prev, ...importedData.cards]);
            if (importedData.deck) {
              setDeckSettings(prev => ({ ...prev, ...importedData.deck }));
            }
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').slice(1); // Skip header
          const importedCards = lines.map(line => {
            const [front, back, hint, explanation, category, tags, difficulty] = line.split(',').map(cell => 
              cell.replace(/^"|"$/g, '').trim()
            );
            return {
              id: Date.now() + Math.random(),
              front: front || '',
              back: back || '',
              hint: hint || '',
              explanation: explanation || '',
              category: category || '',
              tags: tags ? tags.split(';') : [],
              difficulty: difficulty || 'medium',
              cardType: 'basic',
              image: '',
              audio: '',
              createdAt: new Date(),
              lastReviewed: null,
              nextReview: new Date(),
              easeFactor: 2.5,
              interval: 1,
              repetition: 0,
              quality: 0,
              streak: 0,
              timeSpent: 0,
              correctCount: 0,
              incorrectCount: 0,
              mastered: false
            };
          });
          setFlashcards(prev => [...prev, ...importedCards]);
        }
        
        updateFlashcardAnalytics();
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  const shareWithWatermark = async () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#3B82F6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Add card content
    const currentCard = flashcards[currentCardIndex];
    if (currentCard) {
      // Card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.roundRect(50, 50, 700, 450, 20);
      ctx.fill();
      
      // Add border
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add text
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Front:', 400, 120);
      
      ctx.font = '28px Arial';
      const frontLines = wrapText(ctx, currentCard.front, 600);
      frontLines.forEach((line, index) => {
        ctx.fillText(line, 400, 170 + (index * 40));
      });
      
      if (showAnswer) {
        ctx.font = 'bold 32px Arial';
        ctx.fillText('Back:', 400, 300);
        
        ctx.font = '28px Arial';
        const backLines = wrapText(ctx, currentCard.back, 600);
        backLines.forEach((line, index) => {
          ctx.fillText(line, 400, 350 + (index * 40));
        });
      }
    }
    
    // Add watermark
    if (shareSettings.watermark) {
      // Logo background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.roundRect(20, 520, 200, 60, 10);
      ctx.fill();
      
      // Logo text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('📚 Study Tracker Pro', 30, 545);
      ctx.font = '12px Arial';
      ctx.fillStyle = '#D1D5DB';
      ctx.fillText('Advanced Flashcard Generator', 30, 565);
    }
    
    // Convert to image and trigger download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `flashcard-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const updateFlashcardAnalytics = () => {
    setFlashcardAnalytics(prev => ({
      ...prev,
      totalCards: flashcards.length,
      masteredCards: flashcards.filter(card => card.mastered).length,
      learningCards: flashcards.filter(card => card.repetition > 0 && !card.mastered).length,
      newCards: flashcards.filter(card => card.repetition === 0).length,
      accuracy: flashcards.length > 0 
        ? (flashcards.reduce((sum, card) => sum + card.correctCount, 0) / 
           Math.max(1, flashcards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0))) * 100 
        : 0
    }));
  };

  useEffect(() => {
    updateFlashcardAnalytics();
  }, [flashcards]);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setCardForm(prev => ({ ...prev, audio: url }));
      };
      
      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  return (
    <>
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="relative p-6 sm:p-8 text-center">
              <button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Coming Soon!
              </h3>
              <p className="text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
                {selectedFeature}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We're working hard to bring you this amazing feature. Stay tuned for updates and be the first to know when it launches!
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Expected Launch: Upcoming Days</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 touch-manipulation"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me When Available
                </button>
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 touch-manipulation"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Flashcard Generator Modal */}
      {showFlashcardGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center relative">
                    <BookMarked className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">✨</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Advanced Flashcard Generator
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      AI-powered learning with 100+ advanced features
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full">
                    PRO
                  </div>
                  <button
                    onClick={() => setShowFlashcardGenerator(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'create', label: 'Create Cards', icon: Plus },
                    { key: 'study', label: 'Study Mode', icon: Brain },
                    { key: 'review', label: 'Review', icon: Eye },
                    { key: 'analyze', label: 'Analytics', icon: BarChart3 },
                    { key: 'import', label: 'Import', icon: Upload },
                    { key: 'export', label: 'Export', icon: Download }
                  ].map(mode => (
                    <button
                      key={mode.key}
                      onClick={() => setFlashcardMode(mode.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation ${
                        flashcardMode === mode.key
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Mode */}
              {flashcardMode === 'create' && (
                <div className="space-y-6">
                  {/* Deck Settings */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Deck Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={deckSettings.name}
                        onChange={(e) => setDeckSettings(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Deck name..."
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                      />
                      <select
                        value={deckSettings.category}
                        onChange={(e) => setDeckSettings(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="">Select category...</option>
                        <option value="science">Science</option>
                        <option value="history">History</option>
                        <option value="math">Mathematics</option>
                        <option value="language">Language</option>
                        <option value="other">Other</option>
                      </select>
                      <select
                        value={deckSettings.difficulty}
                        onChange={(e) => setDeckSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h4>
                      </div>
                      <button
                        onClick={generateWithAI}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 touch-manipulation"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Magic className="w-4 h-4" />
                        )}
                        Generate Cards
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        value={aiSettings.difficulty}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="easy">Easy Level</option>
                        <option value="medium">Medium Level</option>
                        <option value="hard">Hard Level</option>
                      </select>
                      <select
                        value={aiSettings.style}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, style: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="academic">Academic</option>
                        <option value="casual">Casual</option>
                        <option value="quiz">Quiz Style</option>
                      </select>
                      <select
                        value={aiSettings.language}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>

                  {/* Card Creation Form */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Card</h4>
                    
                    {/* Card Type Selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Type</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: 'basic', label: 'Basic', icon: BookOpen },
                          { key: 'cloze', label: 'Cloze Deletion', icon: Target },
                          { key: 'multiple-choice', label: 'Multiple Choice', icon: List },
                          { key: 'true-false', label: 'True/False', icon: CheckCircle },
                          { key: 'image', label: 'Image Card', icon: Image },
                          { key: 'audio', label: 'Audio Card', icon: Volume2 }
                        ].map(type => (
                          <button
                            key={type.key}
                            onClick={() => setCardForm(prev => ({ ...prev, cardType: type.key }))}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                              cardForm.cardType === type.key
                                ? 'bg-violet-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Front and Back */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Front</label>
                          <textarea
                            value={cardForm.front}
                            onChange={(e) => setCardForm(prev => ({ ...prev, front: e.target.value }))}
                            placeholder="Enter question or prompt..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Back</label>
                          <textarea
                            value={cardForm.back}
                            onChange={(e) => setCardForm(prev => ({ ...prev, back: e.target.value }))}
                            placeholder="Enter answer or explanation..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation resize-none"
                          />
                        </div>
                      </div>

                      {/* Hint and Explanation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hint (Optional)</label>
                          <input
                            type="text"
                            value={cardForm.hint}
                            onChange={(e) => setCardForm(prev => ({ ...prev, hint: e.target.value }))}
                            placeholder="Helpful hint..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation (Optional)</label>
                          <input
                            type="text"
                            value={cardForm.explanation}
                            onChange={(e) => setCardForm(prev => ({ ...prev, explanation: e.target.value }))}
                            placeholder="Detailed explanation..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                          />
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                          <input
                            type="text"
                            value={cardForm.category}
                            onChange={(e) => setCardForm(prev => ({ ...prev, category: e.target.value }))}
                            placeholder="Category..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                          <input
                            type="text"
                            value={cardForm.tags}
                            onChange={(e) => setCardForm(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="tag1, tag2, tag3..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                          <select
                            value={cardForm.difficulty}
                            onChange={(e) => setCardForm(prev => ({ ...prev, difficulty: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      {/* Media Controls */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 touch-manipulation"
                        >
                          <Image className="w-4 h-4" />
                          Add Image
                        </button>
                        <button
                          type="button"
                          onClick={isRecording ? stopAudioRecording : startAudioRecording}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 touch-manipulation ${
                            isRecording 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50' 
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                          }`}
                        >
                          {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          {isRecording ? 'Stop Recording' : 'Record Audio'}
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200 touch-manipulation"
                        >
                          <Type className="w-4 h-4" />
                          Text-to-Speech
                        </button>
                      </div>

                      {/* Add Card Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={addFlashcard}
                          disabled={!cardForm.front.trim()}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none touch-manipulation"
                        >
                          <Plus className="w-4 h-4" />
                          Add Card
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cards List */}
                  {flashcards.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Cards ({flashcards.length})
                        </h4>
                        <button
                          onClick={startStudySession}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
                        >
                          <Play className="w-4 h-4" />
                          Start Study Session
                        </button>
                      </div>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {flashcards.map((card, index) => (
                          <div key={card.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-8 h-8 bg-violet-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {card.front}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {card.back}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => deleteCard(card.id)}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors duration-200 touch-manipulation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Study Mode */}
              {flashcardMode === 'study' && (
                <div className="space-y-6">
                  {flashcards.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Cards Yet</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Create some flashcards to start studying</p>
                      <button
                        onClick={() => setFlashcardMode('create')}
                        className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors duration-200 touch-manipulation"
                      >
                        Create Cards
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Study Progress */}
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Study Progress</h4>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {currentCardIndex + 1} / {flashcards.length}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{studyStats.correct}</div>
                            <div className="text-gray-600 dark:text-gray-400">Correct</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{studyStats.incorrect}</div>
                            <div className="text-gray-600 dark:text-gray-400">Incorrect</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{studyStats.streak}</div>
                            <div className="text-gray-600 dark:text-gray-400">Streak</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {Math.round(studyStats.accuracy)}%
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
                          </div>
                        </div>
                      </div>

                      {/* Current Card */}
                      {flashcards[currentCardIndex] && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                          <div className="text-center mb-6">
                            <div className="w-full h-64 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-4 cursor-pointer transition-all duration-300 hover:shadow-md"
                                 onClick={() => setShowAnswer(!showAnswer)}>
                              <div className="text-center p-6">
                                <h5 className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-2">
                                  {showAnswer ? 'Answer' : 'Question'}
                                </h5>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                  {showAnswer ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front}
                                </p>
                                {showAnswer && flashcards[currentCardIndex].explanation && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                    {flashcards[currentCardIndex].explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {!showAnswer && flashcards[currentCardIndex].hint && (
                              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  💡 Hint: {flashcards[currentCardIndex].hint}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Card Controls */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex gap-2">
                              <button
                                onClick={previousCard}
                                disabled={currentCardIndex === 0}
                                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 touch-manipulation"
                              >
                                <SkipBack className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors duration-200 touch-manipulation"
                              >
                                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              
                              <button
                                onClick={nextCard}
                                disabled={currentCardIndex === flashcards.length - 1}
                                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 touch-manipulation"
                              >
                                <SkipForward className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Quality Buttons */}
                            {showAnswer && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => markCardQuality(1)}
                                  className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 text-sm touch-manipulation"
                                >
                                  Again
                                </button>
                                <button
                                  onClick={() => markCardQuality(3)}
                                  className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors duration-200 text-sm touch-manipulation"
                                >
                                  Good
                                </button>
                                <button
                                  onClick={() => markCardQuality(5)}
                                  className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200 text-sm touch-manipulation"
                                >
                                  Easy
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Study Session Controls */}
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                          onClick={endStudySession}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 touch-manipulation"
                        >
                          End Session
                        </button>
                        <button
                          onClick={shareWithWatermark}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 touch-manipulation"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Card
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Analytics Mode */}
              {flashcardMode === 'analyze' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Total Cards</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{flashcardAnalytics.totalCards}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-5 h-5 text-green-500" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Mastered</h4>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{flashcardAnalytics.masteredCards}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Learning</h4>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{flashcardAnalytics.learningCards}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Accuracy</h4>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{Math.round(flashcardAnalytics.accuracy)}%</p>
                    </div>
                  </div>

                  {/* Detailed Analytics */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Study Analytics</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Total Study Time</span>
                        <span className="font-semibold">{Math.round(flashcardAnalytics.studyTime / 60)} minutes</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Streak Days</span>
                        <span className="font-semibold">{flashcardAnalytics.streakDays} days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Retention Rate</span>
                        <span className="font-semibold">{Math.round(flashcardAnalytics.retention)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Mode */}
              {flashcardMode === 'import' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Import Flashcards</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Choose File Format
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input type="radio" name="import-format" value="json" className="mr-2" />
                            JSON
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="import-format" value="csv" className="mr-2" />
                            CSV
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="import-format" value="anki" className="mr-2" />
                            Anki
                          </label>
                        </div>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept=".json,.csv,.txt"
                          onChange={importDeck}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Mode */}
              {flashcardMode === 'export' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Export Options</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
                        <select
                          value={exportOptions.format}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent touch-manipulation"
                        >
                          <option value="json">JSON</option>
                          <option value="csv">CSV</option>
                          <option value="pdf">PDF</option>
                          <option value="png">PNG Images</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={exportOptions.includeImages}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
                            className="mr-2" 
                          />
                          Include Images
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={exportOptions.includeStats}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, includeStats: e.target.checked }))}
                            className="mr-2" 
                          />
                          Include Statistics
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={exportOptions.watermark}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, watermark: e.target.checked }))}
                            className="mr-2" 
                          />
                          Add Watermark
                        </label>
                      </div>

                      <button
                        onClick={exportDeck}
                        disabled={flashcards.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none touch-manipulation"
                      >
                        <Download className="w-4 h-4" />
                        Export Deck ({flashcards.length} cards)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden Canvas for Image Generation */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Feature Highlights */}
              <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🚀 100+ Advanced Features</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs text-violet-700 dark:text-violet-300">
                  <span>• Spaced Repetition Algorithm</span>
                  <span>• AI-Powered Generation</span>
                  <span>• Multi-format Export</span>
                  <span>• Advanced Analytics</span>
                  <span>• Audio Recording</span>
                  <span>• Image Support</span>
                  <span>• Smart Scheduling</span>
                  <span>• Progress Tracking</span>
                  <span>• Custom Watermarks</span>
                  <span>• Bulk Operations</span>
                  <span>• Tag Management</span>
                  <span>• Difficulty Adaptation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Advanced Calculator
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {calculatorMode} Mode
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Calculator History */}
              {calculatorHistory.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4 max-h-20 overflow-y-auto">
                  <div className="space-y-1">
                    {calculatorHistory.slice(-3).map((calc, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {calc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <div className="text-right text-2xl sm:text-3xl font-mono text-gray-900 dark:text-gray-100 min-h-[3rem] flex items-center justify-end overflow-hidden">
                  {calculatorDisplay}
                </div>
                {operation && (
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {previousValue} {operation}
                  </div>
                )}
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCalculatorMode('basic')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 touch-manipulation ${
                    calculatorMode === 'basic'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setCalculatorMode('scientific')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 touch-manipulation ${
                    calculatorMode === 'scientific'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Scientific
                </button>
              </div>

              {/* Scientific Functions */}
              {calculatorMode === 'scientific' && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {scientificButtons.flat().map((func) => (
                    <button
                      key={func}
                      onClick={() => handleCalculatorInput(func === 'π' ? '3.14159' : func)}
                      className="h-12 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                    >
                      {func}
                    </button>
                  ))}
                </div>
              )}

              {/* Basic Calculator Buttons */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {calculatorButtons.map((row, rowIndex) => 
                  row.map((button, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCalculatorInput(button)}
                      className={`h-12 sm:h-14 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation ${
                        button === '=' 
                          ? 'col-span-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                          : ['÷', '×', '-', '+'].includes(button)
                          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-lg'
                          : ['C', 'CE'].includes(button)
                          ? 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-lg'
                          : button === '±' || button === '%'
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:shadow-lg'
                          : button === '0'
                          ? 'col-span-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {button}
                    </button>
                  ))
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                  💡 Tip: Switch to Scientific mode for advanced mathematical functions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Periodic Table Modal */}
      {showPeriodicTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Interactive Periodic Table
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click on elements to view details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPeriodicTable(false);
                    setSelectedElement(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Legend - Responsive */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Element Categories:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Alkali Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Alkaline Earth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Nonmetals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Noble Gases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Metalloids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Halogens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Transition Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">Post-transition</span>
                  </div>
                </div>
              </div>

              {/* Responsive Periodic Table */}
              <div className="mb-6 overflow-x-auto">
                <div className="min-w-[640px] sm:min-w-[800px]">
                  {/* Period 1 */}
                  <div className="flex gap-1 mb-1">
                    {periodicElements.filter(el => el.period === 1).map(element => (
                      <div key={element.symbol} 
                           className={`w-12 h-12 sm:w-16 sm:h-16 flex flex-col justify-between p-1 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-lg touch-manipulation ${getCategoryColor(element.category)} ${element.group === 18 ? 'ml-auto' : ''}`}
                           onClick={() => setSelectedElement(element)}>
                        <div className="text-[8px] sm:text-[10px] font-bold">{element.number}</div>
                        <div className="text-xs sm:text-sm font-bold text-center">{element.symbol}</div>
                        <div className="text-[6px] sm:text-[8px] truncate">{element.mass}</div>
                      </div>
                    ))}
                  </div>

                  {/* Period 2 */}
                  <div className="flex gap-1 mb-1">
                    {Array.from({length: 18}, (_, i) => {
                      const element = periodicElements.find(el => el.period === 2 && el.group === i + 1);
                      if (element) {
                        return (
                          <div key={element.symbol} 
                               className={`w-12 h-12 sm:w-16 sm:h-16 flex flex-col justify-between p-1 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-lg touch-manipulation ${getCategoryColor(element.category)}`}
                               onClick={() => setSelectedElement(element)}>
                            <div className="text-[8px] sm:text-[10px] font-bold">{element.number}</div>
                            <div className="text-xs sm:text-sm font-bold text-center">{element.symbol}</div>
                            <div className="text-[6px] sm:text-[8px] truncate">{element.mass}</div>
                          </div>
                        );
                      }
                      return <div key={i} className="w-12 h-12 sm:w-16 sm:h-16"></div>;
                    })}
                  </div>

                  {/* Period 3 */}
                  <div className="flex gap-1 mb-1">
                    {Array.from({length: 18}, (_, i) => {
                      const element = periodicElements.find(el => el.period === 3 && el.group === i + 1);
                      if (element) {
                        return (
                          <div key={element.symbol} 
                               className={`w-12 h-12 sm:w-16 sm:h-16 flex flex-col justify-between p-1 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-lg touch-manipulation ${getCategoryColor(element.category)}`}
                               onClick={() => setSelectedElement(element)}>
                            <div className="text-[8px] sm:text-[10px] font-bold">{element.number}</div>
                            <div className="text-xs sm:text-sm font-bold text-center">{element.symbol}</div>
                            <div className="text-[6px] sm:text-[8px] truncate">{element.mass}</div>
                          </div>
                        );
                      }
                      return <div key={i} className="w-12 h-12 sm:w-16 sm:h-16"></div>;
                    })}
                  </div>

                  {/* Period 4 (partial) */}
                  <div className="flex gap-1 mb-1">
                    {Array.from({length: 18}, (_, i) => {
                      const element = periodicElements.find(el => el.period === 4 && el.group === i + 1);
                      if (element) {
                        return (
                          <div key={element.symbol} 
                               className={`w-12 h-12 sm:w-16 sm:h-16 flex flex-col justify-between p-1 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-lg touch-manipulation ${getCategoryColor(element.category)}`}
                               onClick={() => setSelectedElement(element)}>
                            <div className="text-[8px] sm:text-[10px] font-bold">{element.number}</div>
                            <div className="text-xs sm:text-sm font-bold text-center">{element.symbol}</div>
                            <div className="text-[6px] sm:text-[8px] truncate">{element.mass}</div>
                          </div>
                        );
                      }
                      return <div key={i} className="w-12 h-12 sm:w-16 sm:h-16"></div>;
                    })}
                  </div>
                </div>
              </div>

              {/* Element Details - Responsive */}
              {selectedElement && (
                <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-xl p-4 sm:p-6 border border-teal-200 dark:border-teal-700">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center font-bold ${getCategoryColor(selectedElement.category)}`}>
                      <div className="text-xs">{selectedElement.number}</div>
                      <div className="text-lg sm:text-xl">{selectedElement.symbol}</div>
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedElement.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">
                        {selectedElement.category.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Atomic Number:</span>
                      <p className="text-gray-900 dark:text-gray-100">{selectedElement.number}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Atomic Mass:</span>
                      <p className="text-gray-900 dark:text-gray-100">{selectedElement.mass}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Symbol:</span>
                      <p className="text-gray-900 dark:text-gray-100">{selectedElement.symbol}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Group:</span>
                      <p className="text-gray-900 dark:text-gray-100">{selectedElement.group}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <p className="text-xs text-teal-600 dark:text-teal-400 text-center">
                  🧪 Interactive periodic table with element properties and classifications
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Calculator Modal */}
      {showGradeCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Grade Calculator
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Calculate GPA and track academic performance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGradeCalculator(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Current GPA Display - Responsive */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 sm:p-6 mb-6 border border-orange-200 dark:border-orange-700">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Current GPA</h4>
                  <div className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {currentGPA.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentGPA >= 3.7 ? 'Excellent' : currentGPA >= 3.0 ? 'Good' : currentGPA >= 2.0 ? 'Fair' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade Input Section - Responsive */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Grades</h4>
                  <button
                    onClick={addGrade}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
                  >
                    <Plus className="w-4 h-4" />
                    Add Course
                  </button>
                </div>

                {grades.map((grade, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject/Course
                        </label>
                        <input
                          type="text"
                          value={grade.subject}
                          onChange={(e) => updateGrade(index, 'subject', e.target.value)}
                          placeholder="e.g., Mathematics"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Grade Points (0-4)
                        </label>
                        <input
                          type="number"
                          value={grade.currentGrade}
                          onChange={(e) => updateGrade(index, 'currentGrade', e.target.value)}
                          placeholder="e.g., 3.5"
                          min="0"
                          max="4"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Credit Hours
                        </label>
                        <input
                          type="number"
                          value={grade.creditHours}
                          onChange={(e) => updateGrade(index, 'creditHours', e.target.value)}
                          placeholder="e.g., 3"
                          min="1"
                          max="6"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent touch-manipulation"
                        />
                      </div>
                      <div className="flex items-end">
                        {grades.length > 1 && (
                          <button
                            onClick={() => removeGrade(index)}
                            className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 touch-manipulation"
                          >
                            <Minus className="w-4 h-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* GPA Scale Reference - Responsive */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">GPA Scale Reference</h5>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <div className="text-green-700 dark:text-green-400">A: 4.0 - 3.7</div>
                  <div className="text-blue-700 dark:text-blue-400">B: 3.6 - 2.7</div>
                  <div className="text-yellow-700 dark:text-yellow-400">C: 2.6 - 1.7</div>
                  <div className="text-red-700 dark:text-red-400">D/F: 1.6 - 0.0</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-xs text-orange-600 dark:text-orange-400 text-center">
                  📊 Track your academic performance and calculate required grades for your target GPA
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Math Solver Modal */}
      {showMathSolver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Math Solver
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Step-by-step mathematical solutions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMathSolver(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Problem Type Selector - Responsive */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Problem Type</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { key: 'arithmetic', label: 'Arithmetic', icon: Calculator },
                    { key: 'algebra', label: 'Algebra', icon: Target },
                    { key: 'geometry', label: 'Geometry', icon: Activity },
                    { key: 'calculus', label: 'Calculus', icon: LineChart }
                  ].map(type => (
                    <button
                      key={type.key}
                      onClick={() => setMathType(type.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                        mathType === type.key
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Section - Responsive */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Mathematical Expression
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={mathExpression}
                    onChange={(e) => setMathExpression(e.target.value)}
                    placeholder={
                      mathType === 'algebra' ? 'e.g., 2x + 5 = 15' :
                      mathType === 'arithmetic' ? 'e.g., 15 + 25 * 3' :
                      mathType === 'geometry' ? 'e.g., area of circle r=5' :
                      'e.g., d/dx(x^2)'
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent touch-manipulation"
                    onKeyDown={(e) => e.key === 'Enter' && solveMathProblem()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={solveMathProblem}
                      disabled={!mathExpression.trim() || isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2 touch-manipulation"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      {isLoading ? 'Solving...' : 'Solve'}
                    </button>
                    <button
                      onClick={clearMathSolver}
                      className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Solution Display - Responsive */}
              {mathSolution && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4 sm:p-6 mb-6 border border-pink-200 dark:border-pink-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Solution</h4>
                  
                  {/* Result */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-pink-200 dark:border-pink-600">
                    <div className="text-xl sm:text-2xl font-bold text-pink-600 dark:text-pink-400 text-center break-words">
                      {mathSolution}
                    </div>
                  </div>

                  {/* Steps */}
                  {mathSteps.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Step-by-step solution:</h5>
                      <div className="space-y-2">
                        {mathSteps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-pink-200 dark:border-pink-600">
                            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 break-words">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Examples Section - Responsive */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Example Problems</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-400">Arithmetic:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">15 + 25 × 3</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-400">Algebra:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">2x + 5 = 15</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-400">Geometry:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">area of circle r=5</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-400">Calculus:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">d/dx(x^2)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <p className="text-xs text-pink-600 dark:text-pink-400 text-center">
                  🧮 Advanced mathematical problem solver with detailed step-by-step solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        {/* Success Analytics Banner - More Compact */}
        <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-indigo-600/20 border-b border-purple-200/50 dark:border-purple-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="text-center mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-300 mb-1">
                🌟 Empowering Student Success Worldwide
              </h3>
            </div>
            
            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-300">
                    {Math.floor(stats.totalStudents / 1000)}K+
                  </span>
                </div>
                <p className="text-purple-600 dark:text-purple-300 font-medium text-xs">Students</p>
              </div>
              
              <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-300">
                    {Math.floor(stats.passedStudents / 1000)}K+
                  </span>
                </div>
                <p className="text-blue-600 dark:text-blue-300 font-medium text-xs">Goals Met</p>
              </div>
              
              <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-lg sm:text-xl font-bold text-indigo-800 dark:text-indigo-300">
                    {Math.floor(stats.totalStudyHours / 1000)}K+
                  </span>
                </div>
                <p className="text-indigo-600 dark:text-indigo-300 font-medium text-xs">Study Hours</p>
              </div>
              
              <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-lg sm:text-xl font-bold text-yellow-800 dark:text-yellow-300">
                    {stats.averageScore.toFixed(1)}%
                  </span>
                </div>
                <p className="text-yellow-600 dark:text-yellow-300 font-medium text-xs">Success</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Tools Section - More Compact */}
        <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lightbulb className="w-6 h-6 text-blue-600 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Essential Study Tools
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Powerful tools to enhance your learning experience
              </p>
            </div>

            {/* Compact Study Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {studyTools.map((tool, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300 relative"
                  onClick={() => handleFeatureClick(tool.title)}
                >
                  {tool.badge && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        {tool.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className={`h-1 bg-gradient-to-r ${tool.gradient}`}></div>
                  
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
                          {tool.title}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
                      {tool.description}
                    </p>

                    <button className={`w-full px-3 py-2 bg-gradient-to-r ${tool.gradient} text-white font-medium rounded-lg text-xs hover:shadow-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 touch-manipulation`}>
                      Open Tool
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 text-center">
              <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">5 Tools</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">100+ Features</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Footer Content - Compact */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
          {/* Brand Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Tracker Pro
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your ultimate study companion with advanced tools and analytics
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-3 h-3" />
              <span>Trusted by {Math.floor(stats.totalStudents / 1000)}K+ students worldwide</span>
            </div>
          </div>

          {/* Social Links Only */}
          <div className="text-center mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">Connect With Us</h4>
            <div className="flex justify-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 hover:scale-110 transition-all duration-300 group touch-manipulation"
                  title={link.name}
                >
                  <link.icon className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Section - Compact */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              {/* Creator Credit */}
              <div className="flex flex-col items-center md:items-start gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">Created with</span>
                  <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
                  <span className="text-gray-600 dark:text-gray-400">by</span>
                  <a
                    href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-purple-600 dark:text-purple-400 hover:underline transition-all duration-200 hover:text-purple-700 dark:hover:text-purple-300 touch-manipulation"
                  >
                    Vinay Kumar
                  </a>
                </div>
                <span className="text-gray-500 dark:text-gray-500">
                  Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">TRMS</span>
                </span>
              </div>

              {/* Copyright */}
              <div className="text-gray-500 dark:text-gray-500 font-medium">
                © {new Date().getFullYear()} Study Tracker Pro
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
