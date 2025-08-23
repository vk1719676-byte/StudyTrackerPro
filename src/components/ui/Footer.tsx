import React, { useState, useEffect } from 'react';
import { 
  Youtube, Linkedin, Github, Send, Heart, Users, Trophy, Clock, 
  BookOpen, Star, TrendingUp, Shield, FileText, HelpCircle, 
  MessageCircle, Zap, Globe, Mail, MapPin, Code, Award, 
  CheckCircle, X, Sparkles, BookMarked
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

  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@studytrackerpro',
      icon: Youtube,
      color: 'text-red-500 hover:text-red-600'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in',
      icon: Linkedin,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Vinayk2007',
      icon: Github,
      color: 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/studytrackerpro',
      icon: Send,
      color: 'text-blue-500 hover:text-blue-600'
    }
  ];

  const quickLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy', icon: Shield },
    { name: 'Terms of Service', href: '/terms-of-service', icon: FileText },
    { name: 'Help Center', href: '/help-center', icon: HelpCircle },
    { name: 'Contact Us', href: '/contact-us', icon: MessageCircle },
  ];

  const teamMembers = [
    {
      name: "Vinay Kumar",
      role: "Co-Owner & Lead Developer",
      description: "Visionary developer creating innovative educational solutions for students worldwide.",
      icon: Code,
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
      social: {
        linkedin: "#",
        github: "#"
      }
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
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

  return (
    <>
      {/* Newsletter Modal */}
      {showNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Stay Updated</h3>
                <button 
                  onClick={() => setShowNewsletter(false)} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
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
                    className="w-full px-4 py-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Subscribe to Newsletter
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-green-600 mb-2">Subscribed!</h4>
                  <p className="text-gray-600 dark:text-gray-400">Thank you for subscribing to our newsletter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
        {/* Live Stats Banner */}
        <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-indigo-600/20 border-b border-purple-200/30 dark:border-purple-700/30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Empowering Global Education
                </h3>
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-lg font-bold text-purple-800 dark:text-purple-300">
                    {(stats.totalStudents / 1000).toFixed(1)}K+
                  </span>
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Students</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
                    {(stats.passedStudents / 1000).toFixed(1)}K+
                  </span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Success</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                    {(stats.totalStudyHours / 1000).toFixed(0)}K+
                  </span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Hours</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-800 dark:text-green-300">
                    {stats.averageScore.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">Score</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-lg font-bold text-orange-800 dark:text-orange-300">
                    {(stats.toolsUsed / 1000).toFixed(0)}K+
                  </span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Tools Used</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center backdrop-blur-sm border border-white/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span className="text-lg font-bold text-indigo-800 dark:text-indigo-300">
                    {stats.countriesReached}+
                  </span>
                </div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">Stay Updated!</h3>
                  <p className="text-purple-100">Get latest study tips & tool updates</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewsletter(true)}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-cyan-900/20 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                👥 Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <member.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{member.description}</p>
                      <div className="flex gap-2">
                        {member.social.linkedin !== "#" && (
                          <a 
                            href={member.social.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.github !== "#" && (
                          <a 
                            href={member.social.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Github className="w-4 h-4" />
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

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Tracker Pro
              </h2>
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                v2.1.0
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your ultimate companion for academic success with AI-powered tools and comprehensive learning resources
            </p>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Quick Access */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Quick Access
              </h4>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Connect */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Connect
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:scale-105 transition-all duration-300 group flex items-center gap-2`}
                  >
                    <link.icon className={`w-5 h-5 ${link.color} transition-colors duration-200`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
                Features
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Calculator</span>
                <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm">Chemistry</span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">Grades</span>
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm">Math AI</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>All tools free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Constantly improving</span>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
                Impact
              </h4>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {stats.averageScore.toFixed(1)}% Success Rate
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending up this month
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {(stats.totalStudents / 1000).toFixed(1)}K+ Students
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Worldwide community
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Creator Credit */}
              <div className="flex flex-col items-center lg:items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Crafted with</span>
                  <Heart className="w-5 h-5 text-red-500 fill-current animate-pulse" />
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
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    <span>Open Source</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>Educational Tech</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Made in India 🇮🇳</span>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center lg:text-right">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  © {new Date().getFullYear()} Study Tracker Pro
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  All rights reserved. Empowering students worldwide.
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
