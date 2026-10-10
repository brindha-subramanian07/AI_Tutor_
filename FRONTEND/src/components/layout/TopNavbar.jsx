import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  Menu,
  GraduationCap,
  Sparkles,
  Users2,
  Compass,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { LavenderPetal } from '../common/AutumnMotif';
import { AuthModal } from '../common/AuthModal';

export const TopNavbar = ({ onOpenMobileMenu }) => {
  const {
    activeTab,
    setActiveTab,
    student,
    speechEnabled,
    setSpeechEnabled,
    rooms,
    activeRoomId,
    setActiveRoomId,
    topics,
    startTopic,
    theme,
    toggleTheme,
    authModalOpen,
    setAuthModalOpen
  } = useLearning();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search filter
  const filteredTopics = Object.values(topics).filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 md:h-20 bg-[#FFFFFF] border-b border-[#E6E8F6] px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6] text-[#1E1B33]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Digital Classroom
            </span>
            <span className="w-1 h-1 rounded-full bg-[#DBEAFE]" />
            <span className="text-xs font-medium text-[#64748B]">
              {student.department}
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold text-[#172554] capitalize tracking-tight flex items-center gap-1.5">
            {activeTab === 'tutor'
              ? 'AI Visual Lecture Studio'
              : activeTab === 'quizzes'
              ? 'AI Diagnostic Quizzes'
              : activeTab === 'analysis'
              ? 'Diagnostic Performance & Pie Chart Analysis'
              : activeTab === 'rooms'
              ? 'Classroom Learning Pods'
              : activeTab}
          </h1>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md relative hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#676282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search lectures, concepts, physics, python..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] placeholder-[#676282] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/30 focus:border-[#7C5CFC] transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] border border-[#E6E8F6] rounded-2xl shadow-snow-lg overflow-hidden z-50 p-2">
            <div className="text-[11px] font-semibold text-[#676282] px-2.5 py-1 uppercase tracking-wider">
              Matching Lectures & Topics
            </div>
            {filteredTopics.length > 0 ? (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      startTopic(topic.id);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F1EDFE] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors">
                        {topic.title}
                      </p>
                      <p className="text-xs text-[#676282]">
                        {topic.category} • {topic.duration}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#676282] group-hover:text-[#7C5CFC] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-[#676282]">
                No existing topic matched. Try asking the AI Tutor directly!
              </div>
            )}
            <div className="pt-2 border-t border-[#E6E8F6] mt-1 px-2 flex justify-end">
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-xs font-semibold text-[#676282] hover:text-[#1E1B33]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Active Room Switcher Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6]">
          <Users2 className="w-4 h-4 text-[#7C5CFC]" />
          <select
            value={activeRoomId}
            onChange={(e) => {
              setActiveRoomId(e.target.value);
              setActiveTab('rooms');
            }}
            className="bg-transparent text-xs font-semibold text-[#1E1B33] focus:outline-none cursor-pointer"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.length > 20 ? r.name.slice(0, 20) + '...' : r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>

        {/* Speech Audio Voice Toggle */}
        <button
          onClick={() => setSpeechEnabled(!speechEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            speechEnabled
              ? 'bg-[#F1EDFE] text-[#7C5CFC] border-[#DCD3FC]'
              : 'bg-[#F8F9FE] text-[#676282] border-[#E6E8F6]'
          }`}
          title={speechEnabled ? "AI Voice Narration Active (Web Speech API)" : "AI Voice Narration Muted"}
        >
          {speechEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-[#7C5CFC] animate-pulse" />
              <span className="hidden sm:inline">AI Voice On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#676282]" />
              <span className="hidden sm:inline">Voice Muted</span>
            </>
          )}
        </button>

        {/* Theme Switcher Toggle (Light ☀️ / Dark 🌙) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-[#F8F9FE] hover:bg-[#EFF6FF] border-[#E6E8F6] text-[#1E1B33]"
          title={theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-[#F59E0B]" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl border border-[#E6E8F6] bg-[#F8F9FE] hover:bg-[#F0F2FA] text-[#1E1B33] flex items-center justify-center transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#676282]" />
            <span className="w-2 h-2 rounded-full bg-[#7C5CFC] absolute top-2 right-2 ring-2 ring-[#FFFFFF]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#E6E8F6] rounded-2xl shadow-snow-lg p-3.5 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E8F6]">
                <span className="text-xs font-bold text-[#1E1B33] uppercase tracking-wider">
                  Campus Updates & Feedback
                </span>
                <span className="text-[10px] text-[#7C5CFC] font-bold">2 New</span>
              </div>
              <div className="space-y-2 py-2">
                <div className="p-2.5 rounded-xl bg-[#F8F9FE] text-xs">
                  <p className="font-bold text-[#1E1B33]">New AI Tutor Recommendation</p>
                  <p className="text-[#676282] mt-0.5">
                    "Python Function Arguments" suggested based on recent quiz.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FE] text-xs">
                  <p className="font-bold text-[#1E1B33]">Classroom Room Active</p>
                  <p className="text-[#676282] mt-0.5">
                    Sneha posted a new doubt in CS204.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-xs font-semibold text-[#7C5CFC] hover:underline pt-1"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Sign In / Account Modal Trigger */}
        <button
          onClick={() => setAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-snow-sm"
          title="Sign In / Register Account"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </div>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};
