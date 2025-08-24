import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DesktopNavbar } from './components/navigation/DesktopNavbar';
import { MobileNavbar } from './components/navigation/MobileNavbar';
import { MobileHeader } from './components/ui/MobileHeader';
import { Footer } from './components/ui/Footer';
import { TelegramJoinModal } from './components/ui/TelegramJoinModal';
import { Dashboard } from './pages/Dashboard';
import { Exams } from './pages/Exams';
import { Goals } from './pages/Goals';
import { Sessions } from './pages/Sessions';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { StudyMaterials } from './pages/StudyMaterials';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { HelpCenter } from './pages/HelpCenter';
import { ContactUs } from './pages/ContactUs';
import { Auth } from './pages/Auth';
import { Splash } from './pages/Splash';

const AppContent: React.FC = () => {
  const { user, loading, showTelegramModal, setShowTelegramModal } = useAuth();
  const [showSplash, setShowSplash] = React.useState(() => {
    return !localStorage.getItem('studytracker-visited');
  });

  useEffect(() => {
    // Update document title
    document.title = 'Study Tracker Pro - Study Smarter, Not Harder!';
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('studytracker-visited', 'true');
    setShowSplash(false);
  };

  const handleTelegramModalClose = () => {
    if (user) {
      localStorage.setItem(`telegram-joined-${user.uid}`, 'true');
    }
    setShowTelegramModal(false);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Study Tracker Pro Dashboard...</p>
        </div>
      </div>
    );
  }

  if (showSplash && !user) {
    return <Splash onGetStarted={handleGetStarted} />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <DesktopNavbar />
      <main className="transition-colors duration-200 flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <MobileNavbar />
      
      {/* Telegram Join Modal */}
      <TelegramJoinModal
        isOpen={showTelegramModal}
        onClose={handleTelegramModalClose}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
