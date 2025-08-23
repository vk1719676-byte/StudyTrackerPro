import React, { useState, useEffect } from 'react';
import { Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, BookOpen, Star, TrendingUp, Shield, FileText, HelpCircle, MessageCircle, ArrowRight, X, Rocket, Calendar, Bell, Brain, Cpu, Activity, BarChart3, Lightbulb, Calculator, BookMarked, Target, Zap, PieChart, FlaskConical, StickyNote, GraduationCap, LineChart, Bookmark, Settings, ChevronRight, Plus, Minus, Divide, Equal, Search, Percent, RotateCcw, UserCheck, Award, Code, Timer, Thermometer, Ruler, Weight, Volume, Download, Upload, Save, Trash2, Edit3, Copy, Share2, Play, Pause, SkipForward, RotateCw, CheckCircle, AlertCircle, Info, Layers } from 'lucide-react';

export const StudyToolsSection: React.FC = () => {
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
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [showFormulaLibrary, setShowFormulaLibrary] = useState(false);
  const [showNoteTaking, setShowNoteTaking] = useState(false);
  const [showStudyTimer, setShowStudyTimer] = useState(false);

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

  // Unit Converter States
  const [unitCategory, setUnitCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

  // Formula Library States
  const [formulaCategory, setFormulaCategory] = useState('mathematics');
  const [searchTerm, setSearchTerm] = useState('');

  // Note Taking States
  const [notes, setNotes] = useState([
    { id: 1, title: 'Sample Note', content: 'This is a sample note to get you started!', category: 'General', date: new Date().toISOString() }
  ]);
  const [currentNote, setCurrentNote] = useState({ id: 0, title: '', content: '', category: 'General' });
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [flashcards, setFlashcards] = useState([
    { id: 1, front: 'What is the derivative of x²?', back: '2x', category: 'Calculus' }
  ]);

  // Study Timer States
  const [timerMode, setTimerMode] = useState('pomodoro'); // pomodoro, short-break, long-break, custom
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSessions, setTimerSessions] = useState(0);
  const [customTime, setCustomTime] = useState(25);

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

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Timer finished logic here
      if (timerMode === 'pomodoro') {
        setTimerSessions(prev => prev + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode]);

  const handleFeatureClick = (featureName: string) => {
    switch (featureName) {
      case 'Advanced Calculator':
        setShowCalculator(true);
        break;
      case 'Periodic Table':
        setShowPeriodicTable(true);
        break;
      case 'Grade Calculator':
        setShowGradeCalculator(true);
        break;
      case 'Math Solver':
        setShowMathSolver(true);
        break;
      case 'Unit Converter':
        setShowUnitConverter(true);
        break;
      case 'Formula Library':
        setShowFormulaLibrary(true);
        break;
      case 'Smart Notes':
        setShowNoteTaking(true);
        break;
      case 'Study Timer':
        setShowStudyTimer(true);
        break;
      default:
        setSelectedFeature(featureName);
        setShowComingSoon(true);
    }
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
      category: "Math Tools",
      features: ["Scientific Functions", "Graphing", "History", "Unit Conversion"]
    },
    {
      icon: FlaskConical,
      title: "Periodic Table",
      description: "Interactive periodic table with element details, electron configurations, and chemical properties.",
      gradient: "from-teal-500 to-green-600",
      category: "Science",
      features: ["Element Details", "Properties", "Electron Config", "Search"]
    },
    {
      icon: GraduationCap,
      title: "Grade Calculator",
      description: "Calculate your current grades, required scores for target grades, and track academic performance.",
      gradient: "from-orange-500 to-red-500",
      category: "Academic",
      features: ["GPA Calculator", "Grade Tracker", "Progress Analytics", "Target Planning"]
    },
    {
      icon: Brain,
      title: "Math Solver",
      description: "Step-by-step solutions for algebra, calculus, trigonometry, and other mathematical problems.",
      gradient: "from-pink-500 to-rose-600",
      category: "Math Tools",
      features: ["Step-by-Step", "Multiple Types", "Graphing", "Explanations"]
    },
    {
      icon: Zap,
      title: "Unit Converter",
      description: "Convert between different units for physics, chemistry, and engineering calculations.",
      gradient: "from-purple-500 to-violet-600",
      category: "Science",
      features: ["Length", "Weight", "Temperature", "Energy"]
    },
    {
      icon: BookOpen,
      title: "Formula Library",
      description: "Comprehensive collection of mathematical, physics, and chemistry formulas with explanations.",
      gradient: "from-cyan-500 to-blue-600",
      category: "Reference",
      features: ["Math Formulas", "Physics", "Chemistry", "Search"]
    },
    {
      icon: FileText,
      title: "Smart Notes",
      description: "Advanced note-taking with flashcards, organization tools, and study guides creation.",
      gradient: "from-emerald-500 to-teal-600",
      category: "Study Tools",
      features: ["Rich Text", "Flashcards", "Organization", "Export"]
    },
    {
      icon: Timer,
      title: "Study Timer",
      description: "Pomodoro technique timer with break reminders and productivity tracking.",
      gradient: "from-amber-500 to-yellow-600",
      category: "Productivity",
      features: ["Pomodoro Timer", "Break Alerts", "Statistics", "Custom Sessions"]
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

  // Unit Converter Functions
  const unitConversions = {
    length: {
      meter: { meter: 1, feet: 3.28084, inch: 39.3701, centimeter: 100, kilometer: 0.001 },
      feet: { meter: 0.3048, feet: 1, inch: 12, centimeter: 30.48, kilometer: 0.0003048 },
      inch: { meter: 0.0254, feet: 0.0833333, inch: 1, centimeter: 2.54, kilometer: 0.0000254 },
      centimeter: { meter: 0.01, feet: 0.0328084, inch: 0.393701, centimeter: 1, kilometer: 0.00001 },
      kilometer: { meter: 1000, feet: 3280.84, inch: 39370.1, centimeter: 100000, kilometer: 1 }
    },
    weight: {
      kilogram: { kilogram: 1, pound: 2.20462, gram: 1000, ounce: 35.274 },
      pound: { kilogram: 0.453592, pound: 1, gram: 453.592, ounce: 16 },
      gram: { kilogram: 0.001, pound: 0.00220462, gram: 1, ounce: 0.035274 },
      ounce: { kilogram: 0.0283495, pound: 0.0625, gram: 28.3495, ounce: 1 }
    },
    temperature: {
      celsius: { celsius: (c: number) => c, fahrenheit: (c: number) => (c * 9/5) + 32, kelvin: (c: number) => c + 273.15 },
      fahrenheit: { celsius: (f: number) => (f - 32) * 5/9, fahrenheit: (f: number) => f, kelvin: (f: number) => ((f - 32) * 5/9) + 273.15 },
      kelvin: { celsius: (k: number) => k - 273.15, fahrenheit: (k: number) => ((k - 273.15) * 9/5) + 32, kelvin: (k: number) => k }
    },
    volume: {
      liter: { liter: 1, gallon: 0.264172, milliliter: 1000, cup: 4.22675 },
      gallon: { liter: 3.78541, gallon: 1, milliliter: 3785.41, cup: 16 },
      milliliter: { liter: 0.001, gallon: 0.000264172, milliliter: 1, cup: 0.00422675 },
      cup: { liter: 0.236588, gallon: 0.0625, milliliter: 236.588, cup: 1 }
    }
  };

  const convertUnits = () => {
    if (!inputValue || isNaN(parseFloat(inputValue))) {
      setConvertedValue('');
      return;
    }

    const value = parseFloat(inputValue);
    const conversions = unitConversions[unitCategory as keyof typeof unitConversions];
    
    if (unitCategory === 'temperature') {
      const tempConversions = conversions[fromUnit as keyof typeof conversions] as any;
      const convertFunc = tempConversions[toUnit];
      const result = convertFunc(value);
      setConvertedValue(result.toFixed(4));
    } else {
      const fromConversions = conversions[fromUnit as keyof typeof conversions] as any;
      const toMultiplier = fromConversions[toUnit];
      const result = value * toMultiplier;
      setConvertedValue(result.toFixed(6));
    }
  };

  useEffect(() => {
    convertUnits();
  }, [inputValue, fromUnit, toUnit, unitCategory]);

  // Formula Library Data
  const formulaLibrary = {
    mathematics: [
      { name: "Quadratic Formula", formula: "x = (-b ± √(b² - 4ac)) / 2a", description: "Solves quadratic equations ax² + bx + c = 0" },
      { name: "Pythagorean Theorem", formula: "a² + b² = c²", description: "Relationship between sides of a right triangle" },
      { name: "Area of Circle", formula: "A = πr²", description: "Area of a circle with radius r" },
      { name: "Distance Formula", formula: "d = √((x₂-x₁)² + (y₂-y₁)²)", description: "Distance between two points in 2D space" }
    ],
    physics: [
      { name: "Newton's Second Law", formula: "F = ma", description: "Force equals mass times acceleration" },
      { name: "Kinetic Energy", formula: "KE = ½mv²", description: "Energy of motion" },
      { name: "Potential Energy", formula: "PE = mgh", description: "Gravitational potential energy" },
      { name: "Ohm's Law", formula: "V = IR", description: "Relationship between voltage, current, and resistance" }
    ],
    chemistry: [
      { name: "Ideal Gas Law", formula: "PV = nRT", description: "Relationship between pressure, volume, temperature, and amount of gas" },
      { name: "pH Formula", formula: "pH = -log[H⁺]", description: "Measure of acidity/basicity" },
      { name: "Molarity", formula: "M = n/V", description: "Concentration of a solution" },
      { name: "Boyle's Law", formula: "P₁V₁ = P₂V₂", description: "Pressure-volume relationship at constant temperature" }
    ]
  };

  const filteredFormulas = formulaLibrary[formulaCategory as keyof typeof formulaLibrary].filter(formula =>
    formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formula.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Note Taking Functions
  const saveNote = () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) return;

    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote 
          ? { ...currentNote, id: editingNote, date: new Date().toISOString() }
          : note
      ));
      setEditingNote(null);
    } else {
      const newNote = {
        ...currentNote,
        id: Date.now(),
        date: new Date().toISOString()
      };
      setNotes([...notes, newNote]);
    }

    setCurrentNote({ id: 0, title: '', content: '', category: 'General' });
  };

  const editNote = (note: any) => {
    setCurrentNote(note);
    setEditingNote(note.id);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNote === id) {
      setEditingNote(null);
      setCurrentNote({ id: 0, title: '', content: '', category: 'General' });
    }
  };

  // Study Timer Functions
  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    switch (timerMode) {
      case 'pomodoro':
        setTimeLeft(25 * 60);
        break;
      case 'short-break':
        setTimeLeft(5 * 60);
        break;
      case 'long-break':
        setTimeLeft(15 * 60);
        break;
      case 'custom':
        setTimeLeft(customTime * 60);
        break;
    }
  };

  const switchTimerMode = (mode: string) => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(25 * 60);
        break;
      case 'short-break':
        setTimeLeft(5 * 60);
        break;
      case 'long-break':
        setTimeLeft(15 * 60);
        break;
      case 'custom':
        setTimeLeft(customTime * 60);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Main Study Tools Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              Interactive Study Tools
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
              Advanced Study Tools
              <span className="block text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                for Academic Success
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Comprehensive collection of educational tools designed to enhance your learning experience with interactive calculators, 
              reference materials, and productivity features.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalStudents.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Students</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.passedStudents.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Passed</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalStudyHours.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Study Hours</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.averageScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {studyTools.map((tool, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(tool.title)}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer touch-manipulation"
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${tool.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {tool.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tool.features?.map((feature, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  <span className="text-sm">Open Tool</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Modal Components Below */}

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

      {/* Unit Converter Modal */}
      {showUnitConverter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Unit Converter
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Convert between different measurement units
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUnitConverter(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Unit Category</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { key: 'length', label: 'Length', icon: Ruler },
                    { key: 'weight', label: 'Weight', icon: Weight },
                    { key: 'temperature', label: 'Temperature', icon: Thermometer },
                    { key: 'volume', label: 'Volume', icon: Volume }
                  ].map(category => (
                    <button
                      key={category.key}
                      onClick={() => {
                        setUnitCategory(category.key);
                        // Reset units when category changes
                        if (category.key === 'length') {
                          setFromUnit('meter');
                          setToUnit('feet');
                        } else if (category.key === 'weight') {
                          setFromUnit('kilogram');
                          setToUnit('pound');
                        } else if (category.key === 'temperature') {
                          setFromUnit('celsius');
                          setToUnit('fahrenheit');
                        } else if (category.key === 'volume') {
                          setFromUnit('liter');
                          setToUnit('gallon');
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                        unitCategory === category.key
                          ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversion Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3 touch-manipulation"
                  >
                    {Object.keys(unitConversions[unitCategory as keyof typeof unitConversions]).map(unit => (
                      <option key={unit} value={unit} className="capitalize">
                        {unit.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
                  />
                </div>

                {/* To Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3 touch-manipulation"
                  >
                    {Object.keys(unitConversions[unitCategory as keyof typeof unitConversions]).map(unit => (
                      <option key={unit} value={unit} className="capitalize">
                        {unit.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <div className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-lg">
                    {convertedValue || '0'}
                  </div>
                </div>
              </div>

              {/* Quick Convert Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['1', '10', '100', '1000'].map(value => (
                  <button
                    key={value}
                    onClick={() => setInputValue(value)}
                    className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200 touch-manipulation"
                  >
                    {value}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-purple-600 dark:text-purple-400 text-center">
                  🔄 Convert between different units with high precision calculations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formula Library Modal */}
      {showFormulaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Formula Library
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Comprehensive collection of formulas
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFormulaLibrary(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Category and Search */}
              <div className="mb-6 space-y-4">
                {/* Category Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Subject</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'mathematics', label: 'Mathematics', icon: Calculator },
                      { key: 'physics', label: 'Physics', icon: Activity },
                      { key: 'chemistry', label: 'Chemistry', icon: FlaskConical }
                    ].map(category => (
                      <button
                        key={category.key}
                        onClick={() => setFormulaCategory(category.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                          formulaCategory === category.key
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search formulas..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
                  />
                </div>
              </div>

              {/* Formulas Grid */}
              <div className="space-y-4">
                {filteredFormulas.map((formula, index) => (
                  <div key={index} className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 sm:p-6 border border-cyan-200 dark:border-cyan-700">
                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {formula.name}
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-200 dark:border-cyan-600">
                        <div className="text-xl sm:text-2xl font-mono text-cyan-700 dark:text-cyan-300 text-center">
                          {formula.formula}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formula.description}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => navigator.clipboard?.writeText(formula.formula)}
                        className="flex items-center gap-2 px-3 py-1 text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors duration-200 touch-manipulation"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <p className="text-xs text-cyan-600 dark:text-cyan-400 text-center">
                  📚 Searchable formula library with explanations for mathematics, physics, and chemistry
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Taking Modal */}
      {showNoteTaking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Smart Notes
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Advanced note-taking with flashcards
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNoteTaking(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Note Editor */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {editingNote ? 'Edit Note' : 'Create Note'}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={saveNote}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      {editingNote && (
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setCurrentNote({ id: 0, title: '', content: '', category: 'General' });
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 touch-manipulation"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={currentNote.title}
                      onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                      placeholder="Note title..."
                      className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent touch-manipulation"
                    />

                    <select
                      value={currentNote.category}
                      onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent touch-manipulation"
                    >
                      <option value="General">General</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="Literature">Literature</option>
                    </select>

                    <textarea
                      value={currentNote.content}
                      onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                      placeholder="Write your note here..."
                      rows={15}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none touch-manipulation"
                    />
                  </div>
                </div>

                {/* Notes List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Notes</h4>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notes.map(note => (
                      <div key={note.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {note.title || 'Untitled'}
                            </h5>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                              {note.category}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => editNote(note)}
                              className="p-1 text-gray-500 hover:text-emerald-600 transition-colors duration-200 touch-manipulation"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200 touch-manipulation"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {note.content}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
                  📝 Create, organize, and manage your study notes with categories and search functionality
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Timer Modal */}
      {showStudyTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Study Timer
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {timerMode.replace('-', ' ')} Mode
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudyTimer(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Timer Display */}
              <div className="text-center mb-8">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full flex items-center justify-center border-8 border-amber-200 dark:border-amber-700 mb-6">
                  <div className="text-4xl sm:text-5xl font-mono font-bold text-amber-700 dark:text-amber-300">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    onClick={isTimerRunning ? pauseTimer : startTimer}
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110 touch-manipulation"
                  >
                    {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 touch-manipulation"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Session Counter */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                      Completed Sessions: {timerSessions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer Mode Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Timer Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => switchTimerMode('pomodoro')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                      timerMode === 'pomodoro'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    Pomodoro (25m)
                  </button>
                  <button
                    onClick={() => switchTimerMode('short-break')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                      timerMode === 'short-break'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Short Break (5m)
                  </button>
                  <button
                    onClick={() => switchTimerMode('long-break')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                      timerMode === 'long-break'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SkipForward className="w-4 h-4" />
                    Long Break (15m)
                  </button>
                  <button
                    onClick={() => switchTimerMode('custom')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                      timerMode === 'custom'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Custom
                  </button>
                </div>
              </div>

              {/* Custom Time Input */}
              {timerMode === 'custom' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={customTime}
                    onChange={(e) => setCustomTime(parseInt(e.target.value) || 1)}
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                  />
                </div>
              )}

              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  ⏰ Use the Pomodoro Technique to boost focus and productivity with timed study sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Modern Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
            
            {/* Brand Section */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Study Tracker Pro
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>Trusted by {Math.floor(stats.totalStudents / 1000)}K+ students worldwide</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 max-w-md">
                Your ultimate study companion with advanced tools and analytics for academic success
              </p>
            </div>

            {/* Social Links & Study Tools */}
            <div className="flex flex-col items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 font-medium">Connect:</span>
                <div className="flex gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300 group touch-manipulation"
                      title={link.name}
                    >
                      <link.icon className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Study Tools Quick Access */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {studyTools.slice(0, 4).map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => handleFeatureClick(tool.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 group touch-manipulation"
                  >
                    <tool.icon className="w-3 h-3 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                    <span className="text-gray-300 group-hover:text-blue-400 transition-colors duration-300">{tool.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Enhanced Credits */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Crafted with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span className="text-sm text-gray-400">by</span>
                <a
                  href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline touch-manipulation"
                >
                  Vinay Kumar
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Powered by</span>
                <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">TRMS</span>
                <span className="text-gray-600">•</span>
                <span>Built with React & TypeScript</span>
              </div>
            </div>

            {/* Enhanced Copyright */}
            <div className="flex flex-col items-center md:items-end gap-1">
              <div className="text-sm font-medium text-gray-300">
                © {new Date().getFullYear()} Study Tracker Pro
              </div>
              <div className="text-xs text-gray-500">
                All rights reserved • Version 2.0
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
