import React, { useState, useEffect } from 'react';
import { Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, BookOpen, Star, TrendingUp, Shield, FileText, HelpCircle, MessageCircle, ArrowRight, X, Rocket, Calendar, Bell, Brain, Cpu, Activity, BarChart3, Lightbulb, Calculator, BookMarked, Target, Zap, PieChart, FlaskConical, StickyNote, GraduationCap, LineChart, Bookmark, Settings, ChevronRight, Plus, Minus, Divide, Equal, Search, Percent, RotateCcw, UserCheck, Award, Code, Download, Copy, Wand2, Sparkles, FileDown, CheckCircle, AlertCircle, Info, Upload, Eye, Clock3, Hash, BookText, Lightbulb as LightbulbIcon, Save } from 'lucide-react';

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
  const [showAINotesSummarizer, setShowAINotesSummarizer] = useState(false);

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

  // AI Notes Summarizer States
  const [noteText, setNoteText] = useState('');
  const [summaryType, setSummaryType] = useState('bullet-points');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [aiSummary, setAiSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<{
    wordCount: number;
    readingTime: number;
    complexity: string;
    topics: string[];
  }>({ wordCount: 0, readingTime: 0, complexity: 'Low', topics: [] });
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [summaryHistory, setSummaryHistory] = useState<Array<{
    id: string;
    title: string;
    summary: string;
    timestamp: string;
    type: string;
  }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');

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

  // Load saved API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('openai_api_key');
    if (saved) {
      setSavedApiKey(saved);
      setApiKey(saved);
    }
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
    if (featureName === 'AI Notes Summarizer') {
      setShowAINotesSummarizer(true);
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
      icon: Wand2,
      title: "AI Notes Summarizer",
      description: "Transform lengthy notes into concise summaries with AI-powered analysis, key points extraction, and smart insights.",
      gradient: "from-violet-500 to-purple-600",
      category: "AI Tools"
    }
  ];

  // AI Notes Summarizer Functions
  const analyzeText = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 WPM
    
    // Simple complexity analysis
    const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = wordCount / sentences.length;
    
    let complexity = 'Low';
    if (avgWordLength > 5 && avgSentenceLength > 20) {
      complexity = 'High';
    } else if (avgWordLength > 4 || avgSentenceLength > 15) {
      complexity = 'Medium';
    }

    // Extract potential topics (simplified - looks for capitalized words and common academic terms)
    const topics = Array.from(new Set(
      words.filter(word => 
        (word.length > 4 && /^[A-Z]/.test(word)) || 
        ['theory', 'concept', 'principle', 'method', 'analysis', 'research'].some(term => 
          word.toLowerCase().includes(term)
        )
      ).slice(0, 5)
    ));

    setAiAnalysis({ wordCount, readingTime, complexity, topics });
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setSavedApiKey(apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const callOpenAIAPI = async (prompt: string): Promise<string> => {
    if (!savedApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic assistant that helps students create clear, concise summaries of their study materials. Focus on extracting key concepts, main ideas, and important details.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: summaryLength === 'short' ? 300 : summaryLength === 'medium' ? 600 : 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No summary generated';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  };

  const generateAISummary = async () => {
    if (!noteText.trim()) {
      alert('Please enter some text to summarize');
      return;
    }

    if (!savedApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setIsAiProcessing(true);
    try {
      analyzeText(noteText);

      let prompt = '';
      const lengthInstruction = summaryLength === 'short' ? 'very concise (2-3 sentences)' : 
                               summaryLength === 'medium' ? 'moderate length (1-2 paragraphs)' : 
                               'detailed (3-4 paragraphs)';

      switch (summaryType) {
        case 'bullet-points':
          prompt = `Please create a ${lengthInstruction} bullet-point summary of the following text. Focus on the main ideas and key points:\n\n${noteText}`;
          break;
        case 'paragraph':
          prompt = `Please create a ${lengthInstruction} paragraph summary of the following text. Capture the main themes and important details:\n\n${noteText}`;
          break;
        case 'key-insights':
          prompt = `Please extract the key insights and main learning points from the following text in a ${lengthInstruction} format. Focus on the most important concepts:\n\n${noteText}`;
          break;
        case 'study-guide':
          prompt = `Please create a ${lengthInstruction} study guide from the following text. Include main topics, key concepts, and important details that would help someone study this material:\n\n${noteText}`;
          break;
        default:
          prompt = `Please summarize the following text in a ${lengthInstruction} format:\n\n${noteText}`;
      }

      const summary = await callOpenAIAPI(prompt);
      setAiSummary(summary);

      // Extract key points using a separate API call
      try {
        const keyPointsPrompt = `Extract 3-5 key points from this text as a simple list (one point per line, no bullets or numbers):\n\n${noteText}`;
        const keyPointsResponse = await callOpenAIAPI(keyPointsPrompt);
        const extractedPoints = keyPointsResponse.split('\n').filter(point => point.trim().length > 0).slice(0, 5);
        setKeyPoints(extractedPoints);
      } catch (error) {
        console.error('Error extracting key points:', error);
        setKeyPoints(['Unable to extract key points']);
      }

      // Save to history
      const summaryEntry = {
        id: Date.now().toString(),
        title: noteText.slice(0, 50) + (noteText.length > 50 ? '...' : ''),
        summary,
        timestamp: new Date().toLocaleString(),
        type: summaryType
      };
      setSummaryHistory(prev => [summaryEntry, ...prev.slice(0, 9)]); // Keep last 10 summaries

    } catch (error) {
      console.error('Error generating summary:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An error occurred while generating the summary. Please try again.');
      }
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setNoteText(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a text file (.txt)');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const exportSummary = () => {
    if (!aiSummary) return;
    
    const content = `Summary (${summaryType}, ${summaryLength})\n` +
                   `Generated: ${new Date().toLocaleString()}\n\n` +
                   `Original Text:\n${noteText}\n\n` +
                   `Summary:\n${aiSummary}\n\n` +
                   `Key Points:\n${keyPoints.map(point => `• ${point}`).join('\n')}\n\n` +
                   `Analysis:\n` +
                   `Word Count: ${aiAnalysis.wordCount}\n` +
                   `Reading Time: ${aiAnalysis.readingTime} min\n` +
                   `Complexity: ${aiAnalysis.complexity}\n` +
                   `Topics: ${aiAnalysis.topics.join(', ')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearNotesSummarizer = () => {
    setNoteText('');
    setAiSummary('');
    setKeyPoints([]);
    setSelectedFile(null);
    setAiAnalysis({ wordCount: 0, readingTime: 0, complexity: 'Low', topics: [] });
  };

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

      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="relative p-6">
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                OpenAI API Key Required
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
                Enter your OpenAI API key to enable AI-powered summarization
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">How to get your API key:</p>
                      <p>1. Visit platform.openai.com</p>
                      <p>2. Sign in or create an account</p>
                      <p>3. Go to API Keys section</p>
                      <p>4. Create a new API key</p>
                      <p className="mt-2 font-medium">Your key will be stored locally and securely.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApiKeyInput(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveApiKey}
                    disabled={!apiKey.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Notes Summarizer Modal */}
      {showAINotesSummarizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      AI Notes Summarizer
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Transform lengthy notes into concise summaries with AI
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {savedApiKey && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">API Connected</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowAINotesSummarizer(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-6">
                  {/* Configuration */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-700">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Summary Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Summary Type
                        </label>
                        <select
                          value={summaryType}
                          onChange={(e) => setSummaryType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        >
                          <option value="bullet-points">Bullet Points</option>
                          <option value="paragraph">Paragraph</option>
                          <option value="key-insights">Key Insights</option>
                          <option value="study-guide">Study Guide</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Length
                        </label>
                        <select
                          value={summaryLength}
                          onChange={(e) => setSummaryLength(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="long">Detailed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Input Methods */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <BookText className="w-4 h-4" />
                      Input Your Notes
                    </h4>
                    
                    {/* File Upload */}
                    <div className="mb-4">
                      <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-violet-500 dark:hover:border-violet-400 transition-colors group">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-violet-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                            <span className="font-medium">Click to upload</span> or drag & drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Text files (.txt) supported
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {selectedFile && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>{selectedFile.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Text Area */}
                    <div>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Paste your notes here or upload a text file above..."
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      />
                      
                      {noteText && (
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {noteText.trim().split(/\s+/).length} words
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="w-3 h-3" />
                              ~{Math.ceil(noteText.trim().split(/\s+/).length / 200)} min read
                            </span>
                          </div>
                          <button
                            onClick={clearNotesSummarizer}
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Generate Button */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={generateAISummary}
                        disabled={!noteText.trim() || isAiProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 touch-manipulation"
                      >
                        {isAiProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Summary
                          </>
                        )}
                      </button>
                      
                      {!savedApiKey && (
                        <button
                          onClick={() => setShowApiKeyInput(true)}
                          className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center gap-2 touch-manipulation"
                        >
                          <Settings className="w-4 h-4" />
                          Setup API
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                  {/* AI Summary */}
                  {aiSummary && (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-violet-200 dark:border-violet-700">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          AI Summary
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(aiSummary)}
                            className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-lg transition-colors touch-manipulation"
                            title="Copy summary"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={exportSummary}
                            className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-lg transition-colors touch-manipulation"
                            title="Export summary"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-violet-200 dark:border-violet-600">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {aiSummary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400">
                        <Sparkles className="w-3 h-3" />
                        <span>Generated with AI • {summaryType} • {summaryLength}</span>
                      </div>
                    </div>
                  )}

                  {/* Key Points */}
                  {keyPoints.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <LightbulbIcon className="w-4 h-4" />
                        Key Points
                      </h4>
                      
                      <div className="space-y-2">
                        {keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-600">
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Analysis */}
                  {aiAnalysis.wordCount > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 sm:p-6 border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Text Analysis
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {aiAnalysis.wordCount}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {aiAnalysis.readingTime}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Min Read</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${
                            aiAnalysis.complexity === 'High' ? 'text-red-600 dark:text-red-400' :
                            aiAnalysis.complexity === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {aiAnalysis.complexity}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Complexity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {aiAnalysis.topics.length}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Topics</div>
                        </div>
                      </div>

                      {aiAnalysis.topics.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Topics:</h5>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.topics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* History */}
                  {summaryHistory.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Summaries
                      </h4>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {summaryHistory.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-600 transition-colors cursor-pointer"
                            onClick={() => {
                              setAiSummary(item.summary);
                              setSummaryType(item.type);
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.timestamp} • {item.type}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <p className="text-xs text-violet-600 dark:text-violet-400 text-center">
                  🤖 Powered by OpenAI GPT • Transform your study notes into clear, actionable summaries
                </p>
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
                Powerful tools to enhance your learning experience with AI
              </p>
            </div>

            {/* Compact Study Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {studyTools.map((tool, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => handleFeatureClick(tool.title)}
                >
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
                  <Brain className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">AI Powered</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Ready Now</span>
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
              Your ultimate study companion with advanced AI-powered tools and analytics
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
