
import React from 'react';
import { Place } from '@/data/mapData';
import { useMap } from '@/context/MapContext';
import { Building, Home, School, Tree, Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapPlaceProps {
  place: Place;
  isSelected: boolean;
}

export const MapPlace: React.FC<MapPlaceProps> = ({ place, isSelected }) => {
  const { selectPlace } = useMap();
  
  // Determine icon based on place type
  const renderIcon = () => {
    switch (place.type) {
      case 'residential':
        return <Home size={16} />;
      case 'commercial':
        return <Building size={16} />;
      case 'industrial':
        return <Building2 size={16} />;
      case 'park':
        return <Tree size={16} />;
      case 'hospital':
        return <MapPin size={16} />;
      case 'school':
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
        "absolute flex flex-col items-center justify-center transition-all",
        place.type,
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-blue-300'
      )}
      style={{
        left: place.x,
        top: place.y,
        width: place.width,
        height: place.height,
        cursor: 'pointer',
        zIndex: isSelected ? 10 : 1
      }}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        {renderIcon()}
        <span className="text-xs font-semibold truncate">{place.name}</span>
      </div>
    </div>
  );
};
