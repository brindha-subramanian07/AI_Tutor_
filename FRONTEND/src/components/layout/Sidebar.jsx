import React from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  HelpCircle,
  PieChart,
  Users2,
  MessageSquareQuote,
  TrendingUp,
  Compass,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, student, rooms } = useLearning();

  const totalActiveDoubts = rooms.reduce((acc, r) => acc + (r.activeDoubts || 0), 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'analysis', label: 'Quiz Analysis', icon: PieChart, badge: 'Pie Chart' },
    { id: 'rooms', label: 'Learning Rooms', icon: Users2, badge: `${rooms.length}` },
    { id: 'doubts', label: 'Doubts', icon: MessageSquareQuote, badge: totalActiveDoubts > 0 ? `${totalActiveDoubts}` : null },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Compass, badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[#DBEAFE] bg-[#FFFFFF] transition-all duration-300 relative select-none shrink-0 z-30 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#DBEAFE]">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-snow-sm shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#172554]">
                AI Tutor
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                PRO
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-7 h-7 rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center transition-colors cursor-pointer"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-snow-md'
                  : 'text-[#475569] hover:text-[#172554] hover:bg-[#F0F6FF]'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#2563EB] group-hover:scale-105'
                }`}
              />

              {sidebarOpen && (
                <span className="flex-1 text-left truncate font-semibold">
                  {item.label}
                </span>
              )}

              {sidebarOpen && item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : item.badge === 'Pie Chart' || item.badge === 'AI'
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]'
                      : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#172554] text-white text-xs rounded-md shadow-snow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Student Streak & Quick Info Card */}
      {sidebarOpen ? (
        <div className="p-3.5 m-3 rounded-2xl bg-[#F0F6FF] border border-[#DBEAFE]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Learning Streak
            </span>
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#2563EB]">
              <Flame className="w-4 h-4 fill-[#2563EB] text-[#2563EB] animate-pulse" />
              <span>{student.streak} Days</span>
            </div>
          </div>
          <div className="w-full bg-[#DBEAFE] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] h-full rounded-full transition-all"
              style={{ width: `${Math.min(student.streak * 14, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            Target: 10 days streak for "Mastery Scholar" badge
          </p>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-[#DBEAFE]">
          <div
            className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]"
            title={`${student.streak} Day Learning Streak`}
          >
            <Flame className="w-5 h-5 fill-[#2563EB]" />
          </div>
        </div>
      )}

      {/* Mini Profile Footer */}
      <div className="p-3 border-t border-[#DBEAFE] flex items-center gap-3">
        <img
          src={student.avatar}
          alt={student.name}
          className="w-9 h-9 rounded-xl object-cover border border-[#DBEAFE] shrink-0"
        />
        {sidebarOpen && (
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => setActiveTab('settings')}
          >
            <p className="text-xs font-bold text-[#172554] truncate">
              {student.name}
            </p>
            <p className="text-[11px] text-[#64748B] truncate">
              {student.program.split(' ')[0]} • Sem 6
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
