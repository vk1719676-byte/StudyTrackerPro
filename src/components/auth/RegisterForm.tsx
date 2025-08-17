import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Chrome } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <Logo size="lg" />
          <div className="mt-4 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Start Your Success Story! 🎯
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of students who transformed their study habits
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg py-2 px-3">
                📊 Smart Analytics
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg py-2 px-3">
                ⏰ Time Tracking
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg py-2 px-3">
                🎯 Goal Setting
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg py-2 px-3">
                🏆 Achievements
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={setPassword}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            icon={UserPlus}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
          icon={Chrome}
        >
          Continue with Google
        </Button>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
            >
              Sign in here →
            </button>
          </p>
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              🔒 <strong>100% Secure</strong> • Your data is encrypted and protected • GDPR compliant
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};