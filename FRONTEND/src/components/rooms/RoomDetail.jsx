import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Users2,
  MessageSquareQuote,
  Sparkles,
  PlusCircle,
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Send,
  HelpCircle,
  Filter,
  ArrowLeft,
  Bot
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { LavenderPetal, AISparkle } from '../common/AutumnMotif';

export const RoomDetail = ({ onBackToList }) => {
  const {
    activeRoom,
    student,
    postDoubt,
    requestAITutorAnswer,
    replyToDoubt,
    upvoteDoubt,
    addToast
  } = useLearning();

  const [searchDoubt, setSearchDoubt] = useState('');
  const [filterSolved, setFilterSolved] = useState('all');
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Python, Loops');
  const [replyInput, setReplyInput] = useState({});

  if (!activeRoom) return null;

  const filteredDoubts = (activeRoom.doubts || []).filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchDoubt.toLowerCase()) ||
      d.content.toLowerCase().includes(searchDoubt.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchDoubt.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterSolved === 'solved') return d.solved;
    if (filterSolved === 'unsolved') return !d.solved;
    return true;
  });

  const handlePostDoubt = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    postDoubt(activeRoom.id, {
      title: newTitle,
      content: newContent,
      tags: tagsArray.length ? tagsArray : ['General']
    });

    setNewTitle('');
    setNewContent('');
    setShowAskModal(false);
  };

  const handleSendReply = (doubtId) => {
    const text = replyInput[doubtId];
    if (!text || !text.trim()) return;

    replyToDoubt(activeRoom.id, doubtId, text);
    setReplyInput((prev) => ({ ...prev, [doubtId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Classroom Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToList}
                className="text-xs font-bold text-[#7C5CFC] hover:underline flex items-center gap-1 mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Rooms</span>
              </button>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-[#F1EDFE] border border-[#DCD3FC] text-[#7C5CFC]">
                Code: {activeRoom.code}
              </span>
              <Badge variant="mint" size="sm">
                Active Classroom
              </Badge>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-[#1E1B33]">
              {activeRoom.name}
            </h2>
            <p className="text-xs md:text-sm text-[#676282]">
              {activeRoom.description}
            </p>
          </div>

          {/* Members Avatars & Ask Doubt CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-2">
                {activeRoom.members?.slice(0, 4).map((m, idx) => (
                  <img
                    key={idx}
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full border-2 border-[#FFFFFF] object-cover"
                    title={m.name}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#676282]">
                {activeRoom.membersCount} Students Enrolled
              </span>
            </div>

            <button
              onClick={() => setShowAskModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] hover:opacity-95 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-snow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ask a Doubt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Doubts Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#676282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchDoubt}
            onChange={(e) => setSearchDoubt(e.target.value)}
            placeholder="Search doubts by keyword or tag..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#FFFFFF] border border-[#E6E8F6] rounded-xl text-[#1E1B33] placeholder-[#676282] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/30 focus:border-[#7C5CFC] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => setFilterSolved('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterSolved === 'all'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            All Doubts
          </button>
          <button
            onClick={() => setFilterSolved('unsolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterSolved === 'unsolved'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            Unanswered
          </button>
          <button
            onClick={() => setFilterSolved('solved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterSolved === 'solved'
                ? 'bg-[#7C5CFC] text-white shadow-snow-sm'
                : 'bg-[#FFFFFF] text-[#676282] border border-[#E6E8F6]'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Discussion Feed */}
      <div className="space-y-5">
        {filteredDoubts.length > 0 ? (
          filteredDoubts.map((doubt) => (
            <div
              key={doubt.id}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-4 hover:border-[#DCD3FC] transition-all"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={doubt.avatar}
                    alt={doubt.author}
                    className="w-10 h-10 rounded-2xl object-cover border border-[#E6E8F6]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1E1B33]">
                        {doubt.author}
                      </span>
                      <span className="text-xs text-[#676282]">• {doubt.timestamp}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#1E1B33] mt-1">
                      {doubt.title}
                    </h3>
                  </div>
                </div>

                <Badge
                  variant={doubt.solved ? 'mint' : 'primary'}
                  size="sm"
                  icon={doubt.solved ? CheckCircle2 : HelpCircle}
                >
                  {doubt.solved ? 'AI Resolved' : 'Open Discussion'}
                </Badge>
              </div>

              {/* Question Body */}
              <p className="text-xs md:text-sm text-[#1E1B33] leading-relaxed pl-13">
                {doubt.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {doubt.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#F8F9FE] text-[#676282] border border-[#E6E8F6]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Verified AI Tutor Solution Box if present */}
              {doubt.aiAnswer ? (
                <div className="rounded-2xl bg-[#F1EDFE]/70 border border-[#DCD3FC] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#7C5CFC] text-white flex items-center justify-center text-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-[#4B33BC]">
                        {doubt.aiAnswer.tutor}
                      </span>
                      <span className="text-[11px] text-[#676282]">
                        • {doubt.aiAnswer.timestamp}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFC]">
                      Official Resolution
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-[#1E1B33] whitespace-pre-line leading-relaxed">
                    {doubt.aiAnswer.explanation}
                  </p>

                  {doubt.aiAnswer.codeSnippet && (
                    <div className="rounded-xl bg-[#181528] text-[#F8F9FE] p-3 font-mono text-xs overflow-x-auto">
                      <pre>
                        <code>{doubt.aiAnswer.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#676282]">
                    <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
                    <span>No official AI answer yet. Request instant formulation:</span>
                  </div>
                  <button
                    onClick={() => requestAITutorAnswer(activeRoom.id, doubt.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white text-xs font-bold shadow-snow-sm transition-all"
                  >
                    Generate AI Tutor Answer
                  </button>
                </div>
              )}

              {/* Student Peer Replies */}
              {doubt.replies?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#F0F2FA]">
                  <span className="text-xs font-bold text-[#676282] uppercase tracking-wider">
                    Peer Replies ({doubt.replies.length})
                  </span>
                  {doubt.replies.map((reply, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6] flex items-start gap-2.5 text-xs text-[#1E1B33]"
                    >
                      <img
                        src={reply.avatar}
                        alt={reply.author}
                        className="w-6 h-6 rounded-full object-cover border border-[#E6E8F6]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{reply.author}</span>
                          <span className="text-[10px] text-[#676282]">• {reply.timestamp}</span>
                        </div>
                        <p className="mt-0.5">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar (Upvote, Reply input) */}
              <div className="pt-3 border-t border-[#F0F2FA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => upvoteDoubt(activeRoom.id, doubt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FE] hover:bg-[#F1EDFE] border border-[#E6E8F6] text-xs font-bold text-[#676282] hover:text-[#7C5CFC] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{doubt.upvotes} Helpful</span>
                  </button>

                  <span className="text-xs text-[#676282] flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {doubt.replies?.length || 0} Replies
                  </span>
                </div>

                {/* Reply Input Box */}
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="text"
                    value={replyInput[doubt.id] || ''}
                    onChange={(e) =>
                      setReplyInput((prev) => ({ ...prev, [doubt.id]: e.target.value }))
                    }
                    placeholder="Write a student reply..."
                    className="flex-1 px-3 py-1.5 text-xs bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] placeholder-[#676282] focus:outline-none focus:border-[#7C5CFC]"
                  />
                  <button
                    onClick={() => handleSendReply(doubt.id)}
                    className="p-1.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-8 text-center space-y-3 shadow-snow-sm">
            <MessageSquareQuote className="w-10 h-10 text-[#7C5CFC] mx-auto opacity-50" />
            <h4 className="text-base font-bold text-[#1E1B33]">No Doubts Found</h4>
            <p className="text-xs text-[#676282]">
              Be the first to post a conceptual question in this classroom!
            </p>
          </div>
        )}
      </div>

      {/* Ask Doubt Modal Dialog */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B33]/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border border-[#E6E8F6] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-snow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-3">
              <h3 className="text-lg font-bold text-[#1E1B33] flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#7C5CFC]" />
                <span>Ask a Doubt in {activeRoom.name}</span>
              </h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-xs font-bold text-[#676282] hover:text-[#1E1B33]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostDoubt} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Why does list comprehension run faster than for-loop append?"
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                  Explanation / Code Snippet / What you tried
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Describe what part confused you or paste the problematic code snippet..."
                  className="w-full p-3.5 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Python, Loops, Performance"
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E8F6]">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6] text-xs font-bold text-[#676282]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white text-xs font-bold shadow-snow-sm"
                >
                  Publish Doubt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
