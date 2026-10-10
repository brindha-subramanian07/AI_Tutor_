import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  MessageSquareQuote,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  HelpCircle,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  Bot
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const DoubtsView = () => {
  const { rooms, setActiveRoomId, setActiveTab, requestAITutorAnswer, upvoteDoubt } = useLearning();
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allDoubts = rooms.flatMap((r) =>
    (r.doubts || []).map((d) => ({ ...d, roomName: r.name, roomCode: r.code, roomId: r.id }))
  );

  const filtered = allDoubts.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'ai-verified') return d.solved;
    if (filterMode === 'open') return !d.solved;
    return true;
  });

  const handleOpenInRoom = (roomId) => {
    setActiveRoomId(roomId);
    setActiveTab('rooms');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
            Campus Discussion Inbox
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] mt-0.5">
            Classroom Doubts & Community Resolutions
          </h2>
          <p className="text-xs md:text-sm text-[#676282]">
            Browse academic queries from your classmates, check AI Tutor verified answers, or post new doubts.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('rooms')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-snow-md hover:opacity-95 transition-all"
        >
          <span>Open Classroom Pods</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#676282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all doubts across campus rooms..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#FFFFFF] border border-[#E6E8F6] rounded-xl text-[#1E1B33] placeholder-[#676282] focus:outline-none focus:border-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'all'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            All Queries ({allDoubts.length})
          </button>
          <button
            onClick={() => setFilterMode('ai-verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'ai-verified'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            AI Verified
          </button>
          <button
            onClick={() => setFilterMode('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'open'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            Awaiting Solutions
          </button>
        </div>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {filtered.map((doubt) => (
          <div
            key={doubt.id}
            className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm hover:border-[#DCD3FC] transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F2FA] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-[#F1EDFE] text-[#7C5CFC] border border-[#DCD3FC]">
                  {doubt.roomCode}
                </span>
                <span className="text-xs font-semibold text-[#676282]">
                  {doubt.roomName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={doubt.solved ? 'mint' : 'primary'}
                  size="sm"
                  icon={doubt.solved ? CheckCircle2 : HelpCircle}
                >
                  {doubt.solved ? 'AI Verified Resolution' : 'Open Discussion'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#1E1B33]">
                {doubt.title}
              </h3>
              <p className="text-xs md:text-sm text-[#676282] leading-relaxed">
                {doubt.content}
              </p>
            </div>

            {doubt.aiAnswer && (
              <div className="rounded-2xl bg-[#F1EDFE]/70 border border-[#DCD3FC] p-4 text-xs md:text-sm text-[#1E1B33] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#4B33BC]">
                  <Bot className="w-4 h-4 text-[#7C5CFC]" />
                  <span>AI Tutor Solution:</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">
                  {doubt.aiAnswer.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-[#676282]">
                <button
                  onClick={() => upvoteDoubt(doubt.roomId, doubt.id)}
                  className="flex items-center gap-1 font-bold text-[#7C5CFC] hover:underline"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{doubt.upvotes} Helpful</span>
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {doubt.replies?.length || 0} Replies
                </span>
              </div>

              <button
                onClick={() => handleOpenInRoom(doubt.roomId)}
                className="text-xs font-bold text-[#7C5CFC] hover:underline flex items-center gap-1"
              >
                <span>Open in Classroom Pod</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
