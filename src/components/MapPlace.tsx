
import React from 'react';
import { Place } from '@/data/mapData';
import { useMap } from '@/context/MapContext';
import { Home, Building, MapPin, School } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapPlaceProps {
  place: Place;
  isSelected: boolean;
  blockSize: number;
}

export const MapPlace: React.FC<MapPlaceProps> = ({ place, isSelected, blockSize }) => {
  const { selectPlace } = useMap();
  
  // Determine icon based on place type
  const renderIcon = () => {
    switch (place.type) {
      case 'residential':
        return <Home size={16} />;
      case 'commercial':
        return <Building size={16} />;
      case 'public':
        return <MapPin size={16} />;
      case 'utility':
        return <School size={16} />;
      default:
        return null;
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPlace(place);
  };
  
  return (
    <div
      className={cn(
        "absolute flex flex-col items-center justify-center transition-all p-1 rounded-full",
        place.type,
        isSelected ? 'ring-2 ring-blue-500 shadow-lg bg-white' : 'hover:ring-1 hover:ring-blue-300 bg-white bg-opacity-80'
      )}
      style={{
        left: place.x * blockSize + blockSize / 2 - 15,
        top: place.y * blockSize + blockSize / 2 - 15,
        width: 30,
        height: 30,
        cursor: 'pointer',
        zIndex: isSelected ? 10 : 6
      }}
      onClick={handleClick}
    >
      {renderIcon()}
      
      {/* Name tooltip that appears on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
        {place.name}
      </div>
    </div>
  );
};
