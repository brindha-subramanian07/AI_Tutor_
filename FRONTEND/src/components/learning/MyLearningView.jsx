import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Clock,
  Search,
  Bookmark,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const MyLearningView = () => {
  const { topics, recentSessions, startTopic, startQuiz } = useLearning();
  const [filterTab, setFilterTab] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const allTopicsList = Object.values(topics);

  const filtered = allTopicsList.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.category.toLowerCase().includes(searchFilter.toLowerCase());

    const session = recentSessions.find((s) => s.topicId === t.id);
    const isCompleted = session?.progress >= 100;

    if (!matchesSearch) return false;
    if (filterTab === 'in-progress') return !isCompleted;
    if (filterTab === 'completed') return isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
            Curriculum Tracker
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] mt-0.5">
            My Learning & Syllabus History
          </h2>
          <p className="text-xs md:text-sm text-[#676282]">
            Track your completed visual lectures, ongoing practice modules, and archived sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {allTopicsList.length} Active Modules
          </Badge>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#676282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search my courses..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#FFFFFF] border border-[#E6E8F6] rounded-xl text-[#1E1B33] placeholder-[#676282] focus:outline-none focus:border-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterTab === 'all'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilterTab('in-progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterTab === 'in-progress'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterTab === 'completed'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((topic) => {
          const session = recentSessions.find((s) => s.topicId === topic.id);
          const progress = session ? session.progress : 20;
          const isComplete = progress >= 100;

          return (
            <div
              key={topic.id}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm hover:border-[#DCD3FC] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={isComplete ? "mint" : "primary"} size="sm">
                    {isComplete ? "Completed" : `${progress}% Progress`}
                  </Badge>
                  <span className="text-xs text-[#676282] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    {topic.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-[#676282] leading-relaxed line-clamp-2">
                  {topic.summary}
                </p>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="w-full bg-[#F8F9FE] border border-[#E6E8F6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isComplete
                          ? 'bg-[#10B981]'
                          : 'bg-gradient-to-r from-[#7C5CFC] to-[#9678FA]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F0F2FA] flex items-center gap-2">
                <button
                  onClick={() => startTopic(topic.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-snow-sm transition-all"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Resume Lesson</span>
                </button>
                <button
                  onClick={() => startQuiz(topic.id)}
                  className="py-2 px-3 rounded-xl bg-[#F8F9FE] hover:bg-[#F2F4FB] border border-[#E6E8F6] text-xs font-bold text-[#1E1B33] transition-colors"
                >
                  Quiz
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
