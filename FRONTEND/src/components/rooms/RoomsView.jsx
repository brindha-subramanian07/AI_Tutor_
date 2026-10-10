import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { RoomList } from './RoomList';
import { RoomDetail } from './RoomDetail';

export const RoomsView = () => {
  const { activeRoomId, setActiveRoomId } = useLearning();
  const [viewingDetail, setViewingDetail] = useState(true);

  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setViewingDetail(true);
  };

  return (
    <div>
      {viewingDetail ? (
        <RoomDetail onBackToList={() => setViewingDetail(false)} />
      ) : (
        <RoomList onSelectRoom={handleSelectRoom} />
      )}
    </div>
  );
};
