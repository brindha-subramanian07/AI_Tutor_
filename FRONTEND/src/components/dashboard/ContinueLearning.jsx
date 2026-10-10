import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { PlayCircle, Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ContinueLearning = () => {
  const { recentSessions, startTopic, topics } = useLearning();

  return (
    <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#1E1B33] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7C5CFC]" />
            <span>Continue Learning</span>
          </h3>
          <p className="text-xs text-[#676282]">
            Pick up right where you left off in your personalized study sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentSessions.slice(0, 3).map((session, idx) => {
          const isComplete = session.progress >= 100;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] p-4 flex flex-col justify-between hover:border-[#DCD3FC] hover:bg-[#F1EDFE]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant={isComplete ? "mint" : "primary"}
                    size="sm"
                  >
                    {isComplete ? "Completed" : `${session.progress}% Complete`}
                  </Badge>
                  <span className="text-[11px] font-medium text-[#676282] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {session.lastAccessed}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors line-clamp-2">
                  {session.title}
                </h4>
                <p className="text-xs text-[#676282] mt-1">
                  {session.category}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6E8F6] space-y-3">
                {/* Progress bar */}
                <div className="w-full bg-[#E6E8F6] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isComplete
                        ? 'bg-[#10B981]'
                        : 'bg-gradient-to-r from-[#7C5CFC] to-[#9678FA]'
                    }`}
                    style={{ width: `${session.progress}%` }}
                  />
                </div>

                <button
                  onClick={() => startTopic(session.topicId)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isComplete
                      ? 'bg-[#FFFFFF] text-[#1E1B33] hover:bg-[#F8F9FE] border border-[#E6E8F6]'
                      : 'bg-[#7C5CFC] text-white hover:bg-[#6846EB] shadow-snow-sm'
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{isComplete ? 'Review Lecture' : 'Continue Learning'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
