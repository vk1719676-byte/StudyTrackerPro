import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, BookOpen, Clock, Target, BarChart3, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'study-timer', name: 'Study Timer', icon: Clock },
    { id: 'goals', name: 'Goals & Tracking', icon: Target },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create my first exam?',
      answer: 'Go to the Exams page, click "Add Exam", fill in the exam details including name, date, syllabus, and study goals. Your exam will be saved and appear in your dashboard countdown.'
    },
    {
      category: 'study-timer',
      question: 'How does the study timer work?',
      answer: 'Select an exam, enter the subject and topic, then click Start. The timer will track your study session. When you stop, rate your efficiency and the session will be saved to your analytics.'
    },
    {
      category: 'goals',
      question: 'How do I set study goals?',
      answer: 'When creating or editing an exam, you can set daily and weekly study hour goals. These will be tracked automatically as you complete study sessions.'
    },
    {
      category: 'analytics',
      question: 'What analytics are available?',
      answer: 'View your study time trends, efficiency ratings, subject distribution, weekly progress, and achievement tracking. All data is visualized with interactive charts.'
    },
    {
      category: 'getting-started',
      question: 'Can I manually add study sessions?',
      answer: 'Yes! In the study timer section, click "Add Manual Entry" to log sessions you completed offline. Enter the duration, subject, topic, and efficiency rating.'
    },
    {
      category: 'study-timer',
      question: 'What is the efficiency rating?',
      answer: 'Rate your study session from 1-5 stars based on focus, comprehension, and productivity. This helps track your study quality over time.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/settings">
            <Button variant="ghost" icon={ArrowLeft} className="mb-4">
              Back to Settings
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <HelpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Help Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find answers to common questions and get support
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="max-w-md"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.map((faq, index) => (
            <Card key={index} className="p-6" hover>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="p-8 text-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Still Need Help?
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed with Study Tracker Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              icon={Mail}
              onClick={() => window.location.href = 'mailto:archanakumariak117@gmail.com'}
            >
              Email Support
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open('https://t.me/studytrackerpro', '_blank')}
            >
              Live Chat
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Average response time: 2-4 hours
          </p>
        </Card>
      </div>
    </div>
  );
};