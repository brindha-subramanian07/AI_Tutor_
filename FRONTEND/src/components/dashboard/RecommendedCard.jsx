import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Compass, Sparkles, Clock, Target, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RecommendedCard = () => {
  const { recommendations, startTopic, generateNewLecture, setActiveTab } = useLearning();

  const handleStartRec = (rec) => {
    generateNewLecture(rec.title);
  };

  return (
    <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F1EDFE] border border-[#DCD3FC] flex items-center justify-center text-[#7C5CFC]">
              <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E1B33]">
                Recommended for You
              </h3>
              <p className="text-xs text-[#676282]">
                AI-diagnosed based on your quiz weak areas
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="text-xs font-bold text-[#7C5CFC] hover:underline"
          >
            All Recommendations →
          </button>
        </div>

        <div className="space-y-3">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] hover:border-[#DCD3FC] transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {rec.urgency}
                  </Badge>
                  <span className="text-[11px] font-semibold text-[#676282] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#7C5CFC]" />
                    {rec.timeEst}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors">
                  {rec.title}
                </h4>

                <p className="text-xs text-[#676282] leading-relaxed">
                  {rec.reason}
                </p>

                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-[#7C5CFC]">
                  <Target className="w-3.5 h-3.5 text-[#9678FA] shrink-0" />
                  <span>Targets weak spot: <strong className="font-semibold text-[#1E1B33]">{rec.relatedWeakConcept}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleStartRec(rec)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#7C5CFC] text-[#1E1B33] hover:text-white border border-[#E6E8F6] hover:border-[#7C5CFC] text-xs font-bold transition-all shadow-snow-sm"
              >
                <span>Start AI Guided Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
