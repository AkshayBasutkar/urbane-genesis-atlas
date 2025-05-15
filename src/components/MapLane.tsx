
import React from 'react';
import { Lane } from '@/data/mapData';
import { cn } from '@/lib/utils';

interface MapLaneProps {
  lane: Lane;
  blockX: number;
  blockY: number;
  blockSize: number;
  onClick: () => void;
}

export const MapLane: React.FC<MapLaneProps> = ({ lane, blockX, blockY, blockSize, onClick }) => {
  // Calculate the start and end points of the lane in actual pixel coordinates
  const startX = blockX * blockSize + (lane.startX * blockSize);
  const startY = blockY * blockSize + (lane.startY * blockSize);
  const endX = blockX * blockSize + (lane.endX * blockSize);
  const endY = blockY * blockSize + (lane.endY * blockSize);
  
  // Calculate the lane length and angle
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Default lane width if not specified
  const laneWidth = 4;
  
  return (
    <div 
      className={cn(
        "absolute cursor-pointer hover:opacity-80 transition-opacity duration-200",
        "flex items-center justify-center"
      )}
      style={{
        left: startX,
        top: startY,
        width: length,
        height: laneWidth,
        backgroundColor: '#9CA3AF', // Gray for roads
        borderRadius: 2,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}
      onClick={onClick}
    >
      <div 
        className="absolute inset-y-0 w-full flex items-center justify-center"
        style={{ transform: `rotate(${-angle}deg)` }}
      >
        <span 
          className="px-1 py-0.5 text-[7px] font-semibold bg-white bg-opacity-80 rounded-sm text-gray-700 whitespace-nowrap"
          style={{ opacity: length > 20 ? 1 : 0 }}
        >
          {lane.cost}
        </span>
      </div>
    </div>
  );
};
