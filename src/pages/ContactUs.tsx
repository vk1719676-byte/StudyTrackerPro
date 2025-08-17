import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'archanakumariak117@gmail.com',
      responseTime: '2-4 hours',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Available 24/7',
      responseTime: 'Instant',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center">
        <Card className="max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Message Sent! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for contacting us. We'll get back to you within 2-4 hours.
          </p>
          <Link to="/settings">
            <Button>Back to Settings</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/settings">
            <Button variant="ghost" icon={ArrowLeft} className="mb-4">
              Back to Settings
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Contact Us
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We're here to help you succeed with Study Tracker Pro
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Get in Touch
            </h2>
            
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="p-6" hover>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${method.bgColor}`}>
                      <Icon className={`w-6 h-6 ${method.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {method.description}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {method.contact}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        {method.responseTime}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Office Info */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <MapPin className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Our Office
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Study Tracker Pro<br />
                    New Delhi <br />
                    India<br />
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="archanakumariak117@gmail.com"
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(value) => setFormData({ ...formData, subject: value })}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  icon={Send}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};