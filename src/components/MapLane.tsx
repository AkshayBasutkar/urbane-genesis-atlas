
import React from 'react';
import { Lane } from '@/data/mapData';

interface MapLaneProps {
  lane: Lane;
  blockX: number;
  blockY: number;
  blockSize: number;
  onClick: () => void;
}

export const MapLane: React.FC<MapLaneProps> = ({ lane, blockX, blockY, blockSize, onClick }) => {
  // Calculate the actual pixel coordinates
  const startX = (blockX + lane.startX) * blockSize;
  const startY = (blockY + lane.startY) * blockSize;
  const endX = (blockX + lane.endX) * blockSize;
  const endY = (blockY + lane.endY) * blockSize;
  
  // Calculate the length and angle of the lane
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return (
    <div
      className="absolute lane cursor-pointer hover:bg-blue-300 transition-colors duration-200"
      style={{
        left: startX,
        top: startY,
        width: length,
        height: 6,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        backgroundColor: '#666',
        zIndex: 5
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <span 
        className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 bg-white px-1 text-xs rounded shadow"
        style={{ whiteSpace: 'nowrap' }}
      >
        Cost: {lane.cost}
      </span>
    </div>
  );
};
