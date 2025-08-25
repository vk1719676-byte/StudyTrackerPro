import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { 
  Send, Users, Star, X, ExternalLink, CheckCircle, MessageSquare, Clock, 
  ThumbsUp, AlertCircle, Gift, Sparkles, Volume2, VolumeX, Zap, Trophy,
  Share2, Download, Copy, Eye, EyeOff, Smartphone, Monitor, Tablet,
  Globe, Shield, Award, TrendingUp, Heart, Bookmark, Bell, Settings,
  ChevronDown, ChevronUp, Filter, Search, Calendar, MapPin, Camera,
  Mic, Video, FileText, Image, Music, Play, Pause, RotateCcw, Maximize2
} from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"
import { useAuth } from "../../contexts/AuthContext"

interface TelegramJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onChannelsJoined?: () => void
  theme?: 'light' | 'dark' | 'auto'
  language?: 'en' | 'es' | 'fr' | 'de'
  showAnalytics?: boolean
}

interface ReviewData {
  name: string
  email: string
  rating: number
  comment: string
  timestamp: string
  userId: string
  category: string
  wouldRecommend: boolean
  deviceInfo: string
  location?: string
  attachments?: string[]
}

interface ChannelStats {
  id: string
  joinCount: number
  lastJoined: string
  engagement: number
}

interface UserPreferences {
  soundEnabled: boolean
  animationsEnabled: boolean
  autoClose: boolean
  language: string
  theme: string
  notifications: boolean
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ 
  isOpen, 
  onClose, 
  onChannelsJoined,
  theme = 'auto',
  language = 'en',
  showAnalytics = true
}) => {
  // Core state
  const [joinedChannels, setJoinedChannels] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const [canClose, setCanClose] = useState(false)
  const { user } = useAuth()

  // Advanced features state
  const [currentStep, setCurrentStep] = useState<'welcome' | 'channels' | 'review' | 'success'>('welcome')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [userLocation, setUserLocation] = useState<string>('')
  const [channelStats, setChannelStats] = useState<ChannelStats[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'popular' | 'new'>('all')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [screenshotMode, setScreenshotMode] = useState(false)
  const [voiceRecording, setVoiceRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(1247)
  const [modalHistory, setModalHistory] = useState<string[]>(['welcome'])
  const [bookmarked, setBookmarked] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [reviewCategory, setReviewCategory] = useState<string>('overall')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [reviewerName, setReviewerName] = useState<string>('')
  const [reviewerEmail, setReviewerEmail] = useState<string>('')

  // Refs for advanced features
  const modalRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Student"

  const channels = [
    {
      id: "main",
      name: "Study Tracker Pro",
      url: "https://t.me/studytrackerpro",
      description: "Main community for updates, tips, and study motivation",
      members: "260+ members",
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
      category: "popular",
      verified: true,
      lastActive: "2 min ago",
      engagement: 95,
      preview: "Latest: New study techniques shared! 🎯"
    },
    {
      id: "premium",
      name: "TRMS Premium",
      url: "https://t.me/+_fkSUEqyukFiMjI1",
      description: "Premium features and advanced study tools",
      members: "25K+ members",
      icon: "⭐",
      color: "from-purple-500 to-pink-500",
      category: "new",
      verified: true,
      lastActive: "5 min ago",
      engagement: 88,
      preview: "Latest: Premium features update! ✨"
    },
  ]

  const translations = {
    en: {
      title: "Join Our Community",
      greeting: "Hey {name}! 👋",
      joinChannels: "Join Telegram Channels",
      quickReview: "Quick Review",
      submitReview: "Submit Review",
      benefits: "What You'll Get"
    },
    es: {
      title: "Únete a Nuestra Comunidad",
      greeting: "¡Hola {name}! 👋",
      joinChannels: "Únete a Canales de Telegram",
      quickReview: "Reseña Rápida",
      submitReview: "Enviar Reseña",
      benefits: "Lo Que Obtendrás"
    },
    fr: {
      title: "Rejoignez Notre Communauté",
      greeting: "Salut {name}! 👋",
      joinChannels: "Rejoindre les Chaînes Telegram",
      quickReview: "Avis Rapide",
      submitReview: "Soumettre l'Avis",
      benefits: "Ce Que Vous Obtiendrez"
    },
    de: {
      title: "Tritt Unserer Community Bei",
      greeting: "Hallo {name}! 👋",
      joinChannels: "Telegram-Kanälen Beitreten",
      quickReview: "Schnelle Bewertung",
      submitReview: "Bewertung Senden",
      benefits: "Was Du Bekommst"
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  // Feature 1: Device Detection
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth
      if (width < 768) setDeviceType('mobile')
      else if (width < 1024) setDeviceType('tablet')
      else setDeviceType('desktop')
    }
    
    detectDevice()
    window.addEventListener('resize', detectDevice)
    return () => window.removeEventListener('resize', detectDevice)
  }, [])

  // Feature 2: Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, you'd reverse geocode this
          setUserLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`)
        },
        () => setUserLocation('Location unavailable')
      )
    }
  }, [])

  // Feature 3: Real-time Online Users Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Feature 4: Advanced Timer with Sound
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (soundEnabled && audioRef.current) {
            audioRef.current.play().catch(() => {})
          }
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, soundEnabled])

  // Feature 5: Voice Recording Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (voiceRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [voiceRecording])

  // Feature 6: Typing Indicator Simulation
  useEffect(() => {
    if (reviewComment.length > 0) {
      setTypingIndicator(true)
      const timeout = setTimeout(() => setTypingIndicator(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [reviewComment])

  // Feature 7: Auto-save to localStorage
  useEffect(() => {
    const preferences: UserPreferences = {
      soundEnabled,
      animationsEnabled,
      autoClose: autoCloseEnabled,
      language,
      theme,
      notifications: notificationsEnabled
    }
    localStorage.setItem('telegramModalPrefs', JSON.stringify(preferences))
  }, [soundEnabled, animationsEnabled, autoCloseEnabled, language, theme, notificationsEnabled])

  // Feature 8: Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('telegramModalPrefs')
    if (saved) {
      const prefs: UserPreferences = JSON.parse(saved)
      setSoundEnabled(prefs.soundEnabled)
      setAnimationsEnabled(prefs.animationsEnabled)
      setAutoCloseEnabled(prefs.autoClose)
      setNotificationsEnabled(prefs.notifications)
    }
  }, [])

  // Feature 9: Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          if (canClose) onClose()
          break
        case 'Enter':
          if (e.ctrlKey && reviewComment.trim()) {
            handleReviewSubmit()
          }
          break
        case 'F11':
          e.preventDefault()
          setIsFullscreen(!isFullscreen)
          break
        case 's':
          if (e.ctrlKey) {
            e.preventDefault()
            handleShare()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, canClose, reviewComment, isFullscreen])

  // Feature 10: Advanced Analytics Tracking
  const trackEvent = useCallback((event: string, data?: any) => {
    if (showAnalytics) {
      console.log(`Analytics: ${event}`, data)
      // In real app, send to analytics service
    }
  }, [showAnalytics])

  const handleJoinChannel = (channelId: string, url: string) => {
    trackEvent('channel_join_attempt', { channelId, deviceType, location: userLocation })
    
    window.open(url, "_blank")
    setJoinedChannels(prev => [...prev, channelId])

    // Update channel stats
    setChannelStats(prev => [
      ...prev.filter(s => s.id !== channelId),
      {
        id: channelId,
        joinCount: (prev.find(s => s.id === channelId)?.joinCount || 0) + 1,
        lastJoined: new Date().toISOString(),
        engagement: Math.floor(Math.random() * 100)
      }
    ])

    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    if (joinedChannels.length + 1 >= channels.length) {
      onChannelsJoined?.()
      setCurrentStep('success')
      if (autoCloseEnabled) {
        setTimeout(() => onClose(), 3000)
      }
    }
  }

  const handleReviewSubmit = async () => {
    if (reviewRating === 0) return setSubmitError('Please rate our app')
    if (reviewComment.trim().length < 10) return setSubmitError('Please share at least 10 characters')
    if (!reviewerName.trim()) return setSubmitError('Name is required')
    if (!reviewerEmail.trim() || !reviewerEmail.includes('@')) return setSubmitError('Valid email required')
    if (wouldRecommend === null) return setSubmitError('Would you recommend us?')

    setIsSubmittingReview(true)
    setSubmitError('')

    const deviceInfo = `${deviceType} - ${navigator.userAgent.split(' ')[0]}`
    
    const reviewData: ReviewData = {
      name: reviewerName.trim(),
      email: reviewerEmail.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      timestamp: new Date().toISOString(),
      userId: user?.uid || 'anonymous',
      category: reviewCategory,
      wouldRecommend,
      deviceInfo,
      location: userLocation,
      attachments: attachments.map(f => f.name)
    }

    trackEvent('review_submitted', reviewData)

    try {
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbze5FxAwtudMk6l9hkZuxtrSpHzzmYwe5qswo9IyUIP31m0xfbM7cTy_u2JBahETpAE/exec'
      
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
        mode: 'no-cors'
      })

      setReviewSubmitted(true)
      setCurrentStep('success')
      
      if (autoCloseEnabled) {
        setTimeout(() => onClose(), 3000)
      }
    } catch (error) {
      setSubmitError('Failed to submit review')
    }

    setIsSubmittingReview(false)
  }

  // Feature 11: Voice Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.start()
      setVoiceRecording(true)
      setRecordingTime(0)
      
      mediaRecorder.ondataavailable = (event) => {
        // Handle recorded audio data
        console.log('Audio recorded:', event.data)
      }
    } catch (error) {
      console.error('Voice recording failed:', error)
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setVoiceRecording(false)
      setRecordingTime(0)
    }
  }

  // Feature 12: File Attachments
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
    trackEvent('file_attached', { count: files.length })
  }

  // Feature 13: Share Functionality
  const handleShare = async () => {
    const shareData = {
      title: 'Study Tracker Pro Community',
      text: 'Join our amazing study community!',
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        trackEvent('shared_native')
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      setShareModalOpen(true)
    }
  }

  // Feature 14: Copy to Clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      trackEvent('copied_to_clipboard')
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  // Feature 15: Screenshot Mode
  const toggleScreenshotMode = () => {
    setScreenshotMode(!screenshotMode)
    if (!screenshotMode) {
      // Hide sensitive info for screenshot
      setReviewerEmail('***@***.com')
      setReviewerName('User')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const StarRating = () => (
    <div className="flex items-center gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => {
            setReviewRating(star)
            setSubmitError('')
            trackEvent('rating_selected', { rating: star })
          }}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1 ${
            animationsEnabled ? 'animate-pulse' : ''
          }`}
          disabled={isSubmittingReview}
        >
          <Star
            className={`w-6 h-6 transition-all duration-200 ${
              star <= (hoveredStar || reviewRating)
                ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  )

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterCategory === 'all' || channel.category === filterCategory
    return matchesSearch && matchesFilter
  })

  if (!isOpen) return null

  // Success screen with advanced features
  if (currentStep === 'success' || showSuccess) {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${
        isFullscreen ? 'bg-opacity-90' : ''
      }`}>
        <Card className={`max-w-md w-full mx-4 p-6 text-center ${
          animationsEnabled ? 'animate-bounce' : ''
        }`}>
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {reviewSubmitted ? 'Review Submitted! 🎉' : 'Welcome to the Community! 🎉'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thanks {displayName}! You're now part of our {onlineUsers.toLocaleString()} member community.
          </p>
          
          {/* Advanced success features */}
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              <Button size="sm" onClick={handleShare} icon={Share2}>Share</Button>
              <Button size="sm" onClick={() => setBookmarked(!bookmarked)} 
                     icon={bookmarked ? Bookmark : Bookmark}>
                {bookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Get ready for an amazing study journey!
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm ${
      isFullscreen ? 'bg-opacity-90' : ''
    }`}>
      <Card className={`max-w-2xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl ${
        isFullscreen ? 'max-w-6xl max-h-screen' : ''
      } ${animationsEnabled ? 'transition-all duration-300' : ''}`} ref={modalRef}>
        
        {/* Advanced Header */}
        <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {t.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t.greeting.replace('{name}', displayName)}
                </p>
              </div>
            </div>

            {/* Advanced Controls */}
            <div className="flex items-center gap-2">
              {/* Online Users Indicator */}
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{onlineUsers.toLocaleString()} online</span>
              </div>

              {/* Settings Dropdown */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  icon={Settings}
                />
                
                {showAdvancedOptions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <div className="p-2 space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={soundEnabled}
                          onChange={(e) => setSoundEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <Volume2 className="w-4 h-4" />
                        Sound Effects
                      </label>
                      
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={animationsEnabled}
                          onChange={(e) => setAnimationsEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <Zap className="w-4 h-4" />
                        Animations
                      </label>
                      
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(e) => setNotificationsEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <Bell className="w-4 h-4" />
                        Notifications
                      </label>
                      
                      <button
                        onClick={toggleScreenshotMode}
                        className="flex items-center gap-2 text-sm w-full text-left p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Camera className="w-4 h-4" />
                        Screenshot Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen Toggle */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(!isFullscreen)}
                icon={Maximize2}
              />

              {/* Timer */}
              {timeLeft > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Close Button */}
              {(timeLeft === 0 || canClose) && (
                <button
                  onClick={onClose}
                  className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-105"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(((joinedChannels.length + (reviewSubmitted ? 1 : 0)) / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((joinedChannels.length + (reviewSubmitted ? 1 : 0)) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Advanced Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
            >
              <option value="all">All</option>
              <option value="popular">Popular</option>
              <option value="new">New</option>
            </select>
          </div>

          {/* Enhanced Channels Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Send className="w-4 h-4" />
              {t.joinChannels}
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {filteredChannels.length} channels
              </span>
            </h3>

            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className={`bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${
                  selectedChannel === channel.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedChannel(selectedChannel === channel.id ? null : channel.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-r ${channel.color} rounded-lg text-white text-lg shadow-md relative`}>
                    {channel.icon}
                    {channel.verified && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{channel.name}</h4>
                        {channel.verified && <Shield className="w-4 h-4 text-blue-500" />}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleJoinChannel(channel.id, channel.url)
                        }}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-md transition-all font-medium`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? "Joined" : "Join"}
                      </Button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{channel.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{channel.members}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{channel.engagement}% active</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{channel.lastActive}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowPreview(!showPreview)
                          }}
                          icon={showPreview ? EyeOff : Eye}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowQRCode(!showQRCode)
                          }}
                          icon={Smartphone}
                        />
                      </div>
                    </div>

                    {/* Channel Preview */}
                    {selectedChannel === channel.id && showPreview && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{channel.preview}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Review Form */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{t.quickReview}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Help us improve Study Tracker Pro</p>
                </div>
              </div>
              
              {typingIndicator && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>typing...</span>
                </div>
              )}
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-1">Thank You! 🎉</h4>
                <p className="text-sm text-green-600 dark:text-green-400">Your feedback has been submitted.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => {
                      setReviewerName(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="Your name"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    disabled={isSubmittingReview || screenshotMode}
                  />
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => {
                      setReviewerEmail(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="your@email.com"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    disabled={isSubmittingReview || screenshotMode}
                  />
                </div>

                {/* Star Rating */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate Study Tracker Pro
                  </label>
                  <StarRating />
                  {reviewRating > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {reviewRating <= 2 && "We'll work harder! 😔"}
                      {reviewRating === 3 && "Thanks for the feedback! 🙂"}
                      {reviewRating >= 4 && "Awesome! Thanks! 😊"}
                    </p>
                  )}
                </div>

                {/* Category & Recommendation */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={reviewCategory}
                    onChange={(e) => setReviewCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                    disabled={isSubmittingReview}
                  >
                    <option value="overall">💫 Overall</option>
                    <option value="features">⚡ Features</option>
                    <option value="design">🎨 Design</option>
                    <option value="performance">🚀 Speed</option>
                  </select>
                  
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setWouldRecommend(true)
                        setSubmitError('')
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      👍 Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWouldRecommend(false)
                        setSubmitError('')
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      👎 No
                    </button>
                  </div>
                </div>

                {/* Enhanced Comment Section */}
                <div>
                  <div className="relative">
                    <textarea
                      value={reviewComment}
                      onChange={(e) => {
                        setReviewComment(e.target.value)
                        setSubmitError('')
                      }}
                      placeholder="Share your experience... What do you like? Any suggestions?"
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      rows={3}
                      maxLength={500}
                      disabled={isSubmittingReview}
                    />
                    
                    {/* Advanced Input Tools */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Attach file"
                      >
                        <Image className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={voiceRecording ? stopVoiceRecording : startVoiceRecording}
                        className={`p-1 transition-colors ${
                          voiceRecording ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={voiceRecording ? 'Stop recording' : 'Voice message'}
                      >
                        {voiceRecording ? <Pause className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                      
                      {voiceRecording && (
                        <span className="text-xs text-red-500 font-mono">
                          {formatTime(recordingTime)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{reviewComment.length}/500</span>
                      {attachments.length > 0 && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {attachments.length} file{attachments.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {reviewComment.length >= 10 && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Great!
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs text-red-700 dark:text-red-300">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleReviewSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 shadow-lg hover:shadow-xl transition-all"
                  disabled={isSubmittingReview || reviewRating === 0}
                  icon={isSubmittingReview ? undefined : Send}
                >
                  {isSubmittingReview ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    `${t.submitReview} (Ctrl+Enter)`
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Benefits Section */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-yellow-500" />
              {t.benefits}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Daily motivation", icon: "💪", desc: "Get inspired daily" },
                { label: "App updates", icon: "🚀", desc: "First to know" },
                { label: "Study tips", icon: "💡", desc: "Expert advice" },
                { label: "Study community", icon: "👥", desc: "Connect with peers" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors group">
                  <span className="text-sm group-hover:scale-110 transition-transform">{benefit.icon}</span>
                  <div>
                    <div className="font-medium">{benefit.label}</div>
                    <div className="text-xs text-gray-500">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Location Info */}
          {showAnalytics && (
            <div className="text-center text-xs text-gray-400 space-y-1">
              <div className="flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  {deviceType === 'mobile' && <Smartphone className="w-3 h-3" />}
                  {deviceType === 'tablet' && <Tablet className="w-3 h-3" />}
                  {deviceType === 'desktop' && <Monitor className="w-3 h-3" />}
                  {deviceType}
                </span>
                {userLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {userLocation}
                  </span>
                )}
              </div>
              <p>Find these channels later in Settings → Contact Us</p>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Hidden audio element for sound effects */}
        <audio ref={audioRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
        </audio>

        {/* Share Modal */}
        {shareModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-sm w-full mx-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Share Community</h3>
                <button onClick={() => setShareModalOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="w-full justify-start"
                  icon={Copy}
                >
                  Copy Link
                </Button>
                <Button
                  onClick={() => copyToClipboard('Check out Study Tracker Pro community!')}
                  className="w-full justify-start"
                  icon={MessageSquare}
                >
                  Copy Message
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  )
}
