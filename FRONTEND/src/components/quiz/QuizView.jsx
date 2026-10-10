import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { QuizActive } from './QuizActive';
import { QuizResults } from './QuizResults';
import { HelpCircle, ChevronDown, PieChart, ListChecks, RotateCcw } from 'lucide-react';

export const QuizView = () => {
  const {
    topics,
    quizTopicId,
    setQuizTopicId,
    quizSubmitted,
    startQuiz,
    setActiveTab
  } = useLearning();

  // Allow switching between Taking the Quiz and Viewing the Pie Chart Analysis
  const [activeSubTab, setActiveSubTab] = useState(quizSubmitted ? 'analysis' : 'questions');

  // Sync if quiz gets submitted
  React.useEffect(() => {
    if (quizSubmitted) {
      setActiveSubTab('analysis');
    }
  }, [quizSubmitted]);

  const handleTopicChange = (e) => {
    startQuiz(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Top Navigation Bar with Diagnostic Selector & View Switcher */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-5 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-snow-sm shrink-0">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Diagnostic Quiz Studio
            </span>
            <div className="relative inline-block">
              <select
                value={quizTopicId}
                onChange={handleTopicChange}
                className="font-black text-sm md:text-base text-[#1E1B33] bg-transparent pr-6 cursor-pointer focus:outline-none appearance-none"
              >
                {Object.values(topics).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.quizQuestions?.length || 0} questions)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#676282] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View Switcher: Questions vs Pie Chart Analysis */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center p-1 rounded-2xl bg-[#F0F6FF] border border-[#DBEAFE] text-xs">
            <button
              onClick={() => setActiveSubTab('questions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSubTab === 'questions'
                  ? 'bg-[#2563EB] text-white shadow-snow-sm'
                  : 'text-[#676282] hover:text-[#1E1B33]'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>Questions</span>
            </button>
            <button
              onClick={() => setActiveSubTab('analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSubTab === 'analysis'
                  ? 'bg-[#2563EB] text-white shadow-snow-sm'
                  : 'text-[#676282] hover:text-[#1E1B33]'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Pie Chart Analysis</span>
            </button>
          </div>

          <button
            onClick={() => {
              startQuiz(quizTopicId);
              setActiveSubTab('questions');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#F8F9FE] hover:bg-[#F2F4FB] border border-[#E6E8F6] text-xs font-bold text-[#1E1B33] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset answers and retake quiz"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#676282]" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Render Active View: Interactive Pie Chart Analysis or Questions */}
      {activeSubTab === 'analysis' ? <QuizResults /> : <QuizActive />}
    </div>
  );
};
