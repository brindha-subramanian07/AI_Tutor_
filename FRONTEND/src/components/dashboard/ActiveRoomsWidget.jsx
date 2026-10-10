import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Users2, MessageSquareQuote, ArrowRight, PlusCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ActiveRoomsWidget = () => {
  const { rooms, setActiveRoomId, setActiveTab } = useLearning();

  const handleOpenRoom = (roomId) => {
    setActiveRoomId(roomId);
    setActiveTab('rooms');
  };

  return (
    <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981]">
              <Users2 className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E1B33]">
                Classroom Learning Pods
              </h3>
              <p className="text-xs text-[#676282]">
                Collaborate with peers, ask doubts & get verified AI solutions
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('rooms')}
            className="text-xs font-bold text-[#7C5CFC] hover:underline"
          >
            All Pods ({rooms.length}) →
          </button>
        </div>

        <div className="space-y-3">
          {rooms.slice(0, 2).map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#E6E8F6] hover:border-[#DCD3FC] transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#F1EDFE] text-[#7C5CFC] font-mono border border-[#DCD3FC]">
                    {room.code}
                  </span>
                  <Badge variant="mint" size="sm">
                    {room.membersCount} Members Active
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-[#1E1B33] group-hover:text-[#7C5CFC] transition-colors">
                  {room.name}
                </h4>

                <p className="text-xs text-[#676282] line-clamp-1 mt-1">
                  {room.description}
                </p>

                <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-[#E6E8F6] text-xs text-[#676282]">
                  <span className="flex items-center gap-1 font-medium text-[#7C5CFC]">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    {room.activeDoubts} Active Doubts
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    AI Tutor Verified
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenRoom(room.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#7C5CFC] text-[#1E1B33] hover:text-white border border-[#E6E8F6] hover:border-[#7C5CFC] text-xs font-bold transition-all shadow-snow-sm"
              >
                <span>Enter Classroom Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
