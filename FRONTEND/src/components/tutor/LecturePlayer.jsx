import React, { useState, useEffect, useRef } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Subtitles,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Mail,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  BarChart2,
  Split,
  Database,
  Check,
  Award,
  RefreshCw
} from 'lucide-react';
import { LavenderPetal, AISparkle } from '../common/AutumnMotif';

// 1. Scene 1 Visual: Traditional Rules vs Machine Learning Paradigm Shift
const MLParadigmShiftVisual = ({ visualData }) => {
  const [activeTab, setActiveTab] = useState('ml');

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Paradigm Toggle Pill */}
      <div className="flex items-center justify-center p-1 bg-[#F1EDFE] rounded-xl gap-1">
        <button
          onClick={() => setActiveTab('traditional')}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === 'traditional'
              ? 'bg-white text-[#1E1B33] shadow-sm'
              : 'text-[#676282] hover:text-[#1E1B33]'
          }`}
        >
          Traditional Programming
        </button>
        <button
          onClick={() => setActiveTab('ml')}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === 'ml'
              ? 'bg-[#7C5CFC] text-white shadow-sm'
              : 'text-[#676282] hover:text-[#1E1B33]'
          }`}
        >
          Machine Learning Paradigm
        </button>
      </div>

      {activeTab === 'traditional' ? (
        <div className="p-3 bg-white rounded-xl border border-[#E6E8F6] space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#676282]">Manual Logic Flow</span>
            <span className="text-[#DC2626] font-semibold text-[10px]">Brittle for complex perception</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 items-center text-center">
            <div className="p-2 rounded-lg bg-[#F8F9FE] border border-[#E6E8F6]">
              <div className="text-[10px] text-[#676282]">Inputs</div>
              <div className="text-[11px] font-black text-[#1E1B33]">Raw Data + Manual Rules</div>
            </div>
            <div className="flex justify-center text-[#7C5CFC] font-mono text-xs">
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]">
              <div className="text-[10px] text-[#DC2626]">Output</div>
              <div className="text-[11px] font-black text-[#991B1B]">Answers</div>
            </div>
          </div>
          <p className="text-[11px] text-[#676282] leading-tight">
            Human programmers author explicit if/else conditions. Fails on vision, speech, and email nuance.
          </p>
        </div>
      ) : (
        <div className="p-3 bg-white rounded-xl border border-[#DCD3FC] space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#7C5CFC]">Automatic Pattern Learning</span>
            <span className="text-[#059669] font-semibold text-[10px]">Discovers High-Dim Rules</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 items-center text-center">
            <div className="p-2 rounded-lg bg-[#F1EDFE] border border-[#DCD3FC]">
              <div className="text-[10px] text-[#7C5CFC]">Inputs</div>
              <div className="text-[11px] font-black text-[#1E1B33]">Raw Data + Ground Truth</div>
            </div>
            <div className="flex justify-center text-[#7C5CFC] font-mono text-xs">
              <ArrowRight className="w-4 h-4 text-[#7C5CFC] animate-pulse" />
            </div>
            <div className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
              <div className="text-[10px] text-[#059669]">Output</div>
              <div className="text-[11px] font-black text-[#065F46]">Learned Model (Rules)</div>
            </div>
          </div>
          <p className="text-[11px] text-[#676282] leading-tight">
            The computer analyzes past labeled examples and optimizes mathematical weights to synthesize rules automatically.
          </p>
        </div>
      )}
    </div>
  );
};

// 2. Scene 2 Visual: Email Spam Classifier Case Study
const MLSpamClassifierVisual = ({ visualData }) => {
  const [selectedSample, setSelectedSample] = useState(0);
  const sample = visualData?.sample_emails?.[selectedSample] || {
    subject: "URGENT: Claim $10,000 FREE Cash Transfer Now!",
    sender: "lottery-prizes@unknown-domain.xyz",
    type: "spam",
    features_found: ["FREE", "URGENT", "Cash Transfer", "Suspicious TLD"],
    spam_probability: 0.94,
    verdict: "SPAM (Moved to Junk)"
  };

  const isSpam = sample.type === 'spam';

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Sample Email Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedSample(0)}
          className={`flex-1 p-2 rounded-xl text-left border transition-all text-xs ${
            selectedSample === 0
              ? 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B] font-bold'
              : 'bg-white border-[#E6E8F6] text-[#676282]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Incoming Email A</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedSample(1)}
          className={`flex-1 p-2 rounded-xl text-left border transition-all text-xs ${
            selectedSample === 1
              ? 'bg-[#ECFDF5] border-[#34D399] text-[#065F46] font-bold'
              : 'bg-white border-[#E6E8F6] text-[#676282]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Incoming Email B</span>
          </div>
        </button>
      </div>

      {/* Email Metadata Card */}
      <div className="p-3 bg-white rounded-xl border border-[#E6E8F6] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-[#676282]">
          <span className="font-mono">Sender: {sample.sender}</span>
          <span className="font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded bg-[#F8F9FE]">
            ML Feature Scan
          </span>
        </div>
        <div className="text-xs font-bold text-[#1E1B33] truncate">
          "{sample.subject}"
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-1 pt-1">
          {sample.features_found?.map((f, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isSpam
                  ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                  : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Probability Gauge & Verdict */}
      <div className="p-2.5 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6] space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1E1B33]">Model Spam Probability:</span>
          <span className={`font-mono font-black ${isSpam ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
            {(sample.spam_probability * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-[#E6E8F6] h-2.5 rounded-full overflow-hidden relative">
          {/* Decision boundary mark at 50% */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1E1B33] z-10 opacity-40" />
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isSpam ? 'bg-gradient-to-r from-[#F87171] to-[#DC2626]' : 'bg-gradient-to-r from-[#34D399] to-[#059669]'
            }`}
            style={{ width: `${sample.spam_probability * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#676282]">
          <span>0.00 (Legitimate)</span>
          <span className="font-semibold text-[#1E1B33]">0.50 Threshold</span>
          <span>1.00 (Spam)</span>
        </div>
        <div
          className={`text-center py-1 rounded-lg text-xs font-black ${
            isSpam ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#ECFDF5] text-[#059669]'
          }`}
        >
          Decision Verdict: {sample.verdict}
        </div>
      </div>
    </div>
  );
};

// 3. Scene 3 Visual: 4-Stage Machine Learning Lifecycle
const MLWorkflowPipelineVisual = ({ visualData }) => {
  const [activeStep, setActiveStep] = useState(1);
  const stages = visualData?.stages || [
    { step: 1, name: "Data Collection & Cleaning", desc: "Gather historical emails, strip HTML, clean text.", badge: "Input Data" },
    { step: 2, name: "Model Training", desc: "Feed features to algorithm to optimize weights and minimize error.", badge: "Optimization" },
    { step: 3, name: "Model Evaluation", desc: "Test accuracy and false alarm rate on held-out test data.", badge: "Validation" },
    { step: 4, name: "Deployment & Inference", desc: "Serve real-time predictions on incoming production emails.", badge: "Live Predictions" }
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="grid grid-cols-4 gap-1">
        {stages.map((st) => (
          <button
            key={st.step}
            onClick={() => setActiveStep(st.step)}
            className={`p-2 rounded-xl text-center border transition-all ${
              activeStep === st.step
                ? 'bg-[#7C5CFC] text-white border-[#7C5CFC] shadow-sm'
                : 'bg-white text-[#676282] border-[#E6E8F6] hover:bg-[#F8F9FE]'
            }`}
          >
            <div className="text-[10px] font-mono">Stage {st.step}</div>
            <div className="text-[11px] font-bold truncate">{st.badge}</div>
          </button>
        ))}
      </div>

      {/* Active Stage Card */}
      {(() => {
        const cur = stages.find((s) => s.step === activeStep) || stages[0];
        return (
          <div className="p-3.5 bg-white rounded-xl border border-[#DCD3FC] space-y-1.5 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#7C5CFC]">Step {cur.step}: {cur.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1EDFE] text-[#7C5CFC]">
                {cur.badge}
              </span>
            </div>
            <p className="text-xs text-[#1E1B33] leading-relaxed">
              {cur.desc}
            </p>
            <div className="text-[10px] text-[#676282] pt-1 border-t border-[#E6E8F6] flex items-center justify-between">
              <span>Status: Critical Phase</span>
              <span>Sequence: {cur.step} of 4</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// 4. Scene 4 Visual: Three Learning Paradigms Matrix
const MLParadigmsMatrixVisual = ({ visualData }) => {
  const [selectedParadigm, setSelectedParadigm] = useState(0);
  const paradigms = visualData?.paradigms || [
    { name: "Supervised Learning", data_type: "Labeled Data (Inputs + Ground Truth)", core_goal: "Predict target label or continuous value", tasks: ["Classification (Spam/Ham)", "Regression (House Prices)"], icon: "tag" },
    { name: "Unsupervised Learning", data_type: "Unlabeled Data (Inputs Only)", core_goal: "Discover natural groupings and hidden structure", tasks: ["Clustering (Customer Segments)", "Anomaly Detection"], icon: "cluster" },
    { name: "Reinforcement Learning", data_type: "Environment States & Reward Feedback", core_goal: "Learn optimal policy through trial and error", tasks: ["Game Playing (AlphaGo)", "Autonomous Robotics"], icon: "award" }
  ];

  const p = paradigms[selectedParadigm] || paradigms[0];

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-1">
        {paradigms.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedParadigm(idx)}
            className={`py-1.5 px-2 rounded-xl text-center border text-[11px] font-bold transition-all ${
              selectedParadigm === idx
                ? 'bg-[#7C5CFC] text-white border-[#7C5CFC]'
                : 'bg-white text-[#676282] border-[#E6E8F6] hover:bg-[#F8F9FE]'
            }`}
          >
            {item.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="p-3 bg-white rounded-xl border border-[#E6E8F6] space-y-2 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-1.5">
          <span className="text-xs font-black text-[#1E1B33]">{p.name}</span>
          <span className="text-[10px] font-semibold text-[#7C5CFC]">{p.core_goal}</span>
        </div>
        <div className="space-y-1 text-xs">
          <div>
            <span className="font-semibold text-[#676282]">Data Type: </span>
            <span className="font-mono text-[#1E1B33]">{p.data_type}</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {p.tasks?.map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1EDFE] text-[#7C5CFC] font-semibold">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Scene 5 Visual: Train vs Test Data Split Partition
const MLTrainTestSplitVisual = ({ visualData }) => {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="p-3 bg-white rounded-xl border border-[#E6E8F6] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1E1B33]">Total Dataset: 1,000 Historical Samples</span>
          <span className="text-[10px] font-mono font-bold text-[#7C5CFC]">80 / 20 Split</span>
        </div>

        {/* Visual Split Bar */}
        <div className="flex h-7 rounded-xl overflow-hidden border border-[#E6E8F6]">
          <div className="w-4/5 bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] text-white flex items-center justify-center text-xs font-bold">
            Training Set (80% / 800 samples)
          </div>
          <div className="w-1/5 bg-[#ECFDF5] border-l border-[#A7F3D0] text-[#065F46] flex items-center justify-center text-xs font-bold">
            Testing (20%)
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded-lg bg-[#F1EDFE] text-[#7C5CFC]">
            <div className="font-bold">80% Training Set</div>
            <div className="text-[10px] text-[#676282]">Used by algorithm to adjust weights and learn patterns.</div>
          </div>
          <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#065F46]">
            <div className="font-bold">20% Testing Set</div>
            <div className="text-[10px] text-[#676282]">Kept strictly hidden to test real-world generalization.</div>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[11px] text-[#991B1B] leading-tight">
          <span className="font-bold">Overfitting Warning: </span>
          Evaluating on training data tests memorization, not genuine learning!
        </div>
      </div>
    </div>
  );
};

// 6. Scene 6 Visual: Worked Feature Calculation Demonstration
const MLWorkedExampleVisual = ({ visualData }) => {
  const features = visualData?.features || [
    { name: "Contains 'winner'", value: 1, weight: 0.40, contribution: 0.40 },
    { name: "Contains 'prize'", value: 1, weight: 0.35, contribution: 0.35 },
    { name: "Contains 'funds'", value: 1, weight: 0.20, contribution: 0.20 },
    { name: "Known Contact", value: 0, weight: -0.60, contribution: 0.00 }
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="p-2.5 bg-white rounded-xl border border-[#E6E8F6] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] border-b border-[#E6E8F6] pb-1">
          <span className="font-bold text-[#1E1B33]">Feature Vector Multiplication</span>
          <span className="font-mono text-[#7C5CFC] text-[10px]">Bias: +0.05</span>
        </div>
        <div className="space-y-1 text-[11px]">
          {features.map((f, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[#676282]">{f.name}</span>
              <span className="font-mono font-semibold text-[#1E1B33]">
                {f.value} × {f.weight > 0 ? `+${f.weight}` : f.weight} = <span className="text-[#7C5CFC] font-bold">+{f.contribution.toFixed(2)}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="pt-1.5 border-t border-[#E6E8F6] flex items-center justify-between text-xs font-black">
          <span className="text-[#1E1B33]">Total Computed Score:</span>
          <span className="text-[#DC2626] font-mono text-sm">1.00 (&gt;= 0.50 Threshold)</span>
        </div>
        <div className="text-center py-1 rounded-lg bg-[#FEF2F2] text-[#DC2626] text-xs font-bold">
          Verdict: Confirmed Spam Triggered
        </div>
      </div>
    </div>
  );
};

// 7. Scene 7 Visual: Evaluation Confusion Matrix & Limitations
const MLEvaluationMetricsVisual = ({ visualData }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="p-2.5 bg-white rounded-xl border border-[#E6E8F6] space-y-1.5">
        <div className="text-[11px] font-bold text-[#1E1B33]">2×2 Confusion Matrix (200 Test Emails)</div>
        <div className="grid grid-cols-2 gap-1.5 text-center text-[10px]">
          <div className="p-1.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
            <div className="font-bold text-[#065F46]">True Positive (95)</div>
            <div className="text-[#059669]">Spam caught correctly</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]">
            <div className="font-bold text-[#DC2626]">False Positive (2)</div>
            <div className="text-[#991B1B]">Inbox email lost to Spam!</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
            <div className="font-bold text-[#D97706]">False Negative (5)</div>
            <div className="text-[#B45309]">Spam slipped to Inbox</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
            <div className="font-bold text-[#065F46]">True Negative (98)</div>
            <div className="text-[#059669]">Good email delivered</div>
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-mono pt-1 text-[#676282]">
          <span>Accuracy: <strong className="text-[#1E1B33]">96.5%</strong></span>
          <span>Precision: <strong className="text-[#7C5CFC]">97.9%</strong></span>
          <span>Recall: <strong className="text-[#10B981]">95.0%</strong></span>
        </div>

        <div className="p-1.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[10px] text-[#991B1B] leading-tight">
          <span className="font-bold">Critical Limitation: </span>
          Models inherit data bias ("Garbage In, Garbage Out") and learn correlation, not causality.
        </div>
      </div>
    </div>
  );
};

// 8. Scene 8 Visual: Summary Mastery Checklist
const MLSummaryChecklistVisual = ({ visualData, onTakeQuiz }) => {
  const items = visualData?.mastery_checklist || [
    { topic: "Learning from Data vs Rule-Based Programming", status: "Mastered" },
    { topic: "Email Spam Case Study & Feature Weights", status: "Mastered" },
    { topic: "4-Stage ML Workflow (Collection -> Inference)", status: "Mastered" },
    { topic: "Supervised, Unsupervised & Reinforcement Paradigms", status: "Mastered" },
    { topic: "80/20 Train vs Test Split Rationale", status: "Mastered" },
    { topic: "Evaluation Trade-Offs & Data Bias", status: "Mastered" }
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="p-3 bg-white rounded-xl border border-[#DCD3FC] space-y-1.5">
        <div className="flex items-center justify-between text-xs font-black text-[#7C5CFC]">
          <span>Curriculum Mastery Checklist</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46]">100% Ready</span>
        </div>
        <div className="space-y-1 text-[11px]">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[#1E1B33]">
              <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">{it.topic}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onTakeQuiz}
          className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Launch Diagnostic Assessment Quiz</span>
        </button>
      </div>
    </div>
  );
};

// Generic Interactive Visual Components
const TimelineVisual = ({ visualData }) => {
  const events = visualData?.events || visualData?.steps || visualData?.timeline || [
    { title: "Initial Phase", desc: "Foundational conditions and input state", time: "Stage 1" },
    { title: "Transformation", desc: "Core mechanisms and operational progress", time: "Stage 2" },
    { title: "Equilibrium", desc: "Outcome state and invariant stabilization", time: "Stage 3" }
  ];

  return (
    <div className="w-full flex flex-col gap-2 p-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C5CFC] mb-1">
        <Layers className="w-4 h-4" />
        <span>Sequential Timeline</span>
      </div>
      <div className="relative pl-5 border-l-2 border-[#DCD3FC] space-y-2.5 my-1">
        {events.map((ev, i) => (
          <div key={i} className="relative group">
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#7C5CFC] group-hover:scale-125 transition-all" />
            <div className="p-2 rounded-xl bg-white border border-[#E6E8F6] shadow-sm">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#1E1B33]">{ev.title || ev.name || `Phase ${i + 1}`}</span>
                <span className="text-[#7C5CFC] font-mono">{ev.time || ev.year || `Step ${i + 1}`}</span>
              </div>
              <p className="text-[11px] text-[#676282] mt-0.5 leading-tight">{ev.desc || ev.description || ev.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonTableVisual = ({ visualData }) => {
  const headers = visualData?.headers || ["Criterion", visualData?.left_title || "Perspective A", visualData?.right_title || "Perspective B"];
  const rows = visualData?.rows || visualData?.comparison || [
    { label: "Mechanism", left: "Explicit Rules", right: "Learned Patterns" },
    { label: "Adaptability", left: "Static", right: "Self-Optimizing" },
    { label: "Scalability", left: "High Friction", right: "Autonomous" }
  ];

  return (
    <div className="w-full flex flex-col gap-2 p-1 overflow-x-auto">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C5CFC] mb-1">
        <Split className="w-4 h-4" />
        <span>Comparative Analysis</span>
      </div>
      <div className="rounded-xl border border-[#E6E8F6] overflow-hidden text-left bg-white text-[11px]">
        <div className="grid grid-cols-3 bg-[#F8F9FE] p-2 font-bold text-[#1E1B33] border-b border-[#E6E8F6]">
          <span>{headers[0]}</span>
          <span className="text-[#676282]">{headers[1]}</span>
          <span className="text-[#7C5CFC]">{headers[2]}</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-3 p-2 border-b border-[#E6E8F6] last:border-b-0 hover:bg-[#F1EDFE]/30 transition-colors">
            <span className="font-semibold text-[#1E1B33]">{r.label || r.criterion || r[0]}</span>
            <span className="text-[#676282]">{r.left || r.traditional || r[1]}</span>
            <span className="text-[#7C5CFC] font-semibold">{r.right || r.ml || r[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlowDiagramVisual = ({ visualData }) => {
  const steps = visualData?.stages || visualData?.nodes || visualData?.steps || [
    { name: "Input & Context", desc: "Initial state and environmental variables" },
    { name: "Active Process", desc: "Transformation and logic execution" },
    { name: "Outcome & Impact", desc: "Stabilized invariant and measurable result" }
  ];

  return (
    <div className="w-full flex flex-col gap-2 p-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C5CFC] mb-1">
        <Layers className="w-4 h-4" />
        <span>Process Flow Architecture</span>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-1.5 my-1">
        {steps.map((st, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 w-full p-2.5 rounded-xl bg-white border border-[#DCD3FC] text-center shadow-sm">
              <span className="w-5 h-5 rounded-full bg-[#F1EDFE] text-[#7C5CFC] text-[10px] font-black inline-flex items-center justify-center mb-1">
                {i + 1}
              </span>
              <div className="text-[11px] font-bold text-[#1E1B33]">{st.name || st.title || `Stage ${i + 1}`}</div>
              <p className="text-[10px] text-[#676282] mt-0.5 leading-tight">{st.desc || st.description}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-[#7C5CFC] shrink-0 my-1 md:my-0 rotate-90 md:rotate-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const BarChartVisual = ({ visualData }) => {
  const bars = visualData?.bars || visualData?.data || visualData?.metrics || [
    { label: "Baseline", value: 35, color: "#9CA3AF" },
    { label: "Iterative", value: 72, color: "#A78BFA" },
    { label: "Optimal", value: 95, color: "#7C5CFC" }
  ];

  return (
    <div className="w-full flex flex-col gap-2 p-1">
      <div className="flex items-center justify-between text-xs font-bold text-[#7C5CFC] mb-1">
        <span className="flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4" />
          {visualData?.title || "Distribution & Metrics"}
        </span>
        <span className="text-[10px] text-[#676282] font-normal">{visualData?.unit || "Normalized %"}</span>
      </div>
      <div className="space-y-2 my-1">
        {bars.map((b, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex justify-between text-[10px] text-[#1E1B33]">
              <span className="font-semibold">{b.label || b.name}</span>
              <span className="font-mono text-[#7C5CFC]">{b.value}{visualData?.unit ? ` ${visualData.unit}` : '%'}</span>
            </div>
            <div className="w-full h-2.5 bg-[#F1EDFE] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, b.value))}%`,
                  backgroundColor: b.color || '#7C5CFC'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Zero dangerouslySetInnerHTML Formula Visualizer
const FormulaViewVisual = ({ visualData }) => {
  const formulaStr = visualData?.formula || visualData?.equation || "E = mc²";
  const breakdown = visualData?.variables || visualData?.breakdown || [
    { symbol: "E", meaning: "Energy" },
    { symbol: "m", meaning: "Mass" },
    { symbol: "c", meaning: "Speed of light in vacuum" }
  ];

  return (
    <div className="w-full flex flex-col gap-2 p-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C5CFC] mb-1">
        <Sparkles className="w-4 h-4" />
        <span>Mathematical & Scientific Formula</span>
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#181528] to-[#251D42] text-white text-center shadow-sm border border-[#DCD3FC]/20">
        <div className="text-[10px] text-[#A78BFA] uppercase tracking-wider mb-1">Governing Equation</div>
        <div className="text-base md:text-lg font-mono font-black text-[#F1EDFE] tracking-wide select-all">
          {formulaStr}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-1 text-[11px]">
        {breakdown.map((item, i) => (
          <div key={i} className="p-1.5 rounded-lg bg-white border border-[#E6E8F6] flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#F1EDFE] text-[#7C5CFC] font-mono font-bold text-[10px]">
              {item.symbol || item.term}
            </span>
            <span className="text-[#676282] truncate">{item.meaning || item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Self-contained Local State Quiz Visual (zero impact on timeline/TTS)
const QuizCardVisual = ({ visualData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const question = visualData?.question || visualData?.prompt || "Check your immediate understanding:";
  const options = visualData?.options || ["Fundamental invariant", "Arbitrary side-effect", "Unconstrained loop", "Hardware fault"];
  const correctIdx = visualData?.correct_index ?? visualData?.correctIndex ?? 0;

  return (
    <div className="w-full flex flex-col gap-2 p-1">
      <div className="flex items-center justify-between text-xs font-bold text-[#7C5CFC] mb-1">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Checkpoint</span>
        </span>
        {selectedOption !== null && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            selectedOption === correctIdx ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#FEF2F2] text-[#991B1B]'
          }`}>
            {selectedOption === correctIdx ? 'Correct!' : 'Review takeaway'}
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold text-[#1E1B33]">{question}</p>
      <div className="space-y-1.5 my-1">
        {options.map((opt, i) => {
          let btnStyle = "bg-white border-[#E6E8F6] text-[#1E1B33] hover:bg-[#F8F9FE]";
          if (selectedOption !== null) {
            if (i === correctIdx) {
              btnStyle = "bg-[#ECFDF5] border-[#10B981] text-[#065F46] font-bold";
            } else if (i === selectedOption) {
              btnStyle = "bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]";
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedOption(i)}
              className={`w-full p-2 text-left rounded-xl border text-[11px] transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt}</span>
              {selectedOption !== null && i === correctIdx && (
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
              )}
            </button>
          );
        })}
      </div>
      {visualData?.explanation && selectedOption !== null && (
        <p className="text-[10px] text-[#676282] italic leading-tight">
          {visualData.explanation}
        </p>
      )}
    </div>
  );
};

const SafeFallbackVisual = ({ slide, slideIndex, totalSlides }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 text-center p-3">
      <div className="w-12 h-12 rounded-2xl bg-[#F1EDFE] flex items-center justify-center text-[#7C5CFC] shadow-sm">
        <Sparkles className="w-6 h-6 text-[#7C5CFC]" />
      </div>
      <span className="text-xs font-bold text-[#1E1B33]">
        {slide?.title || "Conceptual Mental Model"}
      </span>
      <p className="text-[11px] text-[#676282] max-w-xs leading-relaxed">
        {slide?.subtitle || "Grounded mental model synthesized by AI Tutor for conceptual clarity."}
      </p>
      <div className="w-full max-w-[200px] h-1.5 bg-[#E6E8F6] rounded-full overflow-hidden my-1">
        <div
          className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] rounded-full transition-all"
          style={{ width: `${(((slideIndex || 0) + 1) / (totalSlides || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

// Global Visual Component Registry
export const VISUAL_REGISTRY = {
  // ML components
  ml_paradigm_shift: MLParadigmShiftVisual,
  ml_spam_classifier: MLSpamClassifierVisual,
  ml_workflow_pipeline: MLWorkflowPipelineVisual,
  ml_paradigms_matrix: MLParadigmsMatrixVisual,
  ml_train_test_split: MLTrainTestSplitVisual,
  ml_worked_example: MLWorkedExampleVisual,
  ml_evaluation_metrics: MLEvaluationMetricsVisual,
  ml_summary_checklist: MLSummaryChecklistVisual,
  // Generic components
  Timeline: TimelineVisual,
  ComparisonTable: ComparisonTableVisual,
  FlowDiagram: FlowDiagramVisual,
  BarChart: BarChartVisual,
  FormulaView: FormulaViewVisual,
  QuizCard: QuizCardVisual,
  SafeFallbackVisual: SafeFallbackVisual,
  // Aliases
  interactive_flow_diagram: FlowDiagramVisual,
  generic_flow: FlowDiagramVisual,
  timeline: TimelineVisual,
  comparison_table: ComparisonTableVisual,
  flow_diagram: FlowDiagramVisual,
  bar_chart: BarChartVisual,
  formula_view: FormulaViewVisual,
  quiz_card: QuizCardVisual,
  safe_fallback: SafeFallbackVisual
};

export const LecturePlayer = () => {
  const { currentTopic, speakText, stopSpeaking, speechEnabled, startQuiz } = useLearning();

  const slides = currentTopic.slides || [];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const playerRef = useRef(null);

  const currentSlide = slides[currentSlideIndex] || slides[0] || {
    title: currentTopic.title,
    subtitle: "AI Conceptual Overview",
    narration: currentTopic.summary,
    code: `# Exploring ${currentTopic.title}`,
    visualNotes: []
  };

  // Duration in seconds for current scene
  const sceneDurationSec = currentSlide.estimated_duration_sec || Math.max(15, Math.round((currentSlide.narration?.split(' ')?.length || 20) / 2.3));

  // Reset when topic changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setIsPlaying(false);
    setProgressPercent(0);
    stopSpeaking();
  }, [currentTopic.id]);

  // Synchronized playback loop driven by calculated speech duration and onEnd callback
  useEffect(() => {
    if (!isPlaying) {
      stopSpeaking();
      return;
    }

    // Trigger speech narration with speech speed
    if (speechEnabled && currentSlide.narration) {
      speakText(currentSlide.narration, {
        rate: playbackSpeed,
        onEnd: () => {
          // If speech finishes, smoothly advance
          handleNextScene();
        }
      });
    }

    // Progress bar smooth advance based on sceneDurationSec scaled by playbackSpeed
    const totalDurationMs = (sceneDurationSec * 1000) / playbackSpeed;
    const updateIntervalMs = 150;
    const stepIncrement = (updateIntervalMs / totalDurationMs) * 100;

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          handleNextScene();
          return 0;
        }
        return Math.min(100, prev + stepIncrement);
      });
    }, updateIntervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentSlideIndex, playbackSpeed, speechEnabled]);

  const handleNextScene = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((c) => c + 1);
      setProgressPercent(0);
    } else {
      setIsPlaying(false);
      setProgressPercent(100);
      stopSpeaking();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (progressPercent >= 100) {
        setProgressPercent(0);
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((i) => i - 1);
      setProgressPercent(0);
      if (isPlaying) {
        stopSpeaking();
      }
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((i) => i + 1);
      setProgressPercent(0);
      if (isPlaying) {
        stopSpeaking();
      }
    }
  };

  const restartLecture = () => {
    setCurrentSlideIndex(0);
    setProgressPercent(0);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Render proper pedagogical visual from registry based on visual.component, visual_type, or diagram
  const renderVisualComponent = () => {
    const visual = currentSlide.visual || {};
    const compName = visual.component || currentSlide.visual_type || currentSlide.diagram || 'SafeFallbackVisual';
    const visualData = visual.data || currentSlide.visual_data || {};

    const Component = VISUAL_REGISTRY[compName] || VISUAL_REGISTRY.SafeFallbackVisual;

    if (compName === 'ml_summary_checklist') {
      return <Component visualData={visualData} onTakeQuiz={() => startQuiz(currentTopic.id)} />;
    }

    return (
      <Component
        visualData={visualData}
        slide={currentSlide}
        slideIndex={currentSlideIndex}
        totalSlides={slides.length}
      />
    );
  };

  return (
    <div
      ref={playerRef}
      className={`rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-snow-lg overflow-hidden flex flex-col transition-all relative ${
        isFullscreen ? 'p-6 bg-[#F8F9FE] h-screen' : ''
      }`}
    >
      {/* Visual Canvas Display Screen */}
      <div className="relative aspect-video w-full bg-[#FFFFFF] border-b border-[#E6E8F6] overflow-hidden flex flex-col justify-between p-5 md:p-8 subtle-snow-dots select-none">
        {/* Screen Header Badge */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8F9FE]/90 border border-[#E6E8F6] backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#10B981] animate-ping' : 'bg-[#7C5CFC]'}`} />
            <span className="text-xs font-bold text-[#7C5CFC]">
              AI Educational Player
            </span>
            <span className="text-xs text-[#676282]">
              Scene {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#F8F9FE] text-[#676282] border border-[#E6E8F6]">
              {currentTopic.category}
            </span>
          </div>
        </div>

        {/* Central Visual Presentation */}
        <div className="my-auto z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Diagram / Animation */}
          <div className="md:col-span-6 flex flex-col justify-center">
            <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] shadow-snow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-2">
                <span className="text-xs font-extrabold text-[#7C5CFC] uppercase tracking-wider flex items-center gap-1.5">
                  <LavenderPetal className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  Interactive Diagram
                </span>
                <span className="text-[10px] text-[#676282] font-mono">
                  {currentSlide.visual_type || currentSlide.diagram || "Mental Model"}
                </span>
              </div>

              {/* Dynamic Diagram Visualizer Component */}
              <div className="min-h-[170px] rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] p-3 flex flex-col justify-around items-center relative overflow-hidden">
                {renderVisualComponent()}
              </div>

              {/* Key Bullet Notes */}
              <ul className="space-y-1 text-xs text-[#676282]">
                {currentSlide.visualNotes?.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Presentation Slide Content & Code */}
          <div className="md:col-span-6 space-y-3">
            <div>
              <span className="text-xs font-semibold text-[#7C5CFC] uppercase tracking-wider">
                {currentSlide.subtitle}
              </span>
              <h2 className="text-lg md:text-xl font-black text-[#1E1B33] tracking-tight mt-0.5">
                {currentSlide.title}
              </h2>
            </div>

            {/* Code Block ONLY rendered if code is present; otherwise render conceptual synthesis */}
            {currentSlide.code ? (
              <div className="rounded-2xl bg-[#181528] text-[#F8F9FE] p-3.5 font-mono text-xs border border-[#E6E8F6]/20 shadow-snow-md overflow-x-auto relative">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[10px] text-[#A78BFA]">
                  <span className="uppercase tracking-wider font-bold">
                    {typeof currentSlide.code === 'object' && currentSlide.code?.language
                      ? currentSlide.code.language
                      : 'Code Snippet'}
                  </span>
                  <span>Interactive Walkthrough</span>
                </div>
                <pre className="text-[#F1EDFE] leading-relaxed max-h-48 overflow-y-auto">
                  <code>
                    {typeof currentSlide.code === 'object'
                      ? (currentSlide.code.snippet || '')
                      : currentSlide.code}
                  </code>
                </pre>
                {typeof currentSlide.code === 'object' && currentSlide.code?.explanation && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-[#C4B5FD] font-sans">
                    {currentSlide.code.explanation}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-[#F8F9FE] to-[#F1EDFE] border border-[#E6E8F6] p-4 space-y-3 shadow-snow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7C5CFC]">
                  <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
                  <span>Core Conceptual Synthesis</span>
                </div>
                {currentSlide.learning_objective && (
                  <div className="text-xs text-[#1E1B33] leading-relaxed">
                    <span className="font-semibold text-[#676282] block text-[10px] uppercase tracking-wider mb-0.5">Objective:</span>
                    {currentSlide.learning_objective}
                  </div>
                )}
                {currentSlide.key_takeaway && (
                  <div className="p-2.5 rounded-xl bg-white border border-[#DCD3FC] text-xs text-[#1E1B33]">
                    <span className="font-bold text-[#7C5CFC] block text-[10px] uppercase tracking-wider mb-0.5">Key Takeaway:</span>
                    {currentSlide.key_takeaway}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Narration Captions Overlay */}
        {showCaptions && currentSlide.narration && (
          <div className="z-10 mt-3 p-3.5 rounded-2xl bg-[#1E1B33]/90 backdrop-blur-md border border-white/10 text-white text-xs md:text-sm flex items-start gap-2.5 animate-fadeIn shadow-snow-md">
            <AISparkle className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-bold text-[#A78BFA] mr-1.5">AI Tutor:</span>
              "{currentSlide.narration}"
            </div>
          </div>
        )}
      </div>

      {/* Control Console Bar */}
      <div className="p-4 bg-[#F8F9FE] border-t border-[#E6E8F6] flex flex-col gap-3">
        {/* Scrubber Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-[#676282] w-14 text-right">
            {`00:${Math.round((progressPercent / 100) * sceneDurationSec).toString().padStart(2, '0')}`}
          </span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
              setProgressPercent(newPct);
            }}
            className="flex-1 relative cursor-pointer group py-1"
          >
            <div className="w-full bg-[#E6E8F6] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] h-full rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-[#676282] w-14">
            {`00:${sceneDurationSec.toString().padStart(2, '0')}`}
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left Play Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] text-[#1E1B33] hover:bg-[#F2F4FB] disabled:opacity-40 transition-colors shadow-snow-sm"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white font-bold text-xs flex items-center gap-2 shadow-snow-sm transition-all active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Lecture</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] text-[#1E1B33] hover:bg-[#F2F4FB] disabled:opacity-40 transition-colors shadow-snow-sm"
              title="Next Scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={restartLecture}
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] text-[#676282] hover:text-[#1E1B33] hover:bg-[#F2F4FB] transition-colors shadow-snow-sm"
              title="Replay from Scene 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Right Extras: Speed, Captions, Fullscreen, Quiz */}
          <div className="flex items-center gap-2">
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] text-[#1E1B33] focus:outline-none cursor-pointer shadow-snow-sm"
            >
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1.0x Speed</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>

            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2 rounded-xl border transition-colors ${
                showCaptions
                  ? 'bg-[#F1EDFE] text-[#7C5CFC] border-[#DCD3FC]'
                  : 'bg-[#FFFFFF] text-[#676282] border-[#E6E8F6]'
              }`}
              title="Toggle Captions"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E6E8F6] text-[#676282] hover:text-[#1E1B33] transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => startQuiz(currentTopic.id)}
              className="ml-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] text-white font-bold text-xs flex items-center gap-1.5 shadow-snow-sm hover:opacity-95 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>

        {/* Scene Navigation Stepper Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setProgressPercent(0);
                if (isPlaying) {
                  stopSpeaking();
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all whitespace-nowrap ${
                currentSlideIndex === idx
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'bg-white text-[#676282] border border-[#E6E8F6] hover:border-[#7C5CFC]'
              }`}
            >
              Scene {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
