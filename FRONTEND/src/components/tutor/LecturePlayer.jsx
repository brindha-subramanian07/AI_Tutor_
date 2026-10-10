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

// Generic Interactive Flow Visual for other topics
const GenericFlowVisual = ({ slide, slideIndex, totalSlides }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 text-center p-2">
      <div className="w-10 h-10 rounded-2xl bg-[#F1EDFE] flex items-center justify-center text-[#7C5CFC] mb-1">
        <Layers className="w-5 h-5 text-[#7C5CFC]" />
      </div>
      <span className="text-xs font-bold text-[#1E1B33]">
        {slide?.title}
      </span>
      <div className="w-full max-w-[200px] h-2 bg-[#E6E8F6] rounded-full overflow-hidden my-1">
        <div
          className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] rounded-full transition-all"
          style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>
      <span className="text-[11px] text-[#676282]">
        Educational step-by-step model rendered by AI Tutor
      </span>
    </div>
  );
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

  // Render proper pedagogical visual based on visual_type or diagram tag
  const renderVisualComponent = () => {
    const vType = currentSlide.visual_type || currentSlide.diagram;
    const vData = currentSlide.visual_data;

    switch (vType) {
      case 'ml_paradigm_shift':
        return <MLParadigmShiftVisual visualData={vData} />;
      case 'ml_spam_classifier':
        return <MLSpamClassifierVisual visualData={vData} />;
      case 'ml_workflow_pipeline':
        return <MLWorkflowPipelineVisual visualData={vData} />;
      case 'ml_paradigms_matrix':
        return <MLParadigmsMatrixVisual visualData={vData} />;
      case 'ml_train_test_split':
        return <MLTrainTestSplitVisual visualData={vData} />;
      case 'ml_worked_example':
        return <MLWorkedExampleVisual visualData={vData} />;
      case 'ml_evaluation_metrics':
        return <MLEvaluationMetricsVisual visualData={vData} />;
      case 'ml_summary_checklist':
        return <MLSummaryChecklistVisual visualData={vData} onTakeQuiz={() => startQuiz(currentTopic.id)} />;
      default:
        return <GenericFlowVisual slide={currentSlide} slideIndex={currentSlideIndex} totalSlides={slides.length} />;
    }
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

            {/* Embedded Code Snippet */}
            {currentSlide.code && (
              <div className="rounded-2xl bg-[#181528] text-[#F8F9FE] p-3.5 font-mono text-xs border border-[#E6E8F6]/20 shadow-snow-md overflow-x-auto relative">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[10px] text-[#A78BFA]">
                  <span>Python / Formal Model</span>
                  <span>Interactive Walkthrough</span>
                </div>
                <pre className="text-[#F1EDFE] leading-relaxed max-h-48 overflow-y-auto">
                  <code>{currentSlide.code}</code>
                </pre>
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
