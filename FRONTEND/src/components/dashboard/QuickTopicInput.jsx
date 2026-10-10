import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { Sparkles, ArrowRight, BookOpen, Lightbulb, Loader2 } from 'lucide-react';
import { AISparkle } from '../common/AutumnMotif';

export const QuickTopicInput = () => {
  const { generateNewLecture, startTopic, isGeneratingLecture, topics } = useLearning();
  const [topicInput, setTopicInput] = useState('');

  const quickPicks = [
    { label: "Explain loops in Python", id: "loops-in-python" },
    { label: "Newton's Third Law", id: "newtons-third-law" },
    { label: "Binary Search Trees", id: "binary-search-trees" },
    { label: "Backpropagation in Neural Networks", id: null },
    { label: "Database Normalization", id: null }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicInput.trim() || isGeneratingLecture) return;

    const matchingKey = Object.keys(topics).find(
      (k) =>
        k.toLowerCase() === topicInput.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
        topics[k].title.toLowerCase().includes(topicInput.toLowerCase())
    );

    if (matchingKey) {
      startTopic(matchingKey);
    } else {
      generateNewLecture(topicInput);
    }
  };

  const handleChipClick = (item) => {
    if (item.id && topics[item.id]) {
      startTopic(item.id);
    } else {
      setTopicInput(item.label);
      generateNewLecture(item.label);
    }
  };

  return (
    <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 md:p-8 shadow-snow-md relative">
      <div className="flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F1EDFE] flex items-center justify-center text-[#7C5CFC]">
              <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#1E1B33]">
                AI Tutor On-Demand Lecture Engine
              </h3>
              <p className="text-xs text-[#676282]">
                Enter any academic concept to generate a structured visual lecture, narration & quiz.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            AI Ready
          </span>
        </div>

        {/* Large Prominent Input Form */}
        <form onSubmit={handleSubmit} className="relative mt-2">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#F8F9FE] border-2 border-[#E6E8F6] focus-within:border-[#7C5CFC] rounded-2xl p-2 transition-all shadow-inner">
            <div className="flex items-center flex-1 px-3 py-2">
              <Sparkles className="w-5 h-5 text-[#7C5CFC] mr-3 shrink-0" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="What do you want to learn today? (e.g. Explain Python loops with examples...)"
                disabled={isGeneratingLecture}
                className="w-full bg-transparent text-sm md:text-base font-medium text-[#1E1B33] placeholder-[#676282]/80 focus:outline-none"
              />
            </div>

            {/* AI Tutor Action Button */}
            <button
              type="submit"
              disabled={isGeneratingLecture || !topicInput.trim()}
              className="mt-2 sm:mt-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] hover:from-[#6846EB] hover:to-[#7C5CFC] disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-snow-md hover:shadow-snow-lg transition-all active:scale-[0.98] shrink-0"
            >
              {isGeneratingLecture ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Lecture...</span>
                </>
              ) : (
                <>
                  <AISparkle className="w-4 h-4 text-white" />
                  <span>Generate Lecture</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-[#676282] flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
            Trending topics:
          </span>
          {quickPicks.map((pick, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(pick)}
              disabled={isGeneratingLecture}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#F8F9FE] hover:bg-[#F1EDFE] border border-[#E6E8F6] text-[#1E1B33] hover:text-[#7C5CFC] hover:border-[#DCD3FC] transition-colors"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
