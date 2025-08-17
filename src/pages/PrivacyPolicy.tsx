import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const PrivacyPolicy: React.FC = () => {
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Privacy Policy
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                At Study Tracker Pro, we collect information to provide you with the best study tracking experience:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Email address, display name, and authentication data</li>
                <li><strong>Study Data:</strong> Study sessions, exam information, goals, and progress tracking</li>
                <li><strong>Usage Analytics:</strong> App usage patterns to improve our services</li>
                <li><strong>Device Information:</strong> Browser type, device type, and operating system</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-600" />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our study tracking services</li>
                <li>Generate personalized analytics and insights</li>
                <li>Send important updates about your account</li>
                <li>Improve our app features and user experience</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Data Security
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your data security is our top priority. We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure Firebase authentication and database</li>
                <li>Regular security audits and updates</li>
                <li>GDPR and CCPA compliance</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-600" />
              Your Rights
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your study data</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-600" />
              Contact Us
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p><strong>Email:</strong> archanakumariak117@gmail.com</p>
                <p><strong>Address:</strong> Study Tracker Pro</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};