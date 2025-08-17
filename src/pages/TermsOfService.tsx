import React from 'react';
import { ArrowLeft, FileText, Users, AlertTriangle, Scale, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const TermsOfService: React.FC = () => {
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
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Terms of Service
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
              <Users className="w-5 h-5 text-blue-600" />
              Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                By accessing and using Study Tracker Pro, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-green-600" />
              Use License
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Permission is granted to temporarily use Study Tracker Pro for personal, non-commercial transitory viewing only.
              </p>
              <p><strong>This license shall automatically terminate if you violate any of these restrictions:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              User Responsibilities
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>As a user of Study Tracker Pro, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not share your account with others</li>
                <li>Report any security vulnerabilities</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-red-600" />
              Limitations
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                In no event shall Study Tracker Pro or its suppliers be liable for any damages arising out of the use or inability to use the service.
              </p>
              <p><strong>Service Availability:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance</li>
                <li>We reserve the right to modify or discontinue features</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p><strong>Email:</strong> archanakumariak117@gmail.com</p>
                <p><strong>Support:</strong> archanakumariak117@gmail.com</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};