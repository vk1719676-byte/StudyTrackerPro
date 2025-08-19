import React, { useState } from 'react';
import { MobileHeader } from './components/MobileHeader';
import { 
  BarChart3, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  BookOpen,
  Award,
  Activity
} from 'lucide-react';

function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        onMenuToggle={handleMenuToggle}
        notificationCount={2}
        userName="Student"
      />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMobileMenu(false)}>
          <div className="w-72 h-full bg-white shadow-xl transform transition-transform duration-300 animate-in slide-in-from-left">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-800">Navigation</h3>
            </div>
            <nav className="p-4 space-y-2">
              {['Dashboard', 'Study Plans', 'Progress', 'Calendar', 'Settings'].map((item, index) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 text-gray-700 font-medium"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Simple Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
              <p className="text-gray-600 text-sm">Let's make today productive</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">2.5h</div>
            <div className="text-sm text-gray-600">Study Time</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">5</div>
            <div className="text-sm text-gray-600">Tasks Done</div>
          </div>
        </div>

        {/* Simple Goals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-800">Today's Focus</h3>
          </div>
          <div className="space-y-3">
            {[
              { goal: 'Math Practice', completed: true },
              { goal: 'Read Chapter 5', completed: false },
              { goal: 'Review Notes', completed: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                } flex items-center justify-center`}>
                  {item.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {item.goal}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{activity.subject}</div>
                  <div className="text-gray-600 text-sm">{activity.task}</div>
                  <div className="text-gray-500 text-xs mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Week Warrior!</h3>
              <p className="text-white/90 text-sm">You've maintained your study streak for 7 days straight!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

