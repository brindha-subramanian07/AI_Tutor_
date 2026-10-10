import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Flame, Sparkles, Award, ArrowUpRight, GraduationCap } from 'lucide-react';
import { LavenderPetal, Snowflake } from '../common/AutumnMotif';

export const WelcomeBanner = () => {
  const { student, setActiveTab } = useLearning();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFFFF] via-[#F8F9FE] to-[#F1F3FB] border border-[#E6E8F6] p-6 md:p-8 shadow-snow-md">
      {/* Decorative Soft Blue Glows */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-60 h-60 rounded-full bg-[#2563EB]/10 pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 rounded-full bg-[#38BDF8]/12 pointer-events-none blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Greeting & Motivational Message */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1EDFE] border border-[#DCD3FC] text-xs font-semibold text-[#7C5CFC]">
            <LavenderPetal className="w-3.5 h-3.5 text-[#7C5CFC]" />
            <span>AI Digital Campus • Soft Blue Edition</span>
            <span className="w-1 h-1 rounded-full bg-[#9678FA]" />
            <span className="text-[#676282]">{student.semester}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            <span className="text-[#0F172A] font-extrabold">
              {getGreeting()},
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#38BDF8]">
              {student.name}
            </span>
            <span className="text-[#0F172A]">!</span> ✨
          </h2>

          <p className="text-sm md:text-base text-[#676282] leading-relaxed">
            "Welcome back to your personalized learning space. Today is a great day to master new concepts,
            explore interactive lectures, and sharpen your skills."
          </p>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
              <Flame className="w-4 h-4 text-[#7C5CFC] fill-[#7C5CFC]" />
              <span className="text-xs font-bold text-[#1E1B33]">
                {student.streak} Days Streak
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
              <Award className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#1E1B33]">
                {student.averageScore}% Avg Quiz Score
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
              <GraduationCap className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-bold text-[#1E1B33]">
                {student.topicsCompleted} Topics Mastered
              </span>
            </div>
          </div>
        </div>

        {/* Right: Avatar Profile Summary */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFFFFF]/90 border border-[#E6E8F6] shadow-snow-sm shrink-0">
          <div className="relative">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#7C5CFC]"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-[#FFFFFF] flex items-center justify-center text-white text-[9px] font-bold">
              ✓
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1E1B33]">{student.name}</span>
            <span className="text-xs text-[#676282]">{student.program}</span>
            <button
              onClick={() => setActiveTab('progress')}
              className="mt-2 text-xs font-semibold text-[#7C5CFC] hover:text-[#5638DC] flex items-center gap-1 transition-colors"
            >
              <span>View Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
