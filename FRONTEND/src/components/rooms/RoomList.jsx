import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Users2,
  PlusCircle,
  KeyRound,
  ArrowRight,
  MessageSquareQuote,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const RoomList = ({ onSelectRoom }) => {
  const { rooms, createRoom, addToast } = useLearning();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    createRoom({
      name: roomName,
      code: roomCode.trim() || undefined,
      description: roomDesc.trim() || 'Collaborative student study pod'
    });

    setRoomName('');
    setRoomCode('');
    setRoomDesc('');
    setShowCreateModal(false);
  };

  const handleJoinWithCode = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    const matched = rooms.find(
      (r) => r.code.toLowerCase() === joinCodeInput.trim().toLowerCase()
    );
    if (matched) {
      onSelectRoom(matched.id);
      addToast(`Joined room "${matched.name}"!`, 'success');
      setJoinCodeInput('');
    } else {
      addToast(`Room with code "${joinCodeInput}" not found.`, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
              Collaborative Classrooms
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] mt-0.5">
            Learning Rooms & Study Pods
          </h2>
          <p className="text-xs md:text-sm text-[#676282]">
            Join peer study spaces, discuss doubts with classmates and verify solutions with AI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#9678FA] text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-snow-md hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Room</span>
          </button>
        </div>
      </div>

      {/* Join by Code Bar */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E6E8F6] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-snow-sm">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-[#7C5CFC]" />
          <div>
            <h4 className="text-xs font-bold text-[#1E1B33]">
              Have an invitation code from your professor or classmate?
            </h4>
            <p className="text-[11px] text-[#676282]">
              Enter a room code (e.g. PY-204, AI-501) to join immediately.
            </p>
          </div>
        </div>

        <form onSubmit={handleJoinWithCode} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="e.g. PY-204"
            className="px-3 py-1.5 text-xs bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none uppercase font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-[#F8F9FE] hover:bg-[#7C5CFC] text-[#1E1B33] hover:text-white border border-[#E6E8F6] text-xs font-bold transition-all shadow-snow-sm"
          >
            Join
          </button>
        </form>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm hover:shadow-snow-md hover:border-[#DCD3FC] transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-[#F1EDFE] border border-[#DCD3FC] text-[#7C5CFC]">
                  {room.code}
                </span>
                <Badge variant="mint" size="sm">
                  {room.membersCount} Members
                </Badge>
              </div>

              <h3 className="text-base font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors">
                {room.name}
              </h3>

              <p className="text-xs text-[#676282] leading-relaxed line-clamp-2">
                {room.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-[#676282] border-t border-[#F0F2FA]">
                <span className="flex items-center gap-1 font-medium text-[#7C5CFC]">
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                  {room.activeDoubts} Active Doubts
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  AI Verified
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoom(room.id)}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#F8F9FE] hover:bg-[#7C5CFC] text-[#1E1B33] hover:text-white border border-[#E6E8F6] hover:border-[#7C5CFC] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-snow-sm"
            >
              <span>Enter Classroom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B33]/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border border-[#E6E8F6] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-snow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-3">
              <h3 className="text-lg font-bold text-[#1E1B33]">
                Create New Learning Room
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs font-bold text-[#676282] hover:text-[#1E1B33]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab Group"
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                  Custom Code (Optional)
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="e.g. DS-302"
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC] uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                  Description
                </label>
                <textarea
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe what this room discusses..."
                  className="w-full p-3.5 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E8F6]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F9FE] border border-[#E6E8F6] text-xs font-bold text-[#676282]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white text-xs font-bold shadow-snow-sm"
                >
                  Create Pod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
