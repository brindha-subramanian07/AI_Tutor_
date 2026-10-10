import React from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  LayoutDashboard,
  Sparkles,
  HelpCircle,
  PieChart,
  Users2,
  TrendingUp,
  X,
  Compass,
  BookOpen,
  MessageSquareQuote,
  Settings,
  GraduationCap
} from 'lucide-react';

export const MobileNav = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, student } = useLearning();

  const primaryItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tutor', label: 'Tutor', icon: Sparkles },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'analysis', label: 'Analysis', icon: PieChart },
    { id: 'rooms', label: 'Rooms', icon: Users2 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const allItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'analysis', label: 'Quiz Analysis', icon: PieChart },
    { id: 'rooms', label: 'Learning Rooms', icon: Users2 },
    { id: 'doubts', label: 'Doubts', icon: MessageSquareQuote },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer (When Hamburger is Clicked) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 max-w-[80vw] bg-[#FFFFFF] h-full shadow-snow-xl flex flex-col z-10 border-r border-[#DBEAFE]">
            <div className="p-4 border-b border-[#DBEAFE] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-[#172554] text-base leading-tight">
                  AI Tutor
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-[#DBEAFE] text-[#64748B] hover:text-[#172554]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="p-3 space-y-1 overflow-y-auto flex-1">
              {allItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-snow-sm'
                        : 'text-[#475569] hover:bg-[#F0F6FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Profile bottom in drawer */}
            <div className="p-4 border-t border-[#DBEAFE] bg-[#F0F6FF] flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#DBEAFE]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#172554] truncate">{student.name}</p>
                <p className="text-xs text-[#64748B] truncate">{student.department}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#DBEAFE] flex items-center justify-around px-2 z-40">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#172554]'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#EFF6FF]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#2563EB] absolute bottom-1" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
