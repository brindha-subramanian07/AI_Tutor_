import React from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  TrendingUp,
  Flame,
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  BarChart3,
  Target,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const ProgressDashboard = () => {
  const { student, analytics, startTopic, generateNewLecture } = useLearning();

  const daysArray = Array.from({ length: 35 }, (_, i) => {
    const intensity = (i * 7 + 3) % 5;
    return { day: i + 1, level: intensity };
  });

  const getHeatmapColor = (level) => {
    switch (level) {
      case 0: return 'bg-[#F8F9FE] border-[#E6E8F6] text-[#676282]';
      case 1: return 'bg-[#EDE9FE] border-[#DDD6FE] text-[#6D28D9]';
      case 2: return 'bg-[#C4B5FD] border-[#A78BFA] text-[#4C1D95]';
      case 3: return 'bg-[#9678FA] border-[#7C5CFC] text-white';
      case 4: return 'bg-[#7C5CFC] border-[#5638DC] text-white';
      default: return 'bg-[#F8F9FE]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
              Student Diagnostics
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] mt-0.5">
            Academic Performance & Analytics
          </h2>
          <p className="text-xs md:text-sm text-[#676282]">
            AI-driven learning trajectory, weekly study velocity, and conceptual mastery breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6]">
            <Flame className="w-5 h-5 text-[#7C5CFC] fill-[#7C5CFC]" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#1E1B33]">{student.streak} Days</span>
              <span className="text-[10px] text-[#676282]">Active Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
          <span className="text-xs font-bold text-[#676282] uppercase tracking-wider">Syllabus Progress</span>
          <div className="text-2xl font-black text-[#1E1B33] mt-1">{student.overallProgress}%</div>
          <div className="w-full bg-[#F8F9FE] h-1.5 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-[#7C5CFC]" style={{ width: `${student.overallProgress}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
          <span className="text-xs font-bold text-[#676282] uppercase tracking-wider">Topics Mastered</span>
          <div className="text-2xl font-black text-[#10B981] mt-1">{student.topicsCompleted}</div>
          <span className="text-[11px] text-[#676282]">Verified in quizzes</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
          <span className="text-xs font-bold text-[#676282] uppercase tracking-wider">Avg. Quiz Accuracy</span>
          <div className="text-2xl font-black text-[#F59E0B] mt-1">{student.averageScore}%</div>
          <span className="text-[11px] text-[#676282]">{student.quizzesTaken} Quizzes Taken</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm">
          <span className="text-xs font-bold text-[#676282] uppercase tracking-wider">Study Hours</span>
          <div className="text-2xl font-black text-[#7C5CFC] mt-1">{student.hoursLearned} hrs</div>
          <span className="text-[11px] text-[#676282]">This semester</span>
        </div>
      </div>

      {/* Two Column Section: Weekly Activity Chart + 30-Day Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1E1B33] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#7C5CFC]" />
                <span>Weekly Learning Activity & Quiz Velocity</span>
              </h3>
              <p className="text-xs text-[#676282]">Hours spent per day and performance</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F9FE] text-[#676282] border border-[#E6E8F6]">
              Current Week
            </span>
          </div>

          <div className="pt-6 pb-2 flex items-end justify-between gap-2 h-52">
            {analytics.weeklyActivity.map((day, idx) => {
              const maxHours = 5.0;
              const heightPercent = Math.round((day.hours / maxHours) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E1B33] text-white text-[10px] font-bold px-2 py-1 rounded shadow-snow-md whitespace-nowrap pointer-events-none z-10">
                    {day.hours} hrs • {day.quizzes} Quizzes ({day.score}%)
                  </div>

                  <div className="w-full max-w-[36px] bg-[#F8F9FE] rounded-t-xl h-full flex items-end p-1 border border-[#E6E8F6]">
                    <div
                      className="w-full bg-gradient-to-t from-[#7C5CFC] to-[#9678FA] group-hover:from-[#5638DC] group-hover:to-[#7C5CFC] rounded-lg transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#676282] group-hover:text-[#1E1B33]">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 30-Day Activity Heatmap */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1E1B33] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#9678FA]" />
                <span>30-Day Activity Heatmap</span>
              </h3>
            </div>
            <p className="text-xs text-[#676282] mt-0.5">
              Consistent daily engagement builds exponential retention
            </p>

            <div className="grid grid-cols-7 gap-1.5 mt-5">
              {daysArray.map((cell) => (
                <div
                  key={cell.day}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all ${getHeatmapColor(cell.level)}`}
                  title={`Day ${cell.day}: Activity Level ${cell.level}`}
                >
                  {cell.day}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-[#676282] pt-3 border-t border-[#F0F2FA]">
            <span>Less Active</span>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded bg-[#F8F9FE] border border-[#E6E8F6]" />
              <div className="w-3.5 h-3.5 rounded bg-[#EDE9FE]" />
              <div className="w-3.5 h-3.5 rounded bg-[#C4B5FD]" />
              <div className="w-3.5 h-3.5 rounded bg-[#9678FA]" />
              <div className="w-3.5 h-3.5 rounded bg-[#7C5CFC]" />
            </div>
            <span>High Intensity</span>
          </div>
        </div>
      </div>

      {/* Strengths vs Weak Areas Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1E1B33] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              <span>Demonstrated Strengths</span>
            </h3>
            <Badge variant="mint" size="sm">
              Above 85%
            </Badge>
          </div>

          <div className="space-y-3">
            {analytics.strongAreas.map((sa, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1E1B33]">{sa.subject}</span>
                  <span className="text-xs font-bold text-[#10B981]">{sa.mastery}%</span>
                </div>
                <div className="w-full bg-[#E6E8F6] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10B981]" style={{ width: `${sa.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1E1B33] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#F43F5E]" />
              <span>Target Weak Areas & AI Prescriptions</span>
            </h3>
            <Badge variant="rose" size="sm">
              Focus Needed
            </Badge>
          </div>

          <div className="space-y-3">
            {analytics.weakAreas.map((wa, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1E1B33]">{wa.subject}</span>
                  <span className="text-xs font-bold text-[#F43F5E]">{wa.mastery}%</span>
                </div>
                <div className="w-full bg-[#E6E8F6] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F43F5E]" style={{ width: `${wa.mastery}%` }} />
                </div>
                <div className="text-xs text-[#676282] flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C5CFC] shrink-0 mt-0.5" />
                  <span>{wa.tip}</span>
                </div>
                <button
                  onClick={() => generateNewLecture(wa.subject)}
                  className="text-xs font-bold text-[#7C5CFC] hover:underline flex items-center gap-1"
                >
                  <span>Generate targeted remedial lesson</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
