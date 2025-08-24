import React, { useState } from 'react';
import { 
  User, 
  Moon, 
  Sun, 
  LogOut, 
  Mail, 
  Edit3, 
  Bell, 
  Clock, 
  Target,
  Download,
  Trash2,
  Crown,
  Settings as SettingsIcon
} from 'lucide-react';

function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // User settings state
  const [displayName, setDisplayName] = useState('John Doe');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);
  
  // Study preferences
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [defaultSessionLength, setDefaultSessionLength] = useState(25);
  const [dailyGoal, setDailyGoal] = useState(2);
  
  // Premium status (mock)
  const [isPremium] = useState(true);
  
  // Mock user data
  const userEmail = "john.doe@example.com";

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Name editing handlers
  const handleEditName = () => {
    setTempName(displayName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setDisplayName(tempName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(displayName);
    setIsEditingName(false);
  };

  // Settings actions
  const handleExportData = () => {
    alert('Data exported successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      alert('Logged out successfully!');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20' 
        : 'bg-gradient-to-br from-gray-50 via-white to-purple-50/30'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' 
              ? 'text-transparent bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text'
              : 'text-transparent bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text'
          }`}>
            Settings
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Premium Status */}
          <div className={`rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:shadow-xl ${
            isPremium
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50'
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
              : theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Premium Status
                  </h2>
                  {isPremium && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-medium rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {isPremium 
                    ? 'You have access to all premium features' 
                    : 'Upgrade to unlock premium features'
                  }
                </p>
              </div>
            </div>

            {isPremium && (
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'
              }`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">12</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Months Plan
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">Active</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">Dec 2025</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Expires
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className={`rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
              }`}>
                <User className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Profile Information
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Your account details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className={`flex items-center justify-between py-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <Mail className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Email
                  </span>
                </div>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {userEmail}
                </span>
              </div>

              {/* Display Name */}
              <div className={`flex items-center justify-between py-4 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <Edit3 className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Display Name
                  </span>
                </div>
                
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className={`px-3 py-2 rounded-lg border w-48 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-gray-100'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {displayName}
                    </span>
                    <button
                      onClick={handleEditName}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className={`rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'
              }`}>
                <Target className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Study Preferences
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Customize your study experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Session Length */}
              <div className={`flex items-center justify-between py-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <Clock className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Default Session Length
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Duration for study sessions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={defaultSessionLength}
                    onChange={(e) => setDefaultSessionLength(Number(e.target.value))}
                    className={`w-16 px-2 py-1 rounded border text-center ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    min="5"
                    max="180"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    min
                  </span>
                </div>
              </div>

              {/* Daily Goal */}
              <div className={`flex items-center justify-between py-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <Target className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Daily Study Goal
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Hours to study per day
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className={`w-16 px-2 py-1 rounded border text-center ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    min="0.5"
                    max="12"
                    step="0.5"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    hours
                  </span>
                </div>
              </div>

              {/* Notifications */}
              <div className={`flex items-center justify-between py-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
                  }`}>
                    <Bell className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Notifications
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive study reminders
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    notifications
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {notifications ? 'On' : 'Off'}
                </button>
              </div>

              {/* Study Reminders */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-cyan-900/20' : 'bg-cyan-50'
                  }`}>
                    <Clock className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Study Reminders
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Daily reminder notifications
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setStudyReminders(!studyReminders)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    studyReminders
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {studyReminders ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className={`rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100'
              }`}>
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Sun className="w-6 h-6 text-yellow-600" />
                )}
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  App Preferences
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Customize your app experience
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50'
                }`}>
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Theme
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Choose between light and dark mode
                  </span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Data & Account Actions */}
          <div className={`rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <LogOut className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Account Actions
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Manage your data and account
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Export Data */}
              <div className={`flex items-center justify-between py-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'
                  }`}>
                    <Download className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Export Data
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Download your study data
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Sign Out */}
              <div className={`flex items-center justify-between py-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <LogOut className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Sign Out
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Sign out of your account
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
                  }`}>
                    <Trash2 className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <span className={`font-medium block ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Delete Account
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Permanently delete your account
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
