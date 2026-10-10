import React, { useState, useEffect } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Code2,
  Terminal,
  RotateCcw,
  Check,
  FileCode,
  Layers
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const QuizActive = () => {
  const {
    topics,
    quizTopicId,
    quizAnswers,
    setQuizAnswers,
    submitQuiz,
    addToast
  } = useLearning();

  const topic = topics[quizTopicId] || Object.values(topics)[0];
  const questions = topic?.quizQuestions || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!questions.length) {
    return (
      <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1B33] border border-[#E6E8F6] dark:border-[#2D2B45] p-8 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-[#7C5CFC] mx-auto opacity-60" />
        <h3 className="text-lg font-bold text-[#1E1B33] dark:text-white">No Quiz Generated Yet</h3>
        <p className="text-sm text-[#676282] dark:text-[#A5A0C8]">
          This topic is currently compiling questions. Select another topic to take a quiz.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  // Robust determination of question type
  const rawType = (
    currentQ.questionType ||
    currentQ.question_type ||
    ''
  ).toLowerCase();

  const hasCodingDetails = !!(currentQ.codingDetails || currentQ.coding_details);
  const hasOptions = Array.isArray(currentQ.options) && currentQ.options.length > 0;

  let questionType = 'mcq';
  if (rawType.includes('code') || rawType === 'coding' || hasCodingDetails) {
    questionType = 'coding';
  } else if (rawType.includes('blank') || rawType === 'fill_blank' || !hasOptions) {
    questionType = 'fill_blank';
  } else if (rawType.includes('true') || currentQ.options?.length === 2 && currentQ.options[0]?.toLowerCase() === 'true') {
    questionType = 'true_false';
  }

  // Auto-populate starter code for coding questions if answer not yet set
  useEffect(() => {
    if (questionType === 'coding') {
      const existing = quizAnswers[currentQ.id];
      const codingInfo = currentQ.codingDetails || currentQ.coding_details;
      const starter = codingInfo?.starter_code || 'def solution():\n    pass\n';
      if ((existing === undefined || existing === null) && starter) {
        setQuizAnswers((prev) => ({
          ...prev,
          [currentQ.id]: starter
        }));
      }
    }
  }, [currentQ.id, questionType]);

  // Count answered questions (validating that non-empty string or integer is present)
  const answeredCount = Object.values(quizAnswers).filter(
    (ans) => ans !== undefined && ans !== null && String(ans).trim() !== ''
  ).length;

  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleSelectOption = (optIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const handleTextAnswerChange = (val) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      if (
        !window.confirm(
          `You have answered ${answeredCount} of ${questions.length} questions. Submit anyway?`
        )
      ) {
        return;
      }
    }
    submitQuiz();
  };

  const codingInfo = currentQ.codingDetails || currentQ.coding_details;

  return (
    <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1B33] border border-[#E6E8F6] dark:border-[#2D2B45] p-6 md:p-8 shadow-snow-md space-y-6 max-w-4xl mx-auto transition-colors">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E8F6] dark:border-[#2D2B45] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
              Diagnostic Assessment
            </span>
            <span className="text-xs text-[#676282] dark:text-[#A5A0C8]">•</span>
            <span className="text-xs text-[#676282] dark:text-[#A5A0C8]">{topic.category}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] dark:text-white mt-1">
            {topic.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <div className="text-xs font-semibold text-[#676282] dark:text-[#A5A0C8] bg-[#F8F9FE] dark:bg-[#181528] px-3 py-1.5 rounded-xl border border-[#E6E8F6] dark:border-[#2D2B45]">
            {answeredCount}/{questions.length} Answered
          </div>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#676282] dark:text-[#A5A0C8]">
          <span>Assessment Progress</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full bg-[#F8F9FE] dark:bg-[#181528] border border-[#E6E8F6] dark:border-[#2D2B45] rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Question Body */}
      <div className="space-y-5 pt-2">
        <div className="p-5 rounded-2xl bg-[#F8F9FE] dark:bg-[#181528] border border-[#E6E8F6] dark:border-[#2D2B45] space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-extrabold text-[#7C5CFC] uppercase tracking-wider">
              Question {currentQuestionIndex + 1}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-[#1E1B33] text-[#7C5CFC] border border-[#E6E8F6] dark:border-[#2D2B45]">
              {questionType === 'coding'
                ? 'Python Coding'
                : questionType === 'fill_blank'
                ? 'Fill in the Blank'
                : questionType === 'true_false'
                ? 'True / False'
                : 'Multiple Choice'}
            </span>
          </div>
          <p className="text-base md:text-lg font-bold text-[#1E1B33] dark:text-white leading-snug">
            {currentQ.question}
          </p>
        </div>

        {/* 1. Multiple Choice Options */}
        {questionType === 'mcq' && hasOptions && (
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected =
                quizAnswers[currentQ.id] === optIdx ||
                String(quizAnswers[currentQ.id]) === String(optIdx);
              const optionLetter = String.fromCharCode(65 + optIdx);

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group cursor-pointer ${
                    isSelected
                      ? 'bg-[#F1EDFE] dark:bg-[#7C5CFC]/20 border-[#7C5CFC] text-[#1E1B33] dark:text-white shadow-snow-sm ring-1 ring-[#7C5CFC]'
                      : 'bg-[#FFFFFF] dark:bg-[#181528] border-[#E6E8F6] dark:border-[#2D2B45] text-[#1E1B33] dark:text-white hover:bg-[#F8F9FE] dark:hover:bg-[#201D35] hover:border-[#DCD3FC]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                        : 'bg-[#F8F9FE] dark:bg-[#1E1B33] border border-[#E6E8F6] dark:border-[#2D2B45] text-[#676282] dark:text-[#A5A0C8] group-hover:text-[#1E1B33] dark:group-hover:text-white'
                    }`}
                  >
                    {optionLetter}
                  </div>
                  <span className="text-xs md:text-sm font-medium flex-1 leading-relaxed">
                    {option}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#7C5CFC] bg-[#7C5CFC] text-white'
                        : 'border-[#E6E8F6] dark:border-[#2D2B45] bg-[#F8F9FE] dark:bg-[#1E1B33]'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. True / False Options */}
        {questionType === 'true_false' && hasOptions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected =
                quizAnswers[currentQ.id] === optIdx ||
                String(quizAnswers[currentQ.id]).toLowerCase() === option.toLowerCase();

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-[#F1EDFE] dark:bg-[#7C5CFC]/20 border-[#7C5CFC] text-[#1E1B33] dark:text-white shadow-snow-sm ring-1 ring-[#7C5CFC]'
                      : 'bg-[#FFFFFF] dark:bg-[#181528] border-[#E6E8F6] dark:border-[#2D2B45] text-[#1E1B33] dark:text-white hover:bg-[#F8F9FE] dark:hover:bg-[#201D35]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        option.toLowerCase() === 'true' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                      }`}
                    />
                    <span className="text-base font-bold">{option}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#7C5CFC] bg-[#7C5CFC] text-white'
                        : 'border-[#E6E8F6] dark:border-[#2D2B45] bg-[#F8F9FE] dark:bg-[#1E1B33]'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Fill in the Blank Input Field */}
        {questionType === 'fill_blank' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#181528] border-2 border-[#7C5CFC]/40 focus-within:border-[#7C5CFC] shadow-snow-sm transition-all space-y-2">
              <label className="block text-xs font-bold text-[#7C5CFC] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Type Your Answer:</span>
                </span>
                {quizAnswers[currentQ.id]?.trim() && (
                  <button
                    onClick={() => handleTextAnswerChange('')}
                    className="text-[11px] text-[#676282] dark:text-[#A5A0C8] hover:text-[#EF4444] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={quizAnswers[currentQ.id] || ''}
                  onChange={(e) => handleTextAnswerChange(e.target.value)}
                  placeholder="Type the missing concept or term here (e.g. label)..."
                  className="w-full text-base md:text-lg font-bold text-[#1E1B33] dark:text-white bg-transparent focus:outline-none placeholder-[#94A3B8] dark:placeholder-[#64748B] py-1"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FE] dark:bg-[#181528] border border-[#E6E8F6] dark:border-[#2D2B45] text-xs text-[#676282] dark:text-[#A5A0C8] flex items-center justify-between flex-wrap gap-2">
              <span>💡 Tip: Enter the exact technical term or keyword discussed in the lecture.</span>
              {quizAnswers[currentQ.id]?.trim() ? (
                <span className="font-semibold text-[#10B981] flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Answer recorded: "{quizAnswers[currentQ.id].trim()}"
                </span>
              ) : (
                <span className="text-[11px] text-[#EF4444] font-medium">
                  Answer required before submitting
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4. Python Coding Problem with Integrated Editor */}
        {questionType === 'coding' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Coding Problem Specifications */}
            {codingInfo && (
              <div className="p-4 rounded-2xl bg-[#F8F9FE] dark:bg-[#181528] border border-[#E6E8F6] dark:border-[#2D2B45] space-y-3">
                {codingInfo.requirements && (
                  <div>
                    <span className="text-[11px] font-bold text-[#676282] dark:text-[#A5A0C8] uppercase tracking-wider block mb-1.5">
                      Problem Requirements:
                    </span>
                    <ul className="space-y-1 text-xs text-[#1E1B33] dark:text-white">
                      {codingInfo.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Constraints & Input/Output formats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E6E8F6] dark:border-[#2D2B45]">
                  {codingInfo.input_description && (
                    <div>
                      <span className="text-[10px] font-bold text-[#676282] dark:text-[#A5A0C8] uppercase">Input:</span>
                      <div className="font-mono text-[11px] text-[#1E1B33] dark:text-white mt-0.5">{codingInfo.input_description}</div>
                    </div>
                  )}
                  {codingInfo.output_description && (
                    <div>
                      <span className="text-[10px] font-bold text-[#676282] dark:text-[#A5A0C8] uppercase">Output:</span>
                      <div className="font-mono text-[11px] text-[#1E1B33] dark:text-white mt-0.5">{codingInfo.output_description}</div>
                    </div>
                  )}
                </div>

                {/* Sample Test Case Preview */}
                {(codingInfo.sample_input || codingInfo.sample_output) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {codingInfo.sample_input && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1B33] border border-[#E6E8F6] dark:border-[#2D2B45]">
                        <span className="text-[10px] font-mono text-[#676282] dark:text-[#A5A0C8] block">Sample Input:</span>
                        <code className="text-[11px] font-bold font-mono text-[#7C5CFC]">{codingInfo.sample_input}</code>
                      </div>
                    )}
                    {codingInfo.sample_output && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1B33] border border-[#E6E8F6] dark:border-[#2D2B45]">
                        <span className="text-[10px] font-mono text-[#676282] dark:text-[#A5A0C8] block">Expected Output:</span>
                        <code className="text-[11px] font-bold font-mono text-[#10B981]">{codingInfo.sample_output}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Python Code Editor Area */}
            <div className="rounded-2xl bg-[#181528] border border-[#2D2B45] shadow-snow-md overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#120F20] border-b border-white/10 text-xs">
                <div className="flex items-center gap-2 text-[#A78BFA] font-mono text-xs">
                  <Terminal className="w-4 h-4 text-[#A78BFA]" />
                  <span className="font-bold">Python 3 Solution Editor</span>
                </div>
                <button
                  onClick={() => {
                    const starter = codingInfo?.starter_code || 'def solution():\n    pass\n';
                    setQuizAnswers((prev) => ({
                      ...prev,
                      [currentQ.id]: starter
                    }));
                  }}
                  className="text-[11px] text-[#A78BFA] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to starter template code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Template</span>
                </button>
              </div>

              <textarea
                value={
                  quizAnswers[currentQ.id] !== undefined
                    ? quizAnswers[currentQ.id]
                    : (codingInfo?.starter_code || '')
                }
                onChange={(e) => handleTextAnswerChange(e.target.value)}
                placeholder="# Implement your Python solution here..."
                rows={9}
                spellCheck={false}
                className="w-full p-4 bg-transparent font-mono text-xs md:text-sm text-[#F1EDFE] placeholder-white/30 focus:outline-none resize-y leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FE] dark:bg-[#181528] border border-[#E6E8F6] dark:border-[#2D2B45] text-xs text-[#676282] dark:text-[#A5A0C8] flex items-center justify-between">
              <span>💡 Your Python code will be executed against automated unit tests upon submission.</span>
              {quizAnswers[currentQ.id]?.trim() ? (
                <span className="font-semibold text-[#10B981] flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Code ready for evaluation
                </span>
              ) : (
                <span className="text-[11px] text-[#EF4444] font-medium">
                  Code implementation required
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation & Submit Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E6E8F6] dark:border-[#2D2B45]">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-[#E6E8F6] dark:border-[#2D2B45] bg-[#F8F9FE] dark:bg-[#181528] hover:bg-[#F2F4FB] dark:hover:bg-[#201D35] disabled:opacity-40 text-xs md:text-sm font-bold text-[#1E1B33] dark:text-white flex items-center gap-2 transition-all shadow-snow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Question Pagination Pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const ans = quizAnswers[q.id];
            const isAnswered = ans !== undefined && ans !== null && String(ans).trim() !== '';
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#7C5CFC] text-white'
                    : isAnswered
                    ? 'bg-[#ECFDF5] dark:bg-[#10B981]/20 text-[#065F46] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#10B981]/30'
                    : 'bg-[#F8F9FE] dark:bg-[#181528] text-[#676282] dark:text-[#A5A0C8] hover:bg-[#F2F4FB] dark:hover:bg-[#201D35]'
                }`}
                title={`Jump to Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-snow-sm transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] hover:opacity-95 text-white text-xs md:text-sm font-extrabold flex items-center gap-2 shadow-snow-md transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Quiz</span>
          </button>
        )}
      </div>
    </div>
  );
};
