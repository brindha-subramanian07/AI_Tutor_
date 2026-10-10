import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { TrendingUp, Flame, CheckCircle2, Award, Clock } from 'lucide-react';

export const ProgressOverview = () => {
  const { student, analytics, setActiveTab } = useLearning();

  const metrics = [
    {
      title: "Overall Syllabus",
      value: `${student.overallProgress}%`,
      subtitle: "Curriculum Completion",
      icon: TrendingUp,
      color: "text-[#7C5CFC]",
      bg: "bg-[#F1EDFE]",
      border: "border-[#DCD3FC]",
      progress: student.overallProgress
    },
    {
      title: "Active Streak",
      value: `${student.streak} Days`,
      subtitle: "Consistent Study Days",
      icon: Flame,
      color: "text-[#9678FA]",
      bg: "bg-[#F5F2FF]",
      border: "border-[#E5DEFC]",
      progress: Math.min(student.streak * 10, 100)
    },
    {
      title: "Topics Mastered",
      value: `${student.topicsCompleted}`,
      subtitle: "Across 4 Subjects",
      icon: CheckCircle2,
      color: "text-[#10B981]",
      bg: "bg-[#ECFDF5]",
      border: "border-[#A7F3D0]",
      progress: 80
    },
    {
      title: "Quiz Performance",
      value: `${student.averageScore}%`,
      subtitle: `${student.quizzesTaken} Quizzes Evaluated`,
      icon: Award,
      color: "text-[#F59E0B]",
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      progress: student.averageScore
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-bold text-[#1E1B33] flex items-center gap-2">
          <span>Learning Progress & Diagnostics</span>
        </h3>
        <button
          onClick={() => setActiveTab('progress')}
          className="text-xs font-bold text-[#7C5CFC] hover:underline"
        >
          View Detailed Analytics →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] p-5 shadow-snow-sm hover:shadow-snow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#676282] uppercase tracking-wider">
                    {m.title}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${m.bg} ${m.border} border flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                </div>

                <div className="text-2xl font-black text-[#1E1B33] tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs text-[#676282] mt-0.5">
                  {m.subtitle}
                </div>
              </div>

              {/* Progress bar line */}
              <div className="mt-4 pt-2 border-t border-[#F0F2FA]">
                <div className="w-full bg-[#F8F9FE] border border-[#E6E8F6] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#7C5CFC] via-[#9678FA] to-[#A78BFA] h-full rounded-full transition-all duration-500"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
