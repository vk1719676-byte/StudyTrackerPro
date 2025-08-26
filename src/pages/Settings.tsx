import React from 'react';
import { User, Moon, Sun, LogOut, Trash2, Mail, Target, Edit3, Shield, FileText, HelpCircle, MessageCircle, ArrowRight, ExternalLink, Zap, Sparkles, X, Rocket, Calendar, Bell, Download, BarChart3, Clock, Trophy, ChevronRight, Users, Brain, Flame, Activity, AlertCircle, CheckCircle2, Timer, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { PremiumModal } from '../components/premium/PremiumModal';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { exportStudyDataToPDF } from '../utils/pdfExport';

export const Settings: React.FC = () => {
  const { user, logout, setShowTelegramModal, isPremium } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [showPremiumModal, setShowPremiumModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(() => {
    return localStorage.getItem(`displayName-${user?.uid}`) || user?.displayName || '';
  });

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    // In a real app, this would delete the account from Firebase
    alert('Account deletion functionality would be implemented here with proper Firebase auth deletion');
    setShowDeleteConfirm(false);
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = () => {
    logout();
    setShowSignOutConfirm(false);
  };

  const handleSaveName = () => {
    if (user) {
      localStorage.setItem(`displayName-${user.uid}`, displayName);
    }
    setIsEditingName(false);
  };

  const handleShowTelegramChannels = () => {
    setShowTelegramModal(true);
  };

  const handleExportData = () => {
    try {
      exportStudyDataToPDF({
        user,
        displayName,
        isPremium
      });
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 mx-auto sm:mx-0 shadow-lg">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-gray-100 dark:via-purple-100 dark:to-blue-100 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage your account and app preferences
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {/* Premium Status Section */}
          <Card className={`p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
            isPremium 
              ? 'bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-yellow-300 dark:border-yellow-700' 
              : 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="self-start sm:self-auto p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Premium Status
                  </h2>
                  {isPremium && <PremiumBadge size="sm" />}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {isPremium 
                    ? 'You have access to all premium features and advanced analytics'
                    : 'Upgrade to unlock advanced features, AI insights, and priority support'
                  }
                </p>
              </div>
            </div>

            {isPremium ? (
              <div className="space-y-4">
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {user?.premiumPlan === 'monthly' ? '1' : user?.premiumPlan === 'halfyearly' ? '6' : '12'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Month{user?.premiumPlan !== 'monthly' ? 's' : ''} Plan
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        Active
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Status</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {user?.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Expires</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => setShowPremiumModal(true)}
                  >
                    Manage Subscription
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 hover:bg-white/50 dark:hover:bg-gray-800/50"
                    onClick={() => alert('Contact support for subscription help')}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>AI-Powered Study Insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Advanced Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Unlimited Study Materials</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Priority Customer Support</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  icon={Crown}
                >
                  Upgrade to Premium - Starting ₹20/month
                </Button>
              </div>
            )}
          </Card>

          {/* Profile Section */}
          <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="self-start sm:self-auto p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl shadow-sm">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Profile Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Your account details and preferences
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 gap-3 sm:gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">Email</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 break-all text-sm sm:text-base pl-9 sm:pl-0">
                  {user?.email}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 gap-3 sm:gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Edit3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">Display Name</span>
                </div>
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto pl-9 sm:pl-0">
                    <Input
                      value={displayName}
                      onChange={setDisplayName}
                      placeholder="Enter your name"
                      className="w-full sm:w-48 h-10"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveName} className="flex-1 sm:flex-none">
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)} className="flex-1 sm:flex-none">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pl-9 sm:pl-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {displayName || 'Not set'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Edit3}
                      onClick={() => setIsEditingName(true)}
                      className="self-start sm:self-auto"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Community Section */}
          <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="self-start sm:self-auto p-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Community & Data
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Connect with community and manage your data
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg mt-0.5 sm:mt-0">
                    <MessageCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium block">Telegram Channels</span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Join our community for updates and support
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleShowTelegramChannels}
                  className="self-start sm:self-auto ml-9 sm:ml-0"
                >
                  View Channels
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mt-0.5 sm:mt-0">
                    <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium block">Export Data</span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Download your study data and statistics as PDF
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleExportData}
                  icon={Download}
                  className="self-start sm:self-auto ml-9 sm:ml-0"
                >
                  Export PDF
                </Button>
              </div>
            </div>
          </Card>

          {/* App Preferences */}
          <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="self-start sm:self-auto p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl shadow-sm">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  App Preferences
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Customize your Study Tracker Pro experience
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg mt-0.5 sm:mt-0">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium block">Theme</span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Choose between light and dark mode
                    </span>
                  </div>
                </div>
                <Button
                  onClick={toggleTheme}
                  variant="secondary"
                  icon={theme === 'dark' ? Sun : Moon}
                  className="self-start sm:self-auto ml-9 sm:ml-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="hidden sm:inline">Switch to </span>
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="self-start sm:self-auto">
                <Logo size="md" showText={false} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  About Study Tracker Pro
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Version 1.0.0
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base sm:text-lg">
                  Study Smarter, Not Harder! 🚀
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
                  Study Tracker Pro is your ultimate exam preparation companion, designed to help you track your progress, 
                  manage your study sessions, and achieve your academic goals with data-driven insights.
                </p>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-4 space-y-1">
                  <p className="font-medium">Created By Vinay Kumar | Powered by TRMS</p>
                  <p>Built with React, TypeScript, Tailwind CSS, and Firebase</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg border-red-100 dark:border-red-900/30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="self-start sm:self-auto p-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl shadow-sm">
                <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Account Actions
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Manage your account and data
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mt-0.5 sm:mt-0">
                    <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium block">Sign Out</span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Sign out of your Study Tracker Pro account
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  icon={LogOut}
                  className="self-start sm:self-auto ml-9 sm:ml-0"
                >
                  Sign Out
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg mt-0.5 sm:mt-0">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <span className="text-red-600 dark:text-red-400 font-medium block">Delete Account</span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all data
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="danger"
                  icon={Trash2}
                  className="self-start sm:self-auto ml-9 sm:ml-0"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgradeSuccess={() => {
          // Refresh the page to show updated premium status
          window.location.reload();
        }}
      />

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <LogOut className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Confirm Sign Out
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              You'll need to sign in again to access your study data and continue tracking your progress.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSignOutConfirm(false)}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSignOut}
                variant="secondary"
                className="flex-1"
                icon={LogOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                Deleting your account will permanently remove:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  All your study data and progress
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Your premium subscription (if any)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Account settings and preferences
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Access to all Study Tracker Pro features
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteAccount}
                variant="danger"
                className="flex-1"
                icon={Trash2}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
