import React, { useState, useEffect } from 'react';
import { Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, BookOpen, Star, TrendingUp, Shield, FileText, HelpCircle, MessageCircle, ArrowRight, X, Rocket, Calendar, Bell, Brain, Cpu, Activity, BarChart3, Lightbulb, Calculator, BookMarked, Target, Zap, PieChart, FlaskConical, StickyNote, GraduationCap, LineChart, Bookmark, Settings, ChevronRight, Plus, Minus, Divide, Equal, Search, Percent, RotateCcw, UserCheck, Award, Code, Download, Copy, Wand2, Sparkles, FileDown, CheckCircle, AlertCircle, Info, Upload, Eye, Clock3, Hash, BookText, Lightbulb as LightbulbIcon, Save, Link, FileImage, Loader2, Mic, Speaker, Volume2, RefreshCw, Globe, Filter, SortDesc, Tag, Bookmark as BookmarkIcon } from 'lucide-react';

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

  // Enhanced AI Notes Summarizer States
  const [noteText, setNoteText] = useState('');
  const [summaryType, setSummaryType] = useState('intelligent-summary');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [aiSummary, setAiSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // Advanced Features
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [urlToExtract, setUrlToExtract] = useState('');
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [extractedContent, setExtractedContent] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  
  // Voice Features
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  
  // API and Settings
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  
  // Enhanced Analytics
  const [advancedAnalysis, setAdvancedAnalysis] = useState<{
    wordCount: number;
    readingTime: number;
    complexity: string;
    sentiment: string;
    topics: string[];
    entities: string[];
    languages: string[];
    readabilityScore: number;
    cognitiveLoad: string;
    mainThemes: Array<{theme: string, confidence: number}>;
    keyInsights: string[];
    suggestedActions: string[];
  }>({
    wordCount: 0,
    readingTime: 0,
    complexity: 'Low',
    sentiment: 'Neutral',
    topics: [],
    entities: [],
    languages: ['English'],
    readabilityScore: 0,
    cognitiveLoad: 'Low',
    mainThemes: [],
    keyInsights: [],
    suggestedActions: []
  });

  // History and Organization
  const [summaryHistory, setSummaryHistory] = useState<Array<{
    id: string;
    title: string;
    summary: string;
    originalContent: string;
    timestamp: string;
    type: string;
    tags: string[];
    favorite: boolean;
    wordCount: number;
    source: 'text' | 'file' | 'url';
    analysis: any;
  }>>([]);
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('all');

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

  // Load saved data and initialize features
  useEffect(() => {
    // Load saved API key
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) {
      setSavedApiKey(saved);
      setApiKey(saved);
    }
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem('notes_summary_history');
    if (savedHistory) {
      setSummaryHistory(JSON.parse(savedHistory));
    }

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNoteText(prev => prev + (prev ? ' ' : '') + transcript);
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      setSpeechRecognition(recognition);
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('notes_summary_history', JSON.stringify(summaryHistory));
  }, [summaryHistory]);

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
      description: "Advanced AI-powered summarization with file support, URL extraction, voice features, and comprehensive analysis using Google Gemini.",
      gradient: "from-violet-500 to-purple-600",
      category: "AI Tools"
    }
  ];

  // Enhanced Text Analysis with Advanced Features
  const analyzeText = async (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Advanced complexity analysis
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length;
    const avgSentenceLength = wordCount / sentences.length;
    
    let complexity = 'Low';
    let readabilityScore = 100;
    
    if (avgWordLength > 6 && avgSentenceLength > 25) {
      complexity = 'Very High';
      readabilityScore = 25;
    } else if (avgWordLength > 5.5 && avgSentenceLength > 20) {
      complexity = 'High';
      readabilityScore = 45;
    } else if (avgWordLength > 4.5 && avgSentenceLength > 15) {
      complexity = 'Medium';
      readabilityScore = 70;
    }

    // Enhanced sentiment analysis
    const positiveWords = ['excellent', 'amazing', 'wonderful', 'fantastic', 'great', 'good', 'positive', 'success', 'achievement', 'brilliant', 'outstanding', 'impressive'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'negative', 'failure', 'problem', 'difficult', 'challenging', 'poor', 'disappointing'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    let sentiment = 'Neutral';
    if (positiveCount > negativeCount * 1.5) sentiment = 'Positive';
    else if (negativeCount > positiveCount * 1.5) sentiment = 'Negative';

    // Enhanced entity extraction
    const entities = Array.from(new Set(
      words.filter(word => 
        (/^[A-Z][a-z]+$/.test(word) && word.length > 3) ||
        (/^\d{4}$/.test(word)) || // Years
        (/^[A-Z]{2,}$/.test(word)) // Acronyms
      ).slice(0, 15)
    ));

    // Advanced topic detection with confidence
    const topicKeywords = {
      'Science & Research': ['research', 'experiment', 'hypothesis', 'theory', 'analysis', 'data', 'study', 'method', 'laboratory', 'scientific'],
      'Mathematics': ['equation', 'formula', 'calculation', 'number', 'variable', 'function', 'proof', 'theorem', 'algebra', 'geometry'],
      'History & Social Studies': ['century', 'period', 'era', 'ancient', 'modern', 'revolution', 'war', 'empire', 'civilization', 'culture'],
      'Literature & Language': ['author', 'character', 'plot', 'theme', 'narrative', 'poetry', 'novel', 'story', 'literary', 'writing'],
      'Business & Economics': ['market', 'profit', 'strategy', 'management', 'finance', 'company', 'customer', 'sales', 'investment', 'economic'],
      'Technology & Computing': ['software', 'hardware', 'digital', 'computer', 'internet', 'application', 'system', 'network', 'programming', 'database'],
      'Health & Medicine': ['health', 'medical', 'treatment', 'diagnosis', 'patient', 'disease', 'therapy', 'clinical', 'healthcare', 'medicine'],
      'Education & Learning': ['education', 'learning', 'teaching', 'student', 'academic', 'curriculum', 'knowledge', 'skill', 'training', 'instruction']
    };

    const detectedTopics = Object.entries(topicKeywords)
      .map(([topic, keywords]) => ({
        topic,
        matches: keywords.filter(keyword => textLower.includes(keyword)).length,
        confidence: Math.min(95, (keywords.filter(keyword => textLower.includes(keyword)).length / keywords.length) * 100 + 20)
      }))
      .filter(item => item.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 5);

    const topics = detectedTopics.map(item => item.topic);
    const mainThemes = detectedTopics.map(item => ({
      theme: item.topic,
      confidence: item.confidence
    }));

    // Cognitive load assessment
    let cognitiveLoad = 'Low';
    if (complexity === 'Very High' || wordCount > 1500) {
      cognitiveLoad = 'Very High';
    } else if (complexity === 'High' || wordCount > 800) {
      cognitiveLoad = 'High';
    } else if (complexity === 'Medium' || wordCount > 400) {
      cognitiveLoad = 'Medium';
    }

    // Generate key insights
    const keyInsights = [
      `Document contains ${wordCount} words with ${complexity.toLowerCase()} complexity`,
      `Estimated reading time: ${readingTime} minutes`,
      `Content sentiment appears ${sentiment.toLowerCase()}`,
      `Primary focus areas: ${topics.slice(0, 3).join(', ')}`
    ];

    // Generate suggested actions
    const suggestedActions = [
      complexity === 'Very High' ? 'Consider breaking into smaller sections' : 'Review main concepts',
      sentiment === 'Negative' ? 'Focus on identifying solutions' : 'Extract key learnings',
      `Create ${summaryType === 'study-guide' ? 'flashcards' : 'mind map'} for better retention`,
      'Schedule follow-up review session'
    ];

    setAdvancedAnalysis({
      wordCount,
      readingTime,
      complexity,
      sentiment,
      topics,
      entities,
      languages: ['English'],
      readabilityScore,
      cognitiveLoad,
      mainThemes,
      keyInsights,
      suggestedActions
    });
  };

  // Enhanced Gemini API Integration
  const callGeminiAPI = async (prompt: string, systemPrompt?: string): Promise<string> => {
    if (!savedApiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser request: ${prompt}` : prompt;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${savedApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: summaryType === 'creative-summary' ? 0.8 : 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: summaryLength === 'short' ? 300 : summaryLength === 'medium' ? 600 : 1200,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  // Enhanced summary generation with advanced prompts
  const generateAISummary = async () => {
    if (!noteText.trim() && !extractedContent) {
      alert('Please enter some text or extract content from a URL to summarize');
      return;
    }

    if (!savedApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setIsAiProcessing(true);
    try {
      const contentToSummarize = extractedContent || noteText;
      await analyzeText(contentToSummarize);

      let systemPrompt = '';
      let userPrompt = '';
      
      const lengthInstruction = summaryLength === 'short' ? 'concise (2-3 sentences)' : 
                               summaryLength === 'medium' ? 'moderate length (1-2 paragraphs)' : 
                               'comprehensive and detailed (3-4 paragraphs)';

      switch (summaryType) {
        case 'intelligent-summary':
          systemPrompt = 'You are an expert academic assistant that creates intelligent, context-aware summaries. Analyze the content structure, identify key concepts, and provide insights.';
          userPrompt = `Create an intelligent ${lengthInstruction} summary of this content. Focus on main ideas, key relationships, and important insights:\n\n${contentToSummarize}`;
          break;
        case 'bullet-points':
          systemPrompt = 'You are a skilled note-taker who creates clear, organized bullet-point summaries for students and professionals.';
          userPrompt = `Create a ${lengthInstruction} bullet-point summary of this content. Use clear, concise points:\n\n${contentToSummarize}`;
          break;
        case 'study-guide':
          systemPrompt = 'You are an educational expert who creates comprehensive study guides to help students learn and retain information effectively.';
          userPrompt = `Create a ${lengthInstruction} study guide from this content. Include key concepts, important details, and study tips:\n\n${contentToSummarize}`;
          break;
        case 'executive-summary':
          systemPrompt = 'You are a business analyst who creates executive summaries for decision-makers, focusing on key points and actionable insights.';
          userPrompt = `Create a ${lengthInstruction} executive summary of this content. Focus on key findings, implications, and recommendations:\n\n${contentToSummarize}`;
          break;
        case 'creative-summary':
          systemPrompt = 'You are a creative writer who makes summaries engaging and memorable while maintaining accuracy and key information.';
          userPrompt = `Create a ${lengthInstruction} creative and engaging summary of this content. Make it interesting while preserving important information:\n\n${contentToSummarize}`;
          break;
        case 'technical-analysis':
          systemPrompt = 'You are a technical analyst who breaks down complex information into clear, structured analysis with technical insights.';
          userPrompt = `Provide a ${lengthInstruction} technical analysis of this content. Include methodology, findings, and technical implications:\n\n${contentToSummarize}`;
          break;
      }

      const summary = await callGeminiAPI(userPrompt, systemPrompt);
      setAiSummary(summary);

      // Extract key points using a separate API call
      try {
        const keyPointsPrompt = `Extract 5-7 key points from this text as a simple numbered list:\n\n${contentToSummarize}`;
        const keyPointsResponse = await callGeminiAPI(keyPointsPrompt, 'You are an expert at extracting the most important points from any text. Provide clear, concise key points.');
        const extractedPoints = keyPointsResponse.split('\n')
          .filter(point => point.trim().length > 0)
          .map(point => point.replace(/^\d+\.?\s*/, '').trim())
          .filter(point => point.length > 10)
          .slice(0, 7);
        setKeyPoints(extractedPoints);
      } catch (error) {
        console.error('Error extracting key points:', error);
        setKeyPoints(['Unable to extract key points']);
      }

      // Save to history with enhanced metadata
      const summaryEntry = {
        id: Date.now().toString(),
        title: contentToSummarize.slice(0, 60) + (contentToSummarize.length > 60 ? '...' : ''),
        summary,
        originalContent: contentToSummarize,
        timestamp: new Date().toLocaleString(),
        type: summaryType,
        tags: advancedAnalysis.topics.slice(0, 3),
        favorite: false,
        wordCount: advancedAnalysis.wordCount,
        source: extractedContent ? 'url' as const : selectedFiles.length > 0 ? 'file' as const : 'text' as const,
        analysis: advancedAnalysis
      };
      setSummaryHistory(prev => [summaryEntry, ...prev.slice(0, 19)]); // Keep last 20 summaries

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

  // Advanced file handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => 
        file.type === 'text/plain' || 
        file.type === 'application/pdf' || 
        file.type.includes('document') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.txt')
      );

      if (validFiles.length === 0) {
        alert('Please select valid text files (.txt, .md, .pdf, or document files)');
        return;
      }

      setSelectedFiles(validFiles);
      
      // Read files content
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setNoteText(prev => prev + (prev ? '\n\n' : '') + `=== ${file.name} ===\n${content}`);
        };
        reader.readAsText(file);
      });
    }
  };

  // URL content extraction
  const extractFromURL = async () => {
    if (!urlToExtract.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    setIsExtractingUrl(true);
    try {
      // Using a simple approach - in a real app, you'd use a proper web scraping service
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(urlToExtract)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      // Simple text extraction from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Remove script and style elements
      const scripts = doc.querySelectorAll('script, style');
      scripts.forEach(script => script.remove());
      
      const textContent = doc.body?.textContent || doc.textContent || '';
      const cleanedContent = textContent
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000); // Limit to 5000 characters
      
      setExtractedContent(cleanedContent);
      setNoteText(cleanedContent);
      
    } catch (error) {
      console.error('Error extracting URL content:', error);
      alert('Unable to extract content from this URL. Please try copying and pasting the text manually.');
    } finally {
      setIsExtractingUrl(false);
    }
  };

  // Voice features
  const startListening = () => {
    if (speechRecognition) {
      setIsListening(true);
      speechRecognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const stopListening = () => {
    if (speechRecognition) {
      speechRecognition.stop();
      setIsListening(false);
    }
  };

  const readSummaryAloud = () => {
    if ('speechSynthesis' in window) {
      if (isReadingAloud) {
        window.speechSynthesis.cancel();
        setIsReadingAloud(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(aiSummary);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.onend = () => setIsReadingAloud(false);
        window.speechSynthesis.speak(utterance);
        setIsReadingAloud(true);
      }
    } else {
      alert('Text-to-speech is not supported in your browser');
    }
  };

  // Utility functions
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setSavedApiKey(apiKey.trim());
      setShowApiKeyInput(false);
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
    
    const content = `# AI Summary Report
## Generated: ${new Date().toLocaleString()}
### Type: ${summaryType} (${summaryLength})
### Source: ${selectedFiles.length > 0 ? 'File Upload' : extractedContent ? 'URL Extraction' : 'Direct Input'}

## Original Content
${noteText}

## AI Summary
${aiSummary}

## Key Points
${keyPoints.map(point => `• ${point}`).join('\n')}

## Advanced Analysis
- **Word Count:** ${advancedAnalysis.wordCount}
- **Reading Time:** ${advancedAnalysis.readingTime} minutes
- **Complexity:** ${advancedAnalysis.complexity}
- **Sentiment:** ${advancedAnalysis.sentiment}
- **Cognitive Load:** ${advancedAnalysis.cognitiveLoad}
- **Readability Score:** ${advancedAnalysis.readabilityScore}/100

### Main Themes
${advancedAnalysis.mainThemes.map(theme => `• ${theme.theme} (${theme.confidence.toFixed(1)}% confidence)`).join('\n')}

### Key Insights
${advancedAnalysis.keyInsights.map(insight => `• ${insight}`).join('\n')}

### Suggested Actions
${advancedAnalysis.suggestedActions.map(action => `• ${action}`).join('\n')}

---
Generated by Study Tracker Pro AI Notes Summarizer
Powered by Google Gemini AI
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-summary-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearNotesSummarizer = () => {
    setNoteText('');
    setAiSummary('');
    setKeyPoints([]);
    setSelectedFiles([]);
    setUrlToExtract('');
    setExtractedContent('');
    setAdvancedAnalysis({
      wordCount: 0,
      readingTime: 0,
      complexity: 'Low',
      sentiment: 'Neutral',
      topics: [],
      entities: [],
      languages: ['English'],
      readabilityScore: 0,
      cognitiveLoad: 'Low',
      mainThemes: [],
      keyInsights: [],
      suggestedActions: []
    });
  };

  const toggleFavorite = (id: string) => {
    setSummaryHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  // Improved Calculator Functions (keeping existing functionality)
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

  // Periodic Table Data (keeping existing)
  const periodicElements = [
    { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, category: 'nonmetal', period: 1, group: 1 },
    { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, category: 'noble-gas', period: 1, group: 18 },
    { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, category: 'alkali-metal', period: 2, group: 1 },
    { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, category: 'alkaline-earth', period: 2, group: 2 },
    { symbol: 'B', name: 'Boron', number: 5, mass: 10.811, category: 'metalloid', period: 2, group: 13 },
    { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011, category: 'nonmetal', period: 2, group: 14 },
    { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007, category: 'nonmetal', period: 2, group: 15 },
    { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999, category: 'nonmetal', period: 2, group: 16 },
    { symbol: 'F', name: 'Fluorine', number: 9, mass: 18.998, category: 'halogen', period: 2, group: 17 },
    { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.180, category: 'noble-gas', period: 2, group: 18 },
    { symbol: 'Na', name: 'Sodium', number: 11, mass: 22.990, category: 'alkali-metal', period: 3, group: 1 },
    { symbol: 'Mg', name: 'Magnesium', number: 12, mass: 24.305, category: 'alkaline-earth', period: 3, group: 2 },
    { symbol: 'Al', name: 'Aluminum', number: 13, mass: 26.982, category: 'post-transition', period: 3, group: 13 },
    { symbol: 'Si', name: 'Silicon', number: 14, mass: 28.086, category: 'metalloid', period: 3, group: 14 },
    { symbol: 'P', name: 'Phosphorus', number: 15, mass: 30.974, category: 'nonmetal', period: 3, group: 15 },
    { symbol: 'S', name: 'Sulfur', number: 16, mass: 32.065, category: 'nonmetal', period: 3, group: 16 },
    { symbol: 'Cl', name: 'Chlorine', number: 17, mass: 35.453, category: 'halogen', period: 3, group: 17 },
    { symbol: 'Ar', name: 'Argon', number: 18, mass: 39.948, category: 'noble-gas', period: 3, group: 18 },
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

  // Grade Calculator Functions (keeping existing)
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

  // Math Solver Functions (keeping existing)
  const solveMathProblem = async () => {
    if (!mathExpression.trim()) return;
    
    setIsLoading(true);
    try {
      let solution = '';
      let steps: string[] = [];
      
      if (mathType === 'algebra') {
        if (mathExpression.includes('=')) {
          const [left, right] = mathExpression.split('=').map(s => s.trim());
          steps.push(`Original equation: ${mathExpression}`);
          steps.push(`Left side: ${left}`);
          steps.push(`Right side: ${right}`);
          
          if (mathExpression.toLowerCase().includes('x')) {
            steps.push('Solving for x...');
            
            const parseLinearEquation = (expr: string, targetValue: number) => {
              const cleaned = expr.replace(/\s/g, '').toLowerCase();
              
              let coefficient = 1;
              let constant = 0;
              
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
          try {
            let expr = mathExpression.toLowerCase();
            expr = expr.replace(/x/g, '1');
            expr = expr.replace(/\^/g, '**');
            
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
          let expr = mathExpression;
          expr = expr.replace(/×/g, '*');
          expr = expr.replace(/÷/g, '/');
          expr = expr.replace(/\^/g, '**');
          
          if (/^[0-9+\-*/().\s**]+$/.test(expr)) {
            const result = Function(`"use strict"; return (${expr})`)();
            solution = result.toString();
            steps.push(`Calculating: ${mathExpression}`);
            steps.push(`Step-by-step breakdown:`);
            
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

      {/* Enhanced API Key Input Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100">
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
                Google Gemini API Key Required
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
                Enter your Google Gemini API key to enable advanced AI-powered summarization with enhanced features
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-2">How to get your Gemini API key:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                        <li>Sign in with your Google account</li>
                        <li>Click "Create API Key"</li>
                        <li>Copy your API key</li>
                      </ol>
                      <p className="mt-2 font-medium">✅ Your key is stored locally and securely</p>
                      <p className="mt-1">🚀 Supports advanced features like file analysis, URL extraction, and voice input</p>
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

      {/* Enhanced AI Notes Summarizer Modal */}
      {showAINotesSummarizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      Advanced AI Notes Summarizer
                      <span className="px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs rounded-full font-medium">
                        Gemini Powered
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Transform content with advanced AI analysis, voice input, file support & URL extraction
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {savedApiKey && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">Gemini Connected</span>
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

              {/* Enhanced Tab Navigation */}
              <div className="flex flex-wrap gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                {[
                  { id: 'input', label: 'Input & Analysis', icon: BookText },
                  { id: 'summary', label: 'AI Summary', icon: Brain },
                  { id: 'insights', label: 'Advanced Insights', icon: BarChart3 },
                  { id: 'history', label: 'History', icon: Clock3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Input & Analysis Tab */}
              {activeTab === 'input' && (
                <div className="space-y-6">
                  {/* Advanced Configuration Panel */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-violet-200 dark:border-violet-700">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Advanced Summary Configuration
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Summary Type
                        </label>
                        <select
                          value={summaryType}
                          onChange={(e) => setSummaryType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        >
                          <option value="intelligent-summary">🧠 Intelligent Summary</option>
                          <option value="bullet-points">📝 Bullet Points</option>
                          <option value="study-guide">📚 Study Guide</option>
                          <option value="executive-summary">💼 Executive Summary</option>
                          <option value="creative-summary">🎨 Creative Summary</option>
                          <option value="technical-analysis">⚡ Technical Analysis</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Length & Detail
                        </label>
                        <select
                          value={summaryLength}
                          onChange={(e) => setSummaryLength(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        >
                          <option value="short">📄 Concise</option>
                          <option value="medium">📃 Balanced</option>
                          <option value="long">📋 Comprehensive</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => setShowApiKeyInput(true)}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            savedApiKey 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 cursor-default'
                              : 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/30'
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                          {savedApiKey ? 'API Connected' : 'Setup Gemini API'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Enhanced Input Methods */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Multi-Source Input
                      </h4>

                      {/* File Upload with Enhanced Support */}
                      <div className="space-y-3">
                        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-violet-500 dark:hover:border-violet-400 transition-colors group bg-gradient-to-br from-gray-50 to-violet-50 dark:from-gray-800 dark:to-violet-900/20">
                          <div className="text-center">
                            <FileImage className="w-10 h-10 text-gray-400 group-hover:text-violet-500 mx-auto mb-3" />
                            <p className="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 mb-1">
                              Upload Multiple Files
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              Drag & drop or click to select
                            </p>
                            <div className="flex flex-wrap justify-center gap-1 text-xs text-gray-400">
                              <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">TXT</span>
                              <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">MD</span>
                              <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">PDF</span>
                              <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">DOC</span>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept=".txt,.md,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            multiple
                            className="hidden"
                          />
                        </label>
                        
                        {selectedFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</p>
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <span className="text-sm text-green-700 dark:text-green-300 truncate">{file.name}</span>
                                <span className="text-xs text-green-600 dark:text-green-400">({(file.size / 1024).toFixed(1)}KB)</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* URL Extraction */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Extract from URL
                        </h5>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={urlToExtract}
                            onChange={(e) => setUrlToExtract(e.target.value)}
                            placeholder="https://example.com/article"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                          />
                          <button
                            onClick={extractFromURL}
                            disabled={!urlToExtract.trim() || isExtractingUrl}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
                          >
                            {isExtractingUrl ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Link className="w-4 h-4" />
                            )}
                            {isExtractingUrl ? 'Extracting...' : 'Extract'}
                          </button>
                        </div>
                        
                        {extractedContent && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Content extracted successfully!</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {extractedContent.length} characters extracted from URL
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Voice Input */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          Voice Input
                        </h5>
                        <div className="flex gap-2">
                          <button
                            onClick={isListening ? stopListening : startListening}
                            disabled={!speechRecognition}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                              isListening 
                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                          >
                            <Mic className="w-4 h-4" />
                            {isListening ? 'Stop Recording' : 'Start Voice Input'}
                          </button>
                        </div>
                        
                        {isListening && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                Listening... Speak now
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Text Input Area */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <BookText className="w-5 h-5" />
                          Text Content
                        </h4>
                        {noteText && (
                          <button
                            onClick={clearNotesSummarizer}
                            className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Clear All
                          </button>
                        )}
                      </div>

                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Enter your content here, upload files, extract from URL, or use voice input..."
                        rows={16}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      />
                      
                      {noteText && (
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Hash className="w-4 h-4" />
                              {noteText.trim().split(/\s+/).filter(w => w.length > 0).length} words
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="w-4 h-4" />
                              ~{Math.ceil(noteText.trim().split(/\s+/).filter(w => w.length > 0).length / 200)} min read
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {noteText.length > 10000 && (
                              <span className="text-orange-500 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Large content
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Generate Button */}
                      <button
                        onClick={generateAISummary}
                        disabled={(!noteText.trim() && !extractedContent) || isAiProcessing}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-lg"
                      >
                        {isAiProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing with Gemini AI...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Advanced Summary
                            <ZapIcon className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Summary Tab */}
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  {aiSummary ? (
                    <>
                      {/* AI Summary Display */}
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-violet-200 dark:border-violet-700">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            AI Summary
                            <span className="px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs rounded-full">
                              {summaryType.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          </h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={readSummaryAloud}
                              className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                              title={isReadingAloud ? "Stop reading" : "Read aloud"}
                            >
                              {isReadingAloud ? <Volume2 className="w-4 h-4" /> : <Speaker className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(aiSummary)}
                              className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                              title="Copy summary"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={exportSummary}
                              className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                              title="Export summary"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-violet-200 dark:border-violet-600 shadow-sm">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                              {aiSummary}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400">
                          <Sparkles className="w-3 h-3" />
                          <span>Generated with Google Gemini • {summaryType} • {summaryLength}</span>
                        </div>
                      </div>

                      {/* Enhanced Key Points */}
                      {keyPoints.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <LightbulbIcon className="w-5 h-5" />
                            Key Points & Insights
                          </h4>
                          
                          <div className="space-y-3">
                            {keyPoints.map((point, index) => (
                              <div key={index} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-600 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                    {point}
                                  </p>
                                  <button
                                    onClick={() => copyToClipboard(point)}
                                    className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" />
                                    Copy point
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        No Summary Generated Yet
                      </h4>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                        Go to the Input tab to add content and generate your AI summary
                      </p>
                      <button
                        onClick={() => setActiveTab('input')}
                        className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                      >
                        Go to Input
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Insights Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {advancedAnalysis.wordCount > 0 ? (
                    <>
                      {/* Comprehensive Analysis Dashboard */}
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 sm:p-6 border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Advanced Content Analysis
                        </h4>
                        
                        {/* Enhanced Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                          <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-600">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                              {advancedAnalysis.wordCount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-600">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                              {advancedAnalysis.readingTime}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Min Read</div>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
                            <div className={`text-2xl font-bold mb-1 ${
                              advancedAnalysis.readabilityScore >= 80 ? 'text-green-600 dark:text-green-400' :
                              advancedAnalysis.readabilityScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {advancedAnalysis.readabilityScore}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Readability</div>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-600">
                            <div className={`text-xl font-bold mb-1 ${
                              advancedAnalysis.complexity === 'Low' ? 'text-green-600 dark:text-green-400' :
                              advancedAnalysis.complexity === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              advancedAnalysis.complexity === 'High' ? 'text-orange-600 dark:text-orange-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {advancedAnalysis.complexity}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Complexity</div>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-pink-200 dark:border-pink-600">
                            <div className={`text-xl font-bold mb-1 ${
                              advancedAnalysis.sentiment === 'Positive' ? 'text-green-600 dark:text-green-400' :
                              advancedAnalysis.sentiment === 'Negative' ? 'text-red-600 dark:text-red-400' :
                              'text-blue-600 dark:text-blue-400'
                            }`}>
                              {advancedAnalysis.sentiment}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Sentiment</div>
                          </div>
                        </div>

                        {/* Main Themes with Confidence */}
                        {advancedAnalysis.mainThemes.length > 0 && (
                          <div className="mb-6">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Main Themes & Topics</h5>
                            <div className="space-y-2">
                              {advancedAnalysis.mainThemes.slice(0, 6).map((theme, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-600">
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{theme.theme}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${theme.confidence}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                      {theme.confidence.toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Insights */}
                        {advancedAnalysis.keyInsights.length > 0 && (
                          <div className="mb-6">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Key Insights</h5>
                            <div className="space-y-2">
                              {advancedAnalysis.keyInsights.map((insight, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-600">
                                  <LightbulbIcon className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{insight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Actions */}
                        {advancedAnalysis.suggestedActions.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggested Actions</h5>
                            <div className="space-y-2">
                              {advancedAnalysis.suggestedActions.map((action, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-600">
                                  <Target className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Entity Analysis */}
                      {advancedAnalysis.entities.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-700">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Detected Entities & Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {advancedAnalysis.entities.map((entity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-600"
                              >
                                {entity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cognitive Load Assessment */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 sm:p-6 border border-orange-200 dark:border-orange-700">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                          <Cpu className="w-5 h-5" />
                          Cognitive Load Assessment
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-600">
                            <div className={`text-2xl font-bold mb-2 ${
                              advancedAnalysis.cognitiveLoad === 'Low' ? 'text-green-600 dark:text-green-400' :
                              advancedAnalysis.cognitiveLoad === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              advancedAnalysis.cognitiveLoad === 'High' ? 'text-orange-600 dark:text-orange-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {advancedAnalysis.cognitiveLoad}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Cognitive Load</div>
                          </div>
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-600">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                              {Math.ceil(advancedAnalysis.readingTime * 1.5)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Study Time (min)</div>
                          </div>
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-600">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                              {advancedAnalysis.topics.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Focus Areas</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Recommendation:</strong> {
                              advancedAnalysis.cognitiveLoad === 'Very High' ? 'Break this content into smaller chunks for better comprehension and retention.' :
                              advancedAnalysis.cognitiveLoad === 'High' ? 'Consider taking breaks during study and use active recall techniques.' :
                              advancedAnalysis.cognitiveLoad === 'Medium' ? 'This content is well-balanced for focused study sessions.' :
                              'This content is easy to digest and perfect for quick review sessions.'
                            }
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        No Analysis Available
                      </h4>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                        Add content and generate a summary to see advanced insights
                      </p>
                      <button
                        onClick={() => setActiveTab('input')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Start Analysis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  {summaryHistory.length > 0 ? (
                    <>
                      {/* History Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Clock3 className="w-5 h-5" />
                            Summary History
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              {summaryHistory.length}
                            </span>
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                          >
                            <Filter className="w-4 h-4" />
                            Filters
                          </button>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="wordcount">Word Count</option>
                            <option value="favorites">Favorites</option>
                          </select>
                        </div>
                      </div>

                      {/* Filter Panel */}
                      {showFilters && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type:</span>
                            {['all', 'intelligent-summary', 'study-guide', 'bullet-points', 'executive-summary'].map(type => (
                              <button
                                key={type}
                                onClick={() => setFilterTag(type)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  filterTag === type
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                              >
                                {type === 'all' ? 'All' : type.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* History Items */}
                      <div className="space-y-4">
                        {summaryHistory
                          .filter(item => filterTag === 'all' || item.type === filterTag)
                          .sort((a, b) => {
                            switch (sortBy) {
                              case 'oldest':
                                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                              case 'wordcount':
                                return b.wordCount - a.wordCount;
                              case 'favorites':
                                return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
                              default:
                                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                            }
                          })
                          .map((item) => (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 transition-all hover:shadow-md"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                      {item.title}
                                    </h5>
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                      item.source === 'url' ? 'bg-blue-500' :
                                      item.source === 'file' ? 'bg-green-500' :
                                      'bg-gray-500'
                                    }`}></span>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs rounded-full">
                                      {item.type.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.wordCount} words
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.timestamp}
                                    </span>
                                    {item.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {item.summary}
                                  </p>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2">
                                  <button
                                    onClick={() => toggleFavorite(item.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      item.favorite
                                        ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                    }`}
                                  >
                                    <BookmarkIcon className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setNoteText(item.originalContent);
                                      setAiSummary(item.summary);
                                      if (item.analysis) {
                                        setAdvancedAnalysis(item.analysis);
                                      }
                                      setActiveTab('summary');
                                    }}
                                    className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Clock3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        No History Yet
                      </h4>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                        Generate your first summary to see it here
                      </p>
                      <button
                        onClick={() => setActiveTab('input')}
                        className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                      >
                        Create Summary
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Footer */}
              <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                      Powered by Google Gemini AI
                    </span>
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-xs text-violet-600 dark:text-violet-400">
                    🚀 Advanced AI summarization with file support, URL extraction, voice features & comprehensive analysis
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-violet-200 dark:border-violet-600">
                    <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                      <FileImage className="w-3 h-3" />
                      <span>Multi-file Support</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                      <Globe className="w-3 h-3" />
                      <span>URL Extraction</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                      <Mic className="w-3 h-3" />
                      <span>Voice Input</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                      <Brain className="w-3 h-3" />
                      <span>Deep Analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Calculator Modal (keeping existing) */}
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

      {/* Periodic Table Modal (keeping existing) */}
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

      {/* Grade Calculator Modal (keeping existing) */}
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

      {/* Math Solver Modal (keeping existing) */}
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
                Powerful tools to enhance your learning experience with advanced AI
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
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Gemini AI Powered</span>
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
                  Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">Google Gemini</span>
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

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Footer />
    </div>
  );
}

export default App;
