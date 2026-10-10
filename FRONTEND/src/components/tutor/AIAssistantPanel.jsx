import React, { useState, useRef, useEffect } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Sparkles,
  Send,
  Volume2,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  Bot,
  User,
  Copy,
  Check,
  X,
  MessageSquare
} from 'lucide-react';

export const AIAssistantPanel = () => {
  const {
    currentTopic,
    speakText,
    stopSpeaking,
    addToast,
    copilotOpen,
    setCopilotOpen
  } = useLearning();

  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am your AI Tutor for **${currentTopic.title}**. You can ask me to explain any detail simpler, generate custom code snippets, clarify doubts, or summarize the core concepts.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    { label: "Explain simpler", prompt: `Could you explain ${currentTopic.title} in simpler, everyday language suitable for a beginner?` },
    { label: "Give another example", prompt: `Give me another clear practical real-world example of ${currentTopic.title}.` },
    { label: "Summarize this", prompt: `Please provide a concise 3-bullet summary of the most critical takeaways for ${currentTopic.title}.` },
    { label: "Common exam pitfalls", prompt: `What are the most common mistakes or exam traps students encounter with ${currentTopic.title}?` }
  ];

  useEffect(() => {
    if (copilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, copilotOpen]);

  useEffect(() => {
    setMessages([
      {
        id: `topic-${currentTopic.id}-intro`,
        sender: 'ai',
        text: `I am ready to assist you with **${currentTopic.title}**! Feel free to ask questions or select a shortcut below.`,
        timestamp: 'Just now'
      }
    ]);
  }, [currentTopic.id]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "";
      const lower = query.toLowerCase();

      if (lower.includes("simpler") || lower.includes("easy")) {
        aiResponseText = `Think of **${currentTopic.title}** like an automated assembly line in a bakery. Instead of a baker hand-kneading 100 buns individually, a conveyor belt delivers one bun at a time to an oven. Each iteration processes exactly one bun until the tray is empty!`;
      } else if (lower.includes("another example") || lower.includes("example")) {
        aiResponseText = `Here is another practical example in Python:\n\n\`\`\`python\n# Iterating through user notifications\ninbox = ["Welcome to Campus", "Assignment Graded", "Room Joined"]\nfor idx, notification in enumerate(inbox, 1):\n    print(f"[{idx}] Alert: {notification}")\n\`\`\`\nThis demonstrates how indices and sequence items are paired dynamically.`;
      } else if (lower.includes("summarize") || lower.includes("summary")) {
        aiResponseText = `Here is the concise summary for **${currentTopic.title}**:\n\n1. **Core Purpose**: Execute instructions repeatedly without duplicate code.\n2. **Termination Contract**: Always guarantee a condition that reaches termination to prevent infinite lockups.\n3. **Idiomatic Design**: Prefer sequence generators like \`range()\` or list comprehensions for memory optimization.`;
      } else if (lower.includes("pitfall") || lower.includes("mistake")) {
        aiResponseText = `Top student pitfalls:\n• **Off-by-one errors**: Forgetting that \`range(0, 5)\` only loops from 0 through 4 (excludes 5).\n• **Mutating collections during iteration**: Removing items from a list while looping over it skips elements!\n• **Forgetting state increment**: In a \`while\` loop, failing to update the counter causes an infinite loop.`;
      } else {
        aiResponseText = `Regarding **"${query}"**:\n\nIn the context of ${currentTopic.title}, this represents a fundamental interaction between control state and execution memory. When your algorithm evaluates the condition, it checks the heap pointer or condition register. If valid, the block executes in O(1) step overhead.`;
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast("Copied to clipboard", "info", 1500);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Small floating icon trigger when minimized
  if (!copilotOpen) {
    return (
      <aside aria-label="AI Tutor Copilot Trigger">
        <button
          onClick={() => setCopilotOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#9678FA] text-white shadow-snow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group border border-white/40"
          title="Open AI Tutor Copilot"
          aria-label="Open AI Tutor Copilot"
        >
          {/* Active status pulse dot */}
          <span className="w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full absolute -top-1 -right-1 shadow-sm" />
          <span className="w-3.5 h-3.5 bg-[#10B981] rounded-full absolute -top-1 -right-1 animate-ping opacity-75" />

          {/* Icon */}
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />

          {/* Hover Tooltip */}
          <div className="absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-[#1E1B33] text-white text-xs font-semibold whitespace-nowrap shadow-snow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <span>AI Tutor Copilot</span>
            <span className="text-[10px] text-[#A78BFA] bg-white/10 px-1.5 py-0.5 rounded font-mono">Online</span>
          </div>
        </button>
      </aside>
    );
  }

  // Expanded Floating Chat Window
  return (
    <aside
      aria-label="AI Tutor Assistant"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[590px] max-h-[calc(100vh-6rem)] rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] shadow-2xl flex flex-col overflow-hidden animate-float-in select-none"
    >
      {/* Assistant Header */}
      <div className="p-4 border-b border-[#E6E8F6] bg-[#F8F9FE] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#9678FA] flex items-center justify-center text-white shadow-snow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E1B33] flex items-center gap-1.5">
              <span>AI Tutor Copilot</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse" />
            </h3>
            <p className="text-[11px] text-[#676282]">
              Real-time conversational guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#7C5CFC] border border-[#E6E8F6]">
            Active
          </span>
          <button
            onClick={() => setCopilotOpen(false)}
            className="w-8 h-8 rounded-xl border border-[#E6E8F6] bg-[#FFFFFF] hover:bg-[#F0F2FA] text-[#676282] hover:text-[#1E1B33] flex items-center justify-center transition-colors cursor-pointer"
            title="Minimize to small icon"
            aria-label="Minimize AI Tutor Copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-[#F8F9FE]/60 border-b border-[#E6E8F6] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.prompt)}
            className="px-2.5 py-1 rounded-xl bg-[#FFFFFF] hover:bg-[#7C5CFC] text-[#676282] hover:text-white border border-[#E6E8F6] hover:border-[#7C5CFC] text-[11px] font-semibold whitespace-nowrap transition-all shadow-snow-sm shrink-0 cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 subtle-snow-dots bg-[#FAFBFD] select-text">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-xl bg-[#F1EDFE] border border-[#DCD3FC] flex items-center justify-center text-[#7C5CFC] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed relative group ${
                  isAI
                    ? 'bg-[#FFFFFF] text-[#1E1B33] border border-[#E6E8F6] shadow-snow-sm'
                    : 'bg-[#7C5CFC] text-white shadow-snow-sm rounded-br-none'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-black/5 text-[10px] opacity-75">
                  <span>{msg.timestamp}</span>

                  {isAI && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => speakText(msg.text.replace(/[*#`]/g, ''))}
                        className="p-1 hover:text-[#7C5CFC] transition-colors cursor-pointer"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="p-1 hover:text-[#7C5CFC] transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isAI && (
                <div className="w-7 h-7 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6] flex items-center justify-center text-[#1E1B33] shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#676282] p-2 bg-[#FFFFFF] rounded-xl border border-[#E6E8F6] max-w-fit shadow-snow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#7C5CFC] animate-spin" />
            <span>AI Tutor is formulating explanation...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#F8F9FE] border-t border-[#E6E8F6] shrink-0"
      >
        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E6E8F6] focus-within:border-[#7C5CFC] rounded-2xl p-1.5 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a follow-up doubt..."
            className="flex-1 px-3 py-1.5 text-xs md:text-sm bg-transparent text-[#1E1B33] placeholder-[#676282] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-8 h-8 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] disabled:opacity-40 text-white flex items-center justify-center shadow-snow-sm transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
};
