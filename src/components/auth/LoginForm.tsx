import React, { useState } from 'react';
import { Mail, Lock, Chrome } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { ForgotPassword } from './ForgotPassword';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, loginWithGoogle } = useAuth();

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
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
              Welcome Back! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue your academic journey and unlock your potential
            </p>


            <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg py-2 px-4 mt-3">
              <span>🚀</span>
              <span>Join 12,000+ students achieving their goals</span>

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
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            required
          />

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            icon={Mail}
          >
            {loading ? 'Signing in...' : 'Sign In'}
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
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
            >
              Create your free account →
            </button>
          </p>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              ✨ <strong>Free forever</strong> • No credit card required • Start tracking in seconds
            </p>
            

          
          </div>
        </div>
      </Card>
    </div>
  );
};
