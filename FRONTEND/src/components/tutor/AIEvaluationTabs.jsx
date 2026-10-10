import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  BookOpen,
  Code2,
  FileCheck2,
  ListOrdered,
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { InteractiveCodeTask } from './InteractiveCodeTask';
import { LavenderPetal } from '../common/AutumnMotif';

export const AIEvaluationTabs = () => {
  const { currentTopic, startQuiz, addToast } = useLearning();
  const [activeSubTab, setActiveSubTab] = useState('concepts');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  const tabs = [
    { id: 'concepts', label: 'Key Concepts', icon: BookOpen },
    { id: 'examples', label: 'Visual & Code Examples', icon: Code2 },
    { id: 'takeaways', label: 'Important Points', icon: FileCheck2 },
    { id: 'practice', label: 'Practical Task', icon: ListOrdered }
  ];

  const handleCopyCode = (idx, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    addToast('Code copied to clipboard', 'info', 1500);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Learning Flow Stepper Bar */}
      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] text-xs font-semibold text-[#676282]">
          <span className="flex items-center gap-1.5 text-[#7C5CFC] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center text-[10px]">1</span>
            Topic
          </span>
          <span className="text-[#E6E8F6]">→</span>
          <span className="flex items-center gap-1.5 text-[#7C5CFC] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center text-[10px]">2</span>
            Visual Lecture
          </span>
          <span className="text-[#E6E8F6]">→</span>
          <span className="flex items-center gap-1.5 text-[#9678FA] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#9678FA] text-white flex items-center justify-center text-[10px]">3</span>
            Examples
          </span>
          <span className="text-[#E6E8F6]">→</span>
          <span className="flex items-center gap-1.5 text-[#A78BFA] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#A78BFA] text-white flex items-center justify-center text-[10px]">4</span>
            Practice
          </span>
          <span className="text-[#E6E8F6]">→</span>
          <button
            onClick={() => startQuiz(currentTopic.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#10B981] text-[#065F46] hover:text-white border border-[#A7F3D0] transition-colors font-bold"
          >
            <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">5</span>
            AI Quiz
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E6E8F6] pb-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                  : 'bg-[#FFFFFF] text-[#676282] hover:text-[#1E1B33] hover:bg-[#F8F9FE] border border-[#E6E8F6]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-200">
        {/* 1. Key Concepts */}
        {activeSubTab === 'concepts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTopic.keyConcepts?.map((concept, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] p-5 shadow-snow-sm hover:border-[#DCD3FC] transition-all space-y-2"
              >
                <div className="flex items-center gap-2">
                  <LavenderPetal className="w-4 h-4 text-[#7C5CFC]" />
                  <h4 className="text-sm font-bold text-[#1E1B33]">
                    {concept.term}
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-[#676282] leading-relaxed">
                  {concept.definition}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 2. Visual & Code Examples */}
        {activeSubTab === 'examples' && (
          <div className="space-y-4">
            {currentTopic.codeExamples?.map((eg, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] p-5 shadow-snow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-2">
                  <h4 className="text-sm font-bold text-[#1E1B33]">
                    {eg.title}
                  </h4>
                  <button
                    onClick={() => handleCopyCode(idx, eg.code)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F9FE] hover:bg-[#F1EDFE] border border-[#E6E8F6] text-[#7C5CFC] hover:border-[#DCD3FC] transition-colors"
                  >
                    {copiedCodeIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-xl bg-[#181528] text-[#F8F9FE] p-4 font-mono text-xs md:text-sm overflow-x-auto">
                  <pre>
                    <code>{eg.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Important Takeaways */}
        {activeSubTab === 'takeaways' && (
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-4">
            <h4 className="text-base font-bold text-[#1E1B33] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#7C5CFC]" />
              <span>Core Academic Takeaways & Exam Insights</span>
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-[#065F46]">
                  <strong className="font-bold">Invariant Verification:</strong> Always determine the base termination criteria. In loops, verify index progression; in mechanics, identify which specific body experiences each vector force.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-[#78350F]">
                  <strong className="font-bold">Edge Condition Watch:</strong> Watch out for off-by-one fencepost mistakes, mutable state race conditions, and unhandled zero-length sequences.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F1EDFE] border border-[#DCD3FC] flex items-start gap-3">
                <LavenderPetal className="w-5 h-5 text-[#7C5CFC] shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-[#4B33BC]">
                  <strong className="font-bold">Synthesis Tip:</strong> When presenting this topic to professors or technical interviewers, begin by stating the formal definition, followed by time/space complexity and one real-world edge-case scenario.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Practical Task */}
        {activeSubTab === 'practice' && (
          <InteractiveCodeTask />
        )}
      </div>
    </div>
  );
};
