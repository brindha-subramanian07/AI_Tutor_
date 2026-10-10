import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Compass,
  Sparkles,
  Clock,
  Target,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const RecommendationsView = () => {
  const { recommendations, generateNewLecture, startTopic } = useLearning();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Programming & Python', 'Physics & Mechanics', 'Data Structures', 'Machine Learning & AI'];

  const filtered = selectedFilter === 'All'
    ? recommendations
    : recommendations.filter((r) => r.category === selectedFilter);

  const handleStart = (rec) => {
    generateNewLecture(rec.title);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
              Adaptive Curriculum
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] mt-0.5">
            AI-Powered Personalized Recommendations
          </h2>
          <p className="text-xs md:text-sm text-[#676282]">
            Intelligent recommendations synthesized by diagnosing your quiz errors, weak concepts, and semester targets.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] text-xs font-bold text-[#7C5CFC]">
          <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
          <span>Continuous Diagnostic Loop Active</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedFilter === cat
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] hover:bg-[#F8F9FE] border border-[#E6E8F6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm hover:shadow-snow-md hover:border-[#DCD3FC] transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  {rec.urgency}
                </Badge>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#676282]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    {rec.timeEst}
                  </span>
                  <span>•</span>
                  <span>Difficulty: {rec.difficulty}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#7C5CFC]">
                  {rec.category}
                </span>
                <h3 className="text-lg font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors mt-0.5">
                  {rec.title}
                </h3>
              </div>

              {/* Why Recommended Callout */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] space-y-1.5">
                <div className="text-xs font-bold text-[#7C5CFC] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  <span>Why this topic is recommended:</span>
                </div>
                <p className="text-xs text-[#1E1B33] leading-relaxed">
                  "{rec.reason}"
                </p>
              </div>

              {/* Related Weak Concept Tag */}
              <div className="flex items-center gap-2 text-xs text-[#676282]">
                <Target className="w-4 h-4 text-[#F43F5E] shrink-0" />
                <span>
                  Diagnosed gap: <strong className="text-[#1E1B33]">{rec.relatedWeakConcept}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleStart(rec)}
              className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] hover:opacity-95 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-snow-sm transition-all"
            >
              <span>Start Learning Lecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
