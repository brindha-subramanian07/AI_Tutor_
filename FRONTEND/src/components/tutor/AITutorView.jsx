import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { LecturePlayer } from './LecturePlayer';
import { AIEvaluationTabs } from './AIEvaluationTabs';
import {
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  HelpCircle,
  Share2,
  Bookmark,
  Layers,
  Search,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AITutorView = () => {
  const {
    currentTopic,
    topics,
    startTopic,
    generateNewLecture,
    isGeneratingLecture,
    generationState,
    generationMessage,
    generationError,
    startQuiz,
    addToast,
    setCopilotOpen
  } = useLearning();

  const [inputQuery, setInputQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isGeneratingLecture) return;

    // Trigger full fresh generation pipeline
    generateNewLecture(inputQuery, true);
    setInputQuery('');
  };

  const handleRegenerateCurrent = () => {
    if (isGeneratingLecture) return;
    generateNewLecture(currentTopic.title, true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    addToast(
      isBookmarked ? 'Removed from bookmarked topics' : 'Saved to your study bookmarks!',
      'info'
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Lecture link copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Topic Switcher & AI Generator */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-5 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Quick Dropdown Topic Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#9678FA] flex items-center justify-center text-white shadow-snow-sm shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C5CFC]">
              Currently Studying
            </div>
            <div className="relative inline-block">
              <select
                value={currentTopic.id}
                onChange={(e) => startTopic(e.target.value)}
                className="font-extrabold text-sm md:text-base text-[#1E1B33] bg-transparent pr-6 cursor-pointer focus:outline-none appearance-none"
              >
                {Object.values(topics).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#676282] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Input for Any Topic Generation */}
        <form onSubmit={handleQuerySubmit} className="flex-1 max-w-lg">
          <div className="flex items-center bg-[#F8F9FE] border border-[#E6E8F6] focus-within:border-[#7C5CFC] rounded-2xl p-1.5 transition-all">
            <Search className="w-4 h-4 text-[#676282] ml-2 shrink-0" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI Tutor to explain any topic..."
              className="w-full bg-transparent px-3 py-1.5 text-xs md:text-sm text-[#1E1B33] placeholder-[#676282] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isGeneratingLecture || !inputQuery.trim()}
              className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] disabled:opacity-40 text-white font-bold text-xs shadow-snow-sm transition-all shrink-0"
            >
              Generate
            </button>
          </div>
        </form>

        {/* Share & Bookmark Actions */}
        {/* Share, Bookmark & Regenerate Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRegenerateCurrent}
            disabled={isGeneratingLecture}
            className="p-2.5 rounded-xl bg-[#F8F9FE] hover:bg-[#F2F4FB] border border-[#E6E8F6] text-[#676282] hover:text-[#7C5CFC] disabled:opacity-40 transition-colors"
            title="Regenerate full 8-scene educational curriculum"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingLecture ? 'animate-spin text-[#7C5CFC]' : ''}`} />
          </button>
          <button
            onClick={() => setCopilotOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[#F1EDFE] hover:bg-[#EAE4FE] text-[#7C5CFC] font-bold text-xs flex items-center gap-2 border border-[#DCD3FC] shadow-snow-sm transition-all cursor-pointer"
            title="Open AI Tutor Copilot"
          >
            <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-[#F1EDFE] text-[#7C5CFC] border-[#DCD3FC]'
                : 'bg-[#F8F9FE] text-[#676282] hover:text-[#1E1B33] border-[#E6E8F6]'
            }`}
            title="Bookmark topic"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#7C5CFC]' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-[#F8F9FE] hover:bg-[#F2F4FB] border border-[#E6E8F6] text-[#676282] hover:text-[#1E1B33] transition-colors"
            title="Share lecture link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => startQuiz(currentTopic.id)}
            className="px-4 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white font-bold text-xs flex items-center gap-2 shadow-snow-sm transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Topic Quiz</span>
          </button>
        </div>
      </div>

      {/* Explicit Generation Progress Tracker (Phase 6) */}
      {isGeneratingLecture && (
        <div className="max-w-5xl mx-auto p-4 rounded-3xl bg-[#F1EDFE] border border-[#DCD3FC] shadow-snow-md space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-[#7C5CFC]">
              <Loader2 className="w-4 h-4 animate-spin text-[#7C5CFC]" />
              <span>AI Educational Generation Pipeline Active</span>
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#676282] bg-white px-2.5 py-0.5 rounded-full border border-[#DCD3FC]">
              {generationState}
            </span>
          </div>
          <p className="text-xs text-[#1E1B33] font-medium">
            {generationMessage || "Synthesizing authoritative curriculum, visual models, and speech narration..."}
          </p>
          {/* Multi-stage pipeline stepper indicators */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1">
            <div className={`p-1.5 rounded-xl border ${['preparing', 'validating', 'visuals', 'narration', 'ready'].includes(generationState) ? 'bg-white border-[#7C5CFC] text-[#7C5CFC] font-bold' : 'bg-white/50 text-[#676282] border-transparent'}`}>
              1. Curriculum Plan
            </div>
            <div className={`p-1.5 rounded-xl border ${['validating', 'visuals', 'narration', 'ready'].includes(generationState) ? 'bg-white border-[#7C5CFC] text-[#7C5CFC] font-bold' : 'bg-white/50 text-[#676282] border-transparent'}`}>
              2. Code & Factual Check
            </div>
            <div className={`p-1.5 rounded-xl border ${['visuals', 'narration', 'ready'].includes(generationState) ? 'bg-white border-[#7C5CFC] text-[#7C5CFC] font-bold' : 'bg-white/50 text-[#676282] border-transparent'}`}>
              3. Visual Models
            </div>
            <div className={`p-1.5 rounded-xl border ${['narration', 'ready'].includes(generationState) ? 'bg-white border-[#7C5CFC] text-[#7C5CFC] font-bold' : 'bg-white/50 text-[#676282] border-transparent'}`}>
              4. Audio Sync
            </div>
          </div>
        </div>
      )}

      {/* Generation Error Recovery Alert */}
      {generationError && !isGeneratingLecture && (
        <div className="max-w-5xl mx-auto p-4 rounded-3xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{generationError}</span>
          </div>
          <button
            onClick={handleRegenerateCurrent}
            className="px-3 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] transition-all shrink-0"
          >
            Retry Generation
          </button>
        </div>
      )}

      {/* Main Lecture & Diagnostic Layout */}
      <div className="max-w-5xl mx-auto space-y-6">
        <LecturePlayer />

        {/* Topic Title & Summary Card */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                {currentTopic.category}
              </Badge>
              <Badge variant="accent" size="sm">
                Difficulty: {currentTopic.difficulty}
              </Badge>
              <Badge variant="default" size="sm" icon={Clock}>
                Est. Duration: {currentTopic.duration}
              </Badge>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[#F8F9FE] text-[#7C5CFC] border border-[#E6E8F6]">
                {currentTopic.slides?.length || 0} Interactive Scenes
              </span>
            </div>

            <button
              onClick={handleRegenerateCurrent}
              disabled={isGeneratingLecture}
              className="text-xs text-[#7C5CFC] hover:text-[#6846EB] font-bold flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:bg-[#F1EDFE] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Lesson</span>
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] tracking-tight">
            {currentTopic.title}
          </h2>

          <p className="text-sm md:text-base text-[#676282] leading-relaxed">
            {currentTopic.summary}
          </p>
        </div>

        <AIEvaluationTabs />
      </div>
    </div>
  );
};
