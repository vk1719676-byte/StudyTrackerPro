import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="text-center">
            <Logo size="lg" />
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Check Your Email! 📧
            </h2>
            
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                We've sent a password reset link to:
              </p>
              <p className="font-medium text-purple-600 dark:text-purple-400">
                {email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click the link in the email to reset your password. If you don't see it, check your spam folder.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onBack}
              variant="secondary"
              className="w-full"
              icon={ArrowLeft}
            >
              Back to Sign In
            </Button>
            
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Try a different email address
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <Logo size="lg" />
          <div className="mt-4 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Forgot Password? 🔐
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No worries! Enter your email and we'll send you a reset link
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            icon={Mail}
          >
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </div>

        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 <strong>Tip:</strong> Check your spam folder if you don't receive the email within a few minutes
          </p>
        </div>
      </Card>
    </div>
  );
};