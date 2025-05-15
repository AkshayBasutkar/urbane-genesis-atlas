
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
  
  // Calculate position based on block size
  const posX = place.x * blockSize + (blockSize / 2);
  const posY = place.y * blockSize + (blockSize / 2);
  
  // Get icon based on place type
  const getIcon = () => {
    switch (place.type) {
      case 'residential':
        return <Home size={14} className="text-orange-600" />;
      case 'commercial':
        return <Building size={14} className="text-blue-600" />;
      case 'public':
        return <MapPin size={14} className="text-green-600" />;
      case 'utility':
        return <School size={14} className="text-purple-600" />;
      default:
        return <MapPin size={14} />;
    }
  };
  
  // Get background color based on place type
  const getBackgroundColor = () => {
    switch (place.type) {
      case 'residential':
        return 'bg-orange-100';
      case 'commercial':
        return 'bg-blue-100';
      case 'public':
        return 'bg-green-100';
      case 'utility':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  return (
    <div 
      className={cn(
        'absolute cursor-pointer flex items-center justify-center',
        'rounded-full border transition-all duration-200',
        getBackgroundColor(),
        isSelected ? 'w-6 h-6 shadow-md z-10 border-gray-400' : 'w-5 h-5 hover:w-6 hover:h-6 border-gray-300'
      )}
      style={{
        left: posX - (isSelected ? 12 : 10),
        top: posY - (isSelected ? 12 : 10),
        transform: `translate(-50%, -50%)`
      }}
      onClick={() => selectPlace(place)}
    >
      {getIcon()}
      
      {isSelected && (
        <div 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-20"
        >
          {place.name}
        </div>
      )}
    </div>
  );
};
