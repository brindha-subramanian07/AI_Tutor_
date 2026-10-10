import React, { useState } from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { DoodleBackground } from './components/common/DoodleBackground';
import { AIAssistantPanel } from './components/tutor/AIAssistantPanel';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { AITutorView } from './components/tutor/AITutorView';
import { MyLearningView } from './components/learning/MyLearningView';
import { QuizView } from './components/quiz/QuizView';
import { RoomsView } from './components/rooms/RoomsView';
import { DoubtsView } from './components/doubts/DoubtsView';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { SettingsView } from './components/settings/SettingsView';
import { QuizResults } from './components/quiz/QuizResults';

const MainLayout = () => {
  const { activeTab, setActiveTab } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle browser back / forward navigation
  React.useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      if (path === 'analysis' || path === 'quiz-analysis' || path === 'results') {
        setActiveTab('analysis');
      } else if (path === 'quizzes' || path === 'quiz') {
        setActiveTab('quizzes');
      } else if (path === 'tutor' || path === 'lecture') {
        setActiveTab('tutor');
      } else if (path === 'progress' || path === 'analytics') {
        setActiveTab('progress');
      } else if (path === 'rooms') {
        setActiveTab('rooms');
      } else if (path === 'doubts') {
        setActiveTab('doubts');
      } else if (path === 'learning') {
        setActiveTab('learning');
      } else if (path === 'recommendations') {
        setActiveTab('recommendations');
      } else if (path === 'settings') {
        setActiveTab('settings');
      } else if (path === 'dashboard' || path === '') {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [setActiveTab]);

  // Keep browser URL synchronized with activeTab
  React.useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const targetPath = activeTab === 'dashboard' ? '' : activeTab;
    if (currentPath !== targetPath) {
      window.history.pushState(null, '', `/${targetPath}`);
    }
  }, [activeTab]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tutor':
        return <AITutorView />;
      case 'learning':
        return <MyLearningView />;
      case 'quizzes':
        return <QuizView />;
      case 'analysis':
        return <QuizResults />;
      case 'rooms':
        return <RoomsView />;
      case 'doubts':
        return <DoubtsView />;
      case 'progress':
        return <ProgressDashboard />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F6FF] dark:bg-[#071426] text-[#172554] dark:text-[#F0F9FF] relative transition-colors duration-300">
      {/* Full-Screen Interactive Educational Doodle Background with Strong Cursor Repulsion */}
      <DoodleBackground />

      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Top Navbar */}
        <TopNavbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 md:pb-12 bg-transparent">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Floating AI Tutor Copilot (Small Icon / Expandable Chatbot) */}
      <AIAssistantPanel />

      {/* Global Warm Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <MainLayout />
    </LearningProvider>
  );
}
