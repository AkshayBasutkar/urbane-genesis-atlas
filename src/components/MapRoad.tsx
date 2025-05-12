
import React from 'react';
import { Road } from '@/data/mapData';

interface MapRoadProps {
  road: Road;
}

export const MapRoad: React.FC<MapRoadProps> = ({ road }) => {
  // Calculate the angle and length of the road
  const dx = road.end.x - road.start.x;
  const dy = road.end.y - road.start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return (
    <div
      className="absolute road flex items-center justify-center"
      style={{
        left: road.start.x,
        top: road.start.y,
        width: length,
        height: road.width,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] font-bold text-gray-700 px-1 py-0.5 bg-white/80 rounded whitespace-nowrap">
          {road.name} (Cost: {road.cost})
        </span>
      </div>
    </div>
  );
};
