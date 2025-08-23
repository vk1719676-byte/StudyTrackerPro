import React, { useState, useEffect } from 'react';
import { 
  Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, 
  BookOpen, Star, TrendingUp, Lightbulb, Calculator, FlaskConical, 
  GraduationCap, Brain, Code, ArrowRight, Zap, 
  Target, Activity, Rocket, X, Plus, Minus, RotateCcw,
  MapPin, ExternalLink, Sparkles, Globe, Timer, CheckCircle,
  Share2, Bookmark, ChevronRight, Award, Cpu, Palette,
  Coffee, Music, GameController2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 12847,
    passedStudents: 9234,
    totalStudyHours: 156789,
    averageScore: 87.5,
    toolsUsed: 45632,
    countriesReached: 78,
    activeNow: 1247
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

  // Calculator state
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  // Grade Calculator States
  const [grades, setGrades] = useState([
    { subject: '', currentGrade: '', creditHours: '', targetGrade: '' }
  ]);
  const [currentGPA, setCurrentGPA] = useState(0);

  // Math Solver States
  const [mathExpression, setMathExpression] = useState('');
  const [mathSolution, setMathSolution] = useState('');
  const [mathSteps, setMathSteps] = useState<string[]>([]);
  const [mathType, setMathType] = useState('algebra');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced state for animations
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [animatingStats, setAnimatingStats] = useState(false);

  // Enhanced social links with more details
  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@studytrackerpro',
      icon: Youtube,
      color: 'text-red-500',
      bgColor: 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/20 dark:to-red-800/20',
      description: 'Educational tutorials & study tips',
      subscribers: '25.3K',
      gradient: 'from-red-500 to-red-600'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20',
      description: 'Professional network & updates',
      subscribers: '12.8K',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Vinayk2007',
      icon: Github,
      color: 'text-gray-800 dark:text-gray-200',
      bgColor: 'from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800/20 dark:to-gray-700/20',
      description: 'Open source projects & code',
      subscribers: '8.9K',
      gradient: 'from-gray-600 to-gray-800'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/studytrackerpro',
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20',
      description: 'Community chat & instant updates',
      subscribers: '15.7K',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  // Enhanced study tools with more details
  const studyTools = [
    {
      icon: Calculator,
      title: "Advanced Calculator",
      description: "Scientific calculator with history, graphing capabilities, unit conversions, and mathematical functions for complex calculations.",
      gradient: "from-blue-500 to-indigo-600",
      category: "Math Tools",
      isNew: false,
      popularity: 95,
      features: ["Scientific Functions", "History", "Graphing", "Unit Conversion"]
    },
    {
      icon: FlaskConical,
      title: "Periodic Table",
      description: "Interactive periodic table with detailed element properties, electron configurations, and chemical reaction simulator.",
      gradient: "from-teal-500 to-green-600",
      category: "Science",
      isNew: false,
      popularity: 88,
      features: ["Element Details", "Reactions", "3D Models", "Trends"]
    },
    {
      icon: GraduationCap,
      title: "Grade Calculator",
      description: "Comprehensive GPA calculator with semester tracking, grade predictions, and academic performance analytics.",
      gradient: "from-orange-500 to-red-500",
      category: "Academic",
      isNew: false,
      popularity: 92,
      features: ["GPA Tracking", "Predictions", "Analytics", "Goals"]
    },
    {
      icon: Brain,
      title: "AI Math Solver",
      description: "Revolutionary AI-powered step-by-step solutions for algebra, calculus, statistics, and advanced mathematics.",
      gradient: "from-pink-500 to-rose-600",
      category: "AI Tools",
      isNew: true,
      popularity: 97,
      features: ["Step-by-Step", "Multiple Methods", "Graph Analysis", "AI Explanations"]
    },
    {
      icon: Code,
      title: "Code Playground",
      description: "Multi-language code editor with real-time collaboration, syntax highlighting, and project sharing capabilities.",
      gradient: "from-purple-500 to-indigo-600",
      category: "Programming",
      isNew: true,
      popularity: 89,
      features: ["Multi-Language", "Collaboration", "Sharing", "Templates"]
    },
    {
      icon: Palette,
      title: "Design Studio",
      description: "Creative design tools for presentations, infographics, mind maps, and visual learning materials.",
      gradient: "from-emerald-500 to-teal-600",
      category: "Design",
      isNew: true,
      popularity: 85,
      features: ["Templates", "Collaboration", "Export", "AI Design"]
    }
  ];

  // Simulate real-time stats updates with enhanced animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingStats(true);
      setStats(prev => ({
        totalStudents: prev.totalStudents + Math.floor(Math.random() * 5),
        passedStudents: prev.passedStudents + Math.floor(Math.random() * 3),
        totalStudyHours: prev.totalStudyHours + Math.floor(Math.random() * 15),
        averageScore: Math.max(85, Math.min(95, prev.averageScore + (Math.random() - 0.5) * 0.8)),
        toolsUsed: prev.toolsUsed + Math.floor(Math.random() * 8),
        countriesReached: Math.min(195, prev.countriesReached + (Math.random() > 0.92 ? 1 : 0)),
        activeNow: Math.max(800, Math.min(2000, prev.activeNow + Math.floor((Math.random() - 0.5) * 50)))
      }));
      
      setTimeout(() => setAnimatingStats(false), 500);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      case 'AI Math Solver':
        setShowMathSolver(true);
        break;
      default:
        setSelectedFeature(featureName);
        setShowComingSoon(true);
    }
  };

  // Calculator functions (enhanced)
  const performCalculation = (firstValue: number, operator: string, secondValue: number): number => {
    switch (operator) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%': return firstValue % secondValue;
      case '^': return Math.pow(firstValue, secondValue);
      default: return secondValue;
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

    if (input === '√') {
      const result = Math.sqrt(currentValue);
      setCalculatorDisplay(result.toString());
      setCalculatorHistory(prev => [...prev.slice(-4), `√${currentValue} = ${result}`]);
      return;
    }

    if (input === 'sin' || input === 'cos' || input === 'tan') {
      const radians = currentValue * (Math.PI / 180);
      let result = 0;
      if (input === 'sin') result = Math.sin(radians);
      if (input === 'cos') result = Math.cos(radians);
      if (input === 'tan') result = Math.tan(radians);
      setCalculatorDisplay(result.toString());
      setCalculatorHistory(prev => [...prev.slice(-4), `${input}(${currentValue}°) = ${result}`]);
      return;
    }

    if (['+', '-', '×', '÷', '%', '^'].includes(input)) {
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

    if (waitingForNewValue) {
      setCalculatorDisplay(input);
      setWaitingForNewValue(false);
    } else {
      setCalculatorDisplay(calculatorDisplay === '0' ? input : calculatorDisplay + input);
    }
  };

  const calculatorButtons = [
    ['C', '√', '^', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', 'sin', '='],
    ['cos', 'tan', 'π', 'e']
  ];

  // Enhanced periodic table elements
  const periodicElements = [
    { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, category: 'nonmetal', description: 'Lightest element, essential for life' },
    { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, category: 'noble-gas', description: 'Inert gas, used in balloons' },
    { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, category: 'alkali-metal', description: 'Soft metal, used in batteries' },
    { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, category: 'alkaline-earth', description: 'Light, strong metal' },
    { symbol: 'B', name: 'Boron', number: 5, mass: 10.811, category: 'metalloid', description: 'Semiconductor properties' },
    { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011, category: 'nonmetal', description: 'Basis of organic chemistry' },
    { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007, category: 'nonmetal', description: '78% of Earth\'s atmosphere' },
    { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999, category: 'nonmetal', description: 'Essential for respiration' },
    { symbol: 'F', name: 'Fluorine', number: 9, mass: 18.998, category: 'halogen', description: 'Most reactive element' },
    { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.180, category: 'noble-gas', description: 'Used in neon signs' }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'nonmetal': 'bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-yellow-300',
      'noble-gas': 'bg-purple-400 hover:bg-purple-500 text-white border-purple-300',
      'alkali-metal': 'bg-red-400 hover:bg-red-500 text-white border-red-300',
      'alkaline-earth': 'bg-orange-400 hover:bg-orange-500 text-white border-orange-300',
      'metalloid': 'bg-green-400 hover:bg-green-500 text-white border-green-300',
      'halogen': 'bg-blue-400 hover:bg-blue-500 text-white border-blue-300',
    };
    return colors[category] || 'bg-gray-400 hover:bg-gray-500 text-white border-gray-300';
  };

  // Grade calculator functions (enhanced)
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

  // Math solver function (enhanced)
  const solveMathProblem = async () => {
    if (!mathExpression.trim()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (mathType === 'algebra' && mathExpression.includes('=')) {
        setMathSolution('x = 5, y = 3');
        setMathSteps([
          'Original equation: 2x + 3y = 19',
          'Substitution method applied',
          'From first equation: x = (19 - 3y) / 2',
          'Substitute into second equation',
          'Solve for y: y = 3',
          'Substitute back: x = 5'
        ]);
      } else if (mathType === 'calculus') {
        setMathSolution('f\'(x) = 6x + 4');
        setMathSteps([
          'Function: f(x) = 3x² + 4x + 1',
          'Apply power rule: d/dx[x^n] = nx^(n-1)',
          'Derivative of 3x²: 6x',
          'Derivative of 4x: 4',
          'Derivative of constant: 0',
          'Result: f\'(x) = 6x + 4'
        ]);
      } else {
        setMathSolution('42');
        setMathSteps(['Evaluating expression...', 'Applying mathematical operations', 'Result: 42']);
      }
    } catch (error) {
      setMathSolution('Error solving problem');
      setMathSteps(['Please check your expression']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modals - Enhanced */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
            <div className="p-8 text-center">
              <button 
                onClick={() => setShowComingSoon(false)} 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Coming Soon!</h3>
              <p className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">{selectedFeature}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">We're working hard to bring you this amazing feature. Stay tuned for updates!</p>
              <button 
                onClick={() => setShowComingSoon(false)} 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-4 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Notify Me When Ready
              </button>
            </div>
          </div>
        </div>
      )}

      {showCalculator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Advanced Calculator
                </h3>
                <button onClick={() => setShowCalculator(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-6 shadow-inner">
                <div className="text-right text-3xl font-mono font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {calculatorDisplay}
                </div>
                <div className="text-xs text-gray-500 text-right">
                  Mode: {calculatorMode}
                </div>
              </div>

              {calculatorHistory.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4 max-h-20 overflow-y-auto">
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    {calculatorHistory.slice(-3).map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {calculatorButtons.map((row, rowIndex) => 
                  row.map((button, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCalculatorInput(button)}
                      className={`h-12 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                        button === '=' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : ['÷', '×', '-', '+', '^'].includes(button)
                          ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md'
                          : ['sin', 'cos', 'tan', '√', 'π', 'e'].includes(button)
                          ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-md text-xs'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {button}
                    </button>
                  ))
                )}
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => setCalculatorHistory([])}
                  className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg py-2 hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  Clear History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPeriodicTable && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                  Interactive Periodic Table
                </h3>
                <button onClick={() => setShowPeriodicTable(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-10 gap-2 mb-6">
                {periodicElements.map(element => (
                  <div
                    key={element.symbol}
                    className={`w-16 h-16 flex flex-col justify-center items-center rounded-xl cursor-pointer transition-all transform hover:scale-110 border-2 ${getCategoryColor(element.category)}`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="text-xs font-semibold">{element.number}</div>
                    <div className="text-lg font-bold">{element.symbol}</div>
                  </div>
                ))}
              </div>

              {selectedElement && (
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-700">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${getCategoryColor(selectedElement.category)}`}>
                      {selectedElement.symbol}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{selectedElement.name}</h4>
                      <p className="text-teal-600 dark:text-teal-400 capitalize mb-3">{selectedElement.category.replace('-', ' ')}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Atomic Number:</span> {selectedElement.number}
                        </div>
                        <div>
                          <span className="font-semibold">Atomic Mass:</span> {selectedElement.mass}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-3 italic">{selectedElement.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showGradeCalculator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Grade Calculator
                </h3>
                <button onClick={() => setShowGradeCalculator(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 mb-6 text-center border border-orange-200 dark:border-orange-700">
                <h4 className="text-lg font-semibold mb-2 text-orange-800 dark:text-orange-200">Current GPA</h4>
                <div className="text-4xl font-bold text-orange-600 mb-2">{currentGPA.toFixed(2)}</div>
                <div className="flex items-center justify-center gap-2">
                  <Star className={`w-5 h-5 ${currentGPA >= 3.5 ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentGPA >= 3.8 ? 'Excellent!' : currentGPA >= 3.5 ? 'Good' : currentGPA >= 3.0 ? 'Average' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {grades.map((grade, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Subject (e.g., Mathematics)"
                      value={grade.subject}
                      onChange={(e) => updateGrade(index, 'subject', e.target.value)}
                      className="px-4 py-3 border-2 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Grade (0-4.0)"
                      value={grade.currentGrade}
                      onChange={(e) => updateGrade(index, 'currentGrade', e.target.value)}
                      className="px-4 py-3 border-2 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                      step="0.1"
                      min="0"
                      max="4"
                    />
                    <input
                      type="number"
                      placeholder="Credit Hours"
                      value={grade.creditHours}
                      onChange={(e) => updateGrade(index, 'creditHours', e.target.value)}
                      className="px-4 py-3 border-2 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                      min="1"
                      max="6"
                    />
                  </div>
                  {grades.length > 1 && (
                    <button 
                      onClick={() => removeGrade(index)} 
                      className="mt-3 text-red-500 text-sm hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <Minus className="w-4 h-4" />
                      Remove Course
                    </button>
                  )}
                </div>
              ))}

              <button 
                onClick={addGrade} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl mb-4 font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {showMathSolver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  AI Math Solver
                </h3>
                <button onClick={() => setShowMathSolver(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {[
                    { type: 'algebra', label: 'Algebra', icon: Target },
                    { type: 'calculus', label: 'Calculus', icon: Activity },
                    { type: 'geometry', label: 'Geometry', icon: Cpu }
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setMathType(type)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                        mathType === type 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg' 
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mathExpression}
                    onChange={(e) => setMathExpression(e.target.value)}
                    placeholder="Enter math expression (e.g., 2x + 5 = 15)"
                    className="flex-1 px-4 py-3 border-2 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={solveMathProblem}
                    disabled={isLoading || !mathExpression.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl disabled:opacity-50 font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Solving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Solve
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {mathSolution && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-700">
                  <h4 className="font-bold mb-3 text-pink-800 dark:text-pink-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Solution
                  </h4>
                  <div className="text-2xl font-bold text-pink-600 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-pink-200">
                    {mathSolution}
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300">Step-by-step solution:</h5>
                    {mathSteps.map((step, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-pink-100 dark:border-pink-800">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-700 mt-12 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Enhanced Live Stats Banner */}
        <div className="relative bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-indigo-600/15 dark:from-purple-600/25 dark:via-blue-600/25 dark:to-indigo-600/25 border-b border-purple-200/40 dark:border-purple-700/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Empowering Global Education
                </h3>
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" style={{animationDuration: '4s'}} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4" />
                Live updates • Last updated: {currentTime.toLocaleTimeString()}
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    {stats.activeNow.toLocaleString()} online now
                  </span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Growing fast</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                {
                  icon: Users,
                  label: 'Students',
                  value: `${(stats.totalStudents / 1000).toFixed(1)}K+`,
                  color: 'purple',
                  key: 'students'
                },
                {
                  icon: Trophy,
                  label: 'Success',
                  value: `${(stats.passedStudents / 1000).toFixed(1)}K+`,
                  color: 'yellow',
                  key: 'success'
                },
                {
                  icon: Clock,
                  label: 'Study Hours',
                  value: `${(stats.totalStudyHours / 1000).toFixed(0)}K+`,
                  color: 'blue',
                  key: 'hours'
                },
                {
                  icon: Star,
                  label: 'Avg Score',
                  value: `${stats.averageScore.toFixed(1)}%`,
                  color: 'green',
                  key: 'score'
                },
                {
                  icon: Zap,
                  label: 'Tools Used',
                  value: `${(stats.toolsUsed / 1000).toFixed(0)}K+`,
                  color: 'orange',
                  key: 'tools'
                },
                {
                  icon: Globe,
                  label: 'Countries',
                  value: `${stats.countriesReached}+`,
                  color: 'indigo',
                  key: 'countries'
                },
                {
                  icon: Activity,
                  label: 'Online Now',
                  value: `${(stats.activeNow / 1000).toFixed(1)}K`,
                  color: 'emerald',
                  key: 'active'
                }
              ].map(({ icon: Icon, label, value, color, key }) => (
                <div
                  key={key}
                  className={`bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 text-center backdrop-blur-sm border-2 border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    hoveredStat === key ? 'scale-105 shadow-xl' : ''
                  } ${animatingStats ? 'animate-pulse' : ''}`}
                  onMouseEnter={() => setHoveredStat(key)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                    <span className={`text-lg font-bold text-${color}-800 dark:text-${color}-300`}>
                      {value}
                    </span>
                  </div>
                  <p className={`text-xs text-${color}-600 dark:text-${color}-400 font-medium`}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Study Tools Section */}
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                🚀 Advanced Study Tools Suite
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powerful AI-driven tools designed to enhance your learning experience and boost academic performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyTools.map((tool, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-500 relative"
                  onClick={() => handleFeatureClick(tool.title)}
                >
                  {/* Popularity indicator */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{tool.popularity}%</span>
                    </div>
                  </div>
                  
                  {/* Gradient header */}
                  <div className={`h-3 bg-gradient-to-r ${tool.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                            {tool.title}
                          </h3>
                          {tool.isNew && (
                            <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${tool.gradient} text-white/90`}>
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    {/* Features list */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 3).map((feature, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                            +{tool.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button className={`w-full px-4 py-3 bg-gradient-to-r ${tool.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105`}>
                      <span>Launch Tool</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Social Connect Section */}
        <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-cyan-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                🌐 Join Our Global Community
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Connect with thousands of students worldwide. Get updates, tips, and exclusive content across all platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${link.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <link.icon className={`w-8 h-8 ${link.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {link.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                      {link.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {link.subscribers} followers
                      </span>
                    </div>
                    
                    <div className={`w-full px-4 py-2 bg-gradient-to-r ${link.gradient} text-white font-semibold rounded-xl group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                      <span>Follow</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Enhanced Brand Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Tracker Pro
              </h2>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  v2.1.0
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-bold">
                  2024
                </div>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
              Your ultimate companion for academic success with AI-powered tools, interactive learning resources, 
              and a global community of motivated students.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              {[
                { icon: TrendingUp, text: 'Growing Fast', color: 'purple' },
                { icon: Globe, text: `${stats.countriesReached}+ Countries`, color: 'blue' },
                { icon: Users, text: `${(stats.totalStudents / 1000).toFixed(0)}K+ Students`, color: 'green' },
                { icon: Award, text: 'Award Winning', color: 'orange' },
                { icon: Heart, text: 'Made with Love', color: 'red' }
              ].map(({ icon: Icon, text, color }, index) => (
                <div key={index} className={`flex items-center gap-2 px-4 py-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-full hover:scale-105 transition-transform cursor-default`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                  <span className={`text-${color}-700 dark:text-${color}-300 font-medium`}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="border-t-2 border-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Enhanced Creator Credit */}
              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-gray-600 dark:text-gray-400">Crafted with</span>
                  <Heart className="w-5 h-5 text-red-500 fill-current animate-pulse" />
                  <span className="text-gray-600 dark:text-gray-400">by</span>
                  <a
                    href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-purple-600 dark:text-purple-400 hover:underline transition-all duration-200 hover:scale-110 flex items-center gap-2"
                  >
                    <Code className="w-4 h-4" />
                    Vinay Kumar
                  </a>
                  <span className="text-gray-600 dark:text-gray-400">&</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Rocket className="w-4 h-4" />
                    Team TRMS
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-500">
                  {[
                    { icon: Code, text: 'Open Source', link: '#' },
                    { icon: Award, text: 'Educational Tech', link: '#' },
                    { icon: MapPin, text: 'Made in India 🇮🇳', link: '#' },
                    { icon: Coffee, text: 'Fueled by Coffee', link: '#' }
                  ].map(({ icon: Icon, text, link }, index) => (
                    <a
                      key={index}
                      href={link}
                      className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer group"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{text}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Enhanced Copyright & Actions */}
              <div className="text-center lg:text-right">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  © {new Date().getFullYear()} Study Tracker Pro
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  All rights reserved • Built for students, by students
                </div>
                <div className="flex items-center justify-center lg:justify-end gap-3">
                  {[
                    { icon: Share2, text: 'Share', action: () => {} },
                    { icon: Bookmark, text: 'Bookmark', action: () => {} },
                    { icon: Music, text: 'Study Playlist', action: () => {} },
                    { icon: GameController2, text: 'Study Games', action: () => {} }
                  ].map(({ icon: Icon, text, action }, index) => (
                    <button
                      key={index}
                      onClick={action}
                      className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group"
                    >
                      <Icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Footer;
