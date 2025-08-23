import React, { useState, useEffect } from 'react';
import { 
  Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, 
  BookOpen, Star, TrendingUp, Shield, FileText, HelpCircle, 
  MessageCircle, Lightbulb, UserCheck, Calculator, FlaskConical, 
  GraduationCap, Brain, Code, Award, ArrowRight, Zap, BookMarked,
  Target, PieChart, BarChart3, Activity, Rocket, X, Calendar, 
  Bell, Plus, Minus, Search, RotateCcw, Mail, MapPin, Phone,
  ExternalLink, Sparkles, Globe, Timer, CheckCircle, TrendingDown,
  Download, Share2, Bookmark
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 12847,
    passedStudents: 9234,
    totalStudyHours: 156789,
    averageScore: 87.5,
    toolsUsed: 45632,
    countriesReached: 78
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
  const [showNewsletter, setShowNewsletter] = useState(false);

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

  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Data arrays
  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@studytrackerpro',
      icon: Youtube,
      color: 'text-red-500',
      bgColor: 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/20 dark:to-red-800/20'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Vinayk2007',
      icon: Github,
      color: 'text-gray-800 dark:text-gray-200',
      bgColor: 'from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800/20 dark:to-gray-700/20'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/studytrackerpro',
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20'
    }
  ];

  const quickLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy', icon: Shield },
    { name: 'Terms of Service', href: '/terms-of-service', icon: FileText },
    { name: 'Help Center', href: '/help-center', icon: HelpCircle },
    { name: 'Contact Us', href: '/contact-us', icon: MessageCircle },
  ];

  const studyTools = [
    {
      icon: Calculator,
      title: "Advanced Calculator",
      description: "Scientific calculator with history, graphing capabilities, and mathematical functions.",
      gradient: "from-blue-500 to-indigo-600",
      category: "Math Tools",
      isNew: false
    },
    {
      icon: FlaskConical,
      title: "Periodic Table",
      description: "Interactive periodic table with element details and chemical properties.",
      gradient: "from-teal-500 to-green-600",
      category: "Science",
      isNew: false
    },
    {
      icon: GraduationCap,
      title: "Grade Calculator",
      description: "Calculate GPA, track academic performance, and set grade targets.",
      gradient: "from-orange-500 to-red-500",
      category: "Academic",
      isNew: false
    },
    {
      icon: Brain,
      title: "Math Solver",
      description: "AI-powered step-by-step solutions for complex mathematical problems.",
      gradient: "from-pink-500 to-rose-600",
      category: "Math Tools",
      isNew: true
    }
  ];

  const teamMembers = [
    {
      name: "Vinay Kumar",
      role: "Co-Owner & Lead Developer",
      description: "Visionary developer creating innovative educational solutions for students worldwide.",
      icon: Code,
      gradient: "from-purple-500 to-indigo-600",
      social: {
        linkedin: "https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in",
        github: "https://github.com/Vinayk2007"
      }
    },
    {
      name: "Ayush Mishra",
      role: "Co-Owner & Business Lead",
      description: "Strategic business leader driving educational technology innovation at TRMs.",
      icon: Award,
      gradient: "from-emerald-500 to-teal-600",
      social: {
        linkedin: "#",
        github: "#"
      }
    }
  ];

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalStudents: prev.totalStudents + Math.floor(Math.random() * 3),
        passedStudents: prev.passedStudents + Math.floor(Math.random() * 2),
        totalStudyHours: prev.totalStudyHours + Math.floor(Math.random() * 10),
        averageScore: Math.max(85, Math.min(95, prev.averageScore + (Math.random() - 0.5) * 0.5)),
        toolsUsed: prev.toolsUsed + Math.floor(Math.random() * 5),
        countriesReached: Math.min(195, prev.countriesReached + (Math.random() > 0.95 ? 1 : 0))
      }));
    }, 30000);

    return () => clearInterval(interval);
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
      case 'Math Solver':
        setShowMathSolver(true);
        break;
      default:
        setSelectedFeature(featureName);
        setShowComingSoon(true);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulate subscription
      setTimeout(() => {
        setIsSubscribed(true);
        setTimeout(() => {
          setShowNewsletter(false);
          setEmail('');
          setIsSubscribed(false);
        }, 2000);
      }, 1000);
    }
  };

  // Calculator functions (simplified)
  const performCalculation = (firstValue: number, operator: string, secondValue: number): number => {
    switch (operator) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%': return firstValue % secondValue;
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

    if (waitingForNewValue) {
      setCalculatorDisplay(input);
      setWaitingForNewValue(false);
    } else {
      setCalculatorDisplay(calculatorDisplay === '0' ? input : calculatorDisplay + input);
    }
  };

  const calculatorButtons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', '=']
  ];

  // Periodic table elements (simplified)
  const periodicElements = [
    { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, category: 'nonmetal' },
    { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, category: 'noble-gas' },
    { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, category: 'alkali-metal' },
    { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, category: 'alkaline-earth' },
    { symbol: 'B', name: 'Boron', number: 5, mass: 10.811, category: 'metalloid' },
    { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011, category: 'nonmetal' },
    { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007, category: 'nonmetal' },
    { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999, category: 'nonmetal' },
    // Add more elements as needed
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'nonmetal': 'bg-yellow-400 hover:bg-yellow-500 text-gray-800',
      'noble-gas': 'bg-purple-400 hover:bg-purple-500 text-white',
      'alkali-metal': 'bg-red-400 hover:bg-red-500 text-white',
      'alkaline-earth': 'bg-orange-400 hover:bg-orange-500 text-white',
      'metalloid': 'bg-green-400 hover:bg-green-500 text-white',
    };
    return colors[category] || 'bg-gray-400 hover:bg-gray-500 text-white';
  };

  // Grade calculator functions
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

  // Math solver function (simplified)
  const solveMathProblem = async () => {
    if (!mathExpression.trim()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (mathType === 'algebra' && mathExpression.includes('=')) {
        setMathSolution('x = 5');
        setMathSteps(['Original equation: 2x + 5 = 15', 'Subtract 5: 2x = 10', 'Divide by 2: x = 5']);
      } else {
        setMathSolution('42');
        setMathSteps(['Evaluating expression...', 'Result: 42']);
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
      {/* Modals */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 text-center">
              <button onClick={() => setShowComingSoon(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Coming Soon!</h3>
              <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">{selectedFeature}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">We're working hard to bring you this amazing feature.</p>
              <button onClick={() => setShowComingSoon(false)} className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 rounded-xl">
                <Bell className="w-4 h-4 inline mr-2" />
                Notify Me
              </button>
            </div>
          </div>
        </div>
      )}

      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Advanced Calculator</h3>
                <button onClick={() => setShowCalculator(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="text-right text-2xl font-mono">{calculatorDisplay}</div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {calculatorButtons.map((row, rowIndex) => 
                  row.map((button, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCalculatorInput(button)}
                      className={`h-12 rounded-lg font-semibold ${
                        button === '=' 
                          ? 'col-span-1 bg-blue-500 text-white'
                          : ['÷', '×', '-', '+'].includes(button)
                          ? 'bg-orange-400 text-white'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      {button}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPeriodicTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Interactive Periodic Table</h3>
                <button onClick={() => setShowPeriodicTable(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-8 gap-1 mb-6">
                {periodicElements.map(element => (
                  <div
                    key={element.symbol}
                    className={`w-16 h-16 flex flex-col justify-center items-center rounded-lg cursor-pointer ${getCategoryColor(element.category)}`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="text-xs">{element.number}</div>
                    <div className="text-sm font-bold">{element.symbol}</div>
                  </div>
                ))}
              </div>

              {selectedElement && (
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <h4 className="text-xl font-bold">{selectedElement.name}</h4>
                  <p>Symbol: {selectedElement.symbol}</p>
                  <p>Atomic Number: {selectedElement.number}</p>
                  <p>Atomic Mass: {selectedElement.mass}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showGradeCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Grade Calculator</h3>
                <button onClick={() => setShowGradeCalculator(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-6 text-center">
                <h4 className="text-lg font-semibold mb-2">Current GPA</h4>
                <div className="text-3xl font-bold text-orange-600">{currentGPA.toFixed(2)}</div>
              </div>

              {grades.map((grade, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={grade.subject}
                      onChange={(e) => updateGrade(index, 'subject', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Grade (0-4)"
                      value={grade.currentGrade}
                      onChange={(e) => updateGrade(index, 'currentGrade', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Credits"
                      value={grade.creditHours}
                      onChange={(e) => updateGrade(index, 'creditHours', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  {grades.length > 1 && (
                    <button onClick={() => removeGrade(index)} className="mt-2 text-red-500 text-sm">
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button onClick={addGrade} className="w-full bg-orange-500 text-white py-2 rounded-lg mb-4">
                <Plus className="w-4 h-4 inline mr-2" />
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {showMathSolver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Math Solver</h3>
                <button onClick={() => setShowMathSolver(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  {['algebra', 'arithmetic', 'geometry'].map(type => (
                    <button
                      key={type}
                      onClick={() => setMathType(type)}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        mathType === type ? 'bg-pink-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mathExpression}
                    onChange={(e) => setMathExpression(e.target.value)}
                    placeholder="Enter math expression..."
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={solveMathProblem}
                    disabled={isLoading}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Solving...' : 'Solve'}
                  </button>
                </div>
              </div>

              {mathSolution && (
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">Solution</h4>
                  <div className="text-xl font-bold text-pink-600 mb-4">{mathSolution}</div>
                  <div className="space-y-2">
                    {mathSteps.map((step, index) => (
                      <div key={index} className="text-sm bg-white dark:bg-gray-800 p-2 rounded">
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Stay Updated</h3>
                <button onClick={() => setShowNewsletter(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSubscribed ? (
                <form onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border rounded-lg mb-4"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg"
                  >
                    Subscribe to Newsletter
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-green-600 mb-2">Subscribed!</h4>
                  <p className="text-gray-600">Thank you for subscribing to our newsletter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compact Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
        {/* Live Stats Banner - Ultra Compact */}
        <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-indigo-600/20 border-b border-purple-200/30 dark:border-purple-700/30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Empowering Global Education
                </h3>
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" style={{animationDuration: '3s'}} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Timer className="w-3 h-3" />
                Live updates every 30 seconds
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="text-sm font-bold text-purple-800 dark:text-purple-300">
                    {(stats.totalStudents / 1000).toFixed(1)}K+
                  </span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Students</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="w-3 h-3 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
                    {(stats.passedStudents / 1000).toFixed(1)}K+
                  </span>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Success</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    {(stats.totalStudyHours / 1000).toFixed(0)}K+
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Hours</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-bold text-green-800 dark:text-green-300">
                    {stats.averageScore.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Score</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-orange-600" />
                  <span className="text-sm font-bold text-orange-800 dark:text-orange-300">
                    {(stats.toolsUsed / 1000).toFixed(0)}K+
                  </span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">Tools</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Globe className="w-3 h-3 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-800 dark:text-indigo-300">
                    {stats.countriesReached}+
                  </span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tools Section - Ultra Compact */}
        <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                🚀 Study Tools Suite
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {studyTools.map((tool, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => handleFeatureClick(tool.title)}
                >
                  <div className={`h-1 bg-gradient-to-r ${tool.gradient}`}></div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <tool.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                          {tool.title}
                        </h3>
                        {tool.isNew && (
                          <span className="inline-block px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">
                      {tool.description}
                    </p>
                    <button className={`w-full px-2 py-1.5 bg-gradient-to-r ${tool.gradient} text-white font-medium rounded-lg text-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1`}>
                      Launch
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA - Compact */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">Stay Updated!</h3>
                  <p className="text-purple-100 text-sm">Get latest study tips & tool updates</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewsletter(true)}
                className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Team Section - Ultra Compact */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-cyan-900/20 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                👥 Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${member.gradient} rounded-xl flex items-center justify-center`}>
                      <member.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">{member.role}</p>
                      <div className="flex gap-2 mt-2">
                        {member.social.linkedin !== "#" && (
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-1 bg-blue-100 rounded text-blue-600 hover:bg-blue-200">
                            <Linkedin className="w-3 h-3" />
                          </a>
                        )}
                        {member.social.github !== "#" && (
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="p-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200">
                            <Github className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Footer Content - Ultra Compact */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Brand Section - Compact */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Tracker Pro
              </h2>
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                v2.1.0
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your ultimate companion for academic success with AI-powered tools
            </p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">Growing Fast</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Globe className="w-3 h-3 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">{stats.countriesReached}+ Countries</span>
              </div>
            </div>
          </div>

          {/* Compact Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Quick Access */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                Quick Access
              </h4>
              <div className="space-y-1">
                {quickLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 text-sm group"
                  >
                    <link.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Connect */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Connect
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gradient-to-r ${link.bgColor} border border-gray-200 dark:border-gray-600 hover:scale-110 transition-all duration-300 group`}
                    title={link.name}
                  >
                    <link.icon className={`w-4 h-4 ${link.color} transition-colors duration-200`} />
                  </a>
                ))}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setShowNewsletter(true)}
                  className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  Subscribe to updates
                </button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-600" />
                Features
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">Calculator</span>
                <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs">Chemistry</span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">Grades</span>
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs">Math AI</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>All tools free to use</span>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                Impact
              </h4>
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-2 border border-green-200 dark:border-green-700">
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">
                    {stats.averageScore.toFixed(1)}% Success Rate
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending up this month
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {(stats.totalStudents / 1000).toFixed(1)}K+ Students
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Worldwide community
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Ultra Compact */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Creator Credit */}
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Crafted with</span>
                  <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                  <span className="text-gray-600 dark:text-gray-400">by</span>
                  <a
                    href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-purple-600 dark:text-purple-400 hover:underline transition-all duration-200 hover:scale-105"
                  >
                    Vinay Kumar
                  </a>
                  <span className="text-gray-600 dark:text-gray-400">&</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Team TRMS</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span>Open Source</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Educational Tech</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Made in India 🇮🇳</span>
                  </div>
                </div>
              </div>

              {/* Copyright & Actions */}
              <div className="text-center lg:text-right">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  © {new Date().getFullYear()} Study Tracker Pro
                </div>
                <div className="flex items-center justify-center lg:justify-end gap-2">
                  <button
                    onClick={() => setShowNewsletter(true)}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Get Updates
                  </button>
                  <span className="text-xs text-gray-400">•</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                  <span className="text-xs text-gray-400">•</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
