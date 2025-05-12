
import React, { useState } from 'react';
import { useMap } from '@/context/MapContext';
import { Place, PlaceType } from '@/data/mapData';
import { MapPlace } from './MapPlace';
import { MapRoad } from './MapRoad';
import { cn } from '@/lib/utils';

interface CityMapProps {
  className?: string;
}

export const CityMap: React.FC<CityMapProps> = ({ className }) => {
  const { 
    cityMap, 
    selectPlace, 
    selectedPlace, 
    isAddingPlace, 
    newPlaceType,
    addPlace,
    clearSelection 
  } = useMap();
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 2);
    setScale(newScale);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    // If we're adding a new place, don't start dragging
    if (isAddingPlace) return;
    
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only handle if we're directly clicking the map background (not a place)
    if ((e.target as HTMLDivElement).classList.contains('map-background')) {
      if (isAddingPlace) {
        // Calculate position based on click and current transform
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = (e.clientX - rect.left - position.x) / scale;
        const y = (e.clientY - rect.top - position.y) / scale;
        
        // Create new place
        const newPlace: Omit<Place, 'id'> = {
          name: `New ${newPlaceType}`,
          type: newPlaceType,
          x,
          y,
          width: newPlaceType === 'road' ? 30 : 80,
          height: newPlaceType === 'road' ? 15 : 50,
          description: `A new ${newPlaceType}`
        };
        
        addPlace(newPlace);
      } else {
        // Clear selection when clicking the background
        clearSelection();
      }
    }
  };
  
  const mapStyle: React.CSSProperties = {
    width: `${cityMap.width}px`,
    height: `${cityMap.height}px`,
    backgroundColor: '#e5e7eb', // Light gray background
    position: 'relative',
    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
    transformOrigin: '0 0',
    cursor: isAddingPlace ? 'crosshair' : isDragging ? 'grabbing' : 'grab'
  };
  
  return (
    <div 
      className={cn("relative overflow-hidden border border-gray-300 rounded-lg", className)}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleBackgroundClick}
    >
      <div 
        className="map-background" 
        style={mapStyle}
      >
        {/* Render grid lines for reference */}
        <div className="absolute inset-0" style={{ 
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)',
          opacity: 0.5
        }}></div>
        
        {/* Render roads */}
        {cityMap.roads.map(road => (
          <MapRoad key={road.id} road={road} />
        ))}
        
        {/* Render places */}
        {cityMap.places.map(place => (
          <MapPlace 
            key={place.id} 
            place={place} 
            isSelected={selectedPlace?.id === place.id} 
          />
        ))}
        
        {/* Render blocks */}
        {cityMap.blocks.map(block => (
          <div 
            key={block.id}
            className="absolute border-2 border-dashed border-gray-600 pointer-events-none"
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height
            }}
          >
            <div className="absolute -top-6 left-0 bg-white px-2 py-1 text-xs font-bold rounded border border-gray-300">
              {block.name}
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md border border-gray-300 shadow-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
          >
            +
          </button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};
