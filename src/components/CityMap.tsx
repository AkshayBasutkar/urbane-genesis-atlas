
import React, { useState, useRef, useEffect } from 'react';
import { useMap } from '@/context/MapContext';
import { Place, PlaceType } from '@/data/mapData';
import { MapPlace } from './MapPlace';
import { MapLane } from './MapLane';
import { cn } from '@/lib/utils';

interface CityMapProps {
  className?: string;
}

// Constants for the grid
const BLOCK_SIZE = 40; // Size of each block in pixels
const GRID_SIZE = 25; // 25x25 grid

export const CityMap: React.FC<CityMapProps> = ({ className }) => {
  const { 
    cityMap, 
    selectPlace, 
    selectedPlace, 
    isAddingPlace, 
    newPlaceType,
    addPlace,
    clearSelection,
    updateLaneCost,
    deleteLane
  } = useMap();
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLaneCostModal, setShowLaneCostModal] = useState(false);
  const [selectedLane, setSelectedLane] = useState<{ blockX: number, blockY: number, laneId: string, cost: number } | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate total map size
  const mapWidth = GRID_SIZE * BLOCK_SIZE;
  const mapHeight = GRID_SIZE * BLOCK_SIZE;
  
  // Center the map initially
  useEffect(() => {
    if (mapContainerRef.current) {
      const containerWidth = mapContainerRef.current.clientWidth;
      const containerHeight = mapContainerRef.current.clientHeight;
      
      setPosition({
        x: (containerWidth - mapWidth * scale) / 2,
        y: (containerHeight - mapHeight * scale) / 2
      });
    }
  }, []);
  
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
    // Only handle if we're directly clicking the map background (not a place or lane)
    if ((e.target as HTMLDivElement).classList.contains('map-background')) {
      if (isAddingPlace) {
        // Calculate position based on click and current transform
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left - position.x) / (BLOCK_SIZE * scale));
        const y = Math.floor((e.clientY - rect.top - position.y) / (BLOCK_SIZE * scale));
        
        // Ensure coordinates are within the grid
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
          // Create new place
          const newPlace: Omit<Place, 'id'> = {
            name: `New ${newPlaceType}`,
            type: newPlaceType,
            description: `A new ${newPlaceType}`,
            address: `Block ${x},${y}`,
            x,
            y
          };
          
          addPlace(newPlace);
        }
      } else {
        // Clear selection when clicking the background
        clearSelection();
        setSelectedLane(null);
      }
    }
  };
  
  const handleLaneClick = (blockX: number, blockY: number, laneId: string, cost: number) => {
    setSelectedLane({ blockX, blockY, laneId, cost });
    setShowLaneCostModal(true);
  };
  
  const handleUpdateLaneCost = () => {
    if (selectedLane) {
      updateLaneCost(
        selectedLane.blockX, 
        selectedLane.blockY, 
        selectedLane.laneId, 
        selectedLane.cost
      );
      setShowLaneCostModal(false);
    }
  };
  
  const handleDeleteLane = () => {
    if (selectedLane) {
      deleteLane(
        selectedLane.blockX, 
        selectedLane.blockY, 
        selectedLane.laneId
      );
      setShowLaneCostModal(false);
      setSelectedLane(null);
    }
  };
  
  const mapStyle: React.CSSProperties = {
    width: `${mapWidth}px`,
    height: `${mapHeight}px`,
    backgroundColor: '#f0f0f0', // Light gray background
    position: 'relative',
    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
    transformOrigin: '0 0',
    cursor: isAddingPlace ? 'crosshair' : isDragging ? 'grabbing' : 'grab'
  };
  
  return (
    <div 
      ref={mapContainerRef}
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
          backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)',
          opacity: 0.5
        }}></div>
        
        {/* Render lanes */}
        {cityMap.blocks.map((row, rowIndex) => 
          row.map((block, colIndex) => 
            block.lanes.map(lane => (
              <MapLane 
                key={lane.id} 
                lane={lane} 
                blockX={colIndex} 
                blockY={rowIndex}
                blockSize={BLOCK_SIZE}
                onClick={() => handleLaneClick(colIndex, rowIndex, lane.id, lane.cost)}
              />
            ))
          )
        )}
        
        {/* Render places */}
        {cityMap.places.map(place => (
          <MapPlace 
            key={place.id} 
            place={place} 
            isSelected={selectedPlace?.id === place.id} 
            blockSize={BLOCK_SIZE}
          />
        ))}
      </div>
      
      {/* Zoom controls */}
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
      
      {/* Lane Cost Modal */}
      {showLaneCostModal && selectedLane && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Lane Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <input 
                  type="number" 
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={selectedLane.cost}
                  onChange={(e) => setSelectedLane({
                    ...selectedLane,
                    cost: parseInt(e.target.value) || 1
                  })}
                />
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleDeleteLane}
                >
                  Delete Lane
                </button>
                <div>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
                    onClick={() => setShowLaneCostModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleUpdateLaneCost}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
