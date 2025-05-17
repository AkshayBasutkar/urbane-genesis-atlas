
import React, { useState, useRef, useEffect } from 'react';
import { useMap } from '@/context/MapContext';
import { Place } from '@/data/mapData';
import { MapPlace } from './MapPlace';
import { MapLane } from './MapLane';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MapControls } from './MapControls';

interface CityMapProps {
  className?: string;
}

// Constants for the grid
const BLOCK_SIZE = 40; // Size of each block in pixels
const GRID_SIZE = 25; // 25x25 grid

export const CityMap: React.FC<CityMapProps> = ({
  className
}) => {
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
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const [showLaneCostModal, setShowLaneCostModal] = useState(false);
  const [selectedLane, setSelectedLane] = useState<{
    blockX: number;
    blockY: number;
    laneId: string;
    cost: number;
  } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [hoverCell, setHoverCell] = useState<{x: number, y: number} | null>(null);

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
  
  // Convert screen coordinates to grid coordinates
  const screenToGridCoordinates = (screenX: number, screenY: number): {x: number, y: number} => {
    if (!mapContainerRef.current) return {x: -1, y: -1};
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    
    // Calculate position relative to map container
    const relativeX = screenX - rect.left;
    const relativeY = screenY - rect.top;
    
    // Account for the map's transform (position and scale)
    const mapX = (relativeX - position.x) / scale;
    const mapY = (relativeY - position.y) / scale;
    
    // Convert to grid coordinates
    const gridX = Math.floor(mapX / BLOCK_SIZE);
    const gridY = Math.floor(mapY / BLOCK_SIZE);
    
    return { x: gridX, y: gridY };
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 2);

    // Keep the point under the mouse in the same position after scaling
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate the point in the map coordinate system
      const mapPointX = (mouseX - position.x) / scale;
      const mapPointY = (mouseY - position.y) / scale;

      // Calculate the new position
      const newX = mouseX - mapPointX * newScale;
      const newY = mouseY - mapPointY * newScale;
      setPosition({
        x: newX,
        y: newY
      });
    }
    setScale(newScale);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    // If we're adding a new place, don't start dragging
    if (isAddingPlace) return;
    if (e.button === 0) {
      // Left mouse button
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
    
    // Update hover cell for visual feedback when adding places
    if (isAddingPlace) {
      const gridCoords = screenToGridCoordinates(e.clientX, e.clientY);
      
      // Only update if within valid grid range
      if (gridCoords.x >= 0 && gridCoords.x < GRID_SIZE && 
          gridCoords.y >= 0 && gridCoords.y < GRID_SIZE) {
        setHoverCell(gridCoords);
      } else {
        setHoverCell(null);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverCell(null);
  };
  
  // Handle clicks anywhere on the map for adding places
  const handleMapClick = (e: React.MouseEvent) => {
    // Get grid coordinates regardless of what was clicked
    const gridCoords = screenToGridCoordinates(e.clientX, e.clientY);
    
    // Check if clicked on a background element to clear selection
    const target = e.target as HTMLElement;
    const isBackgroundClick = target.classList.contains('map-background') || 
                              target.classList.contains('grid-cell');
    
    // If not adding a place and clicked on background, clear selection
    if (!isAddingPlace && isBackgroundClick) {
      clearSelection();
      setSelectedLane(null);
      return;
    }
    
    // If we're adding a place, check coordinates are valid
    if (isAddingPlace) {
      // Ensure coordinates are within the grid
      if (gridCoords.x >= 0 && gridCoords.x < GRID_SIZE && 
          gridCoords.y >= 0 && gridCoords.y < GRID_SIZE) {
        
        console.log("Adding place at grid coordinates:", gridCoords.x, gridCoords.y);
        
        // Create new place
        const newPlace: Omit<Place, 'id'> = {
          name: `New ${newPlaceType}`,
          type: newPlaceType,
          description: `A new ${newPlaceType}`,
          address: `Block ${gridCoords.x},${gridCoords.y}`,
          x: gridCoords.x,
          y: gridCoords.y
        };
        addPlace(newPlace);
      }
    }
  };
  
  const handleLaneClick = (blockX: number, blockY: number, laneId: string, cost: number) => {
    setSelectedLane({
      blockX,
      blockY,
      laneId,
      cost
    });
    setShowLaneCostModal(true);
  };
  
  const handleUpdateLaneCost = () => {
    if (selectedLane) {
      updateLaneCost(selectedLane.blockX, selectedLane.blockY, selectedLane.laneId, selectedLane.cost);
      setShowLaneCostModal(false);
    }
  };
  
  const handleDeleteLane = () => {
    if (selectedLane) {
      deleteLane(selectedLane.blockX, selectedLane.blockY, selectedLane.laneId);
      setShowLaneCostModal(false);
      setSelectedLane(null);
    }
  };
  
  const mapStyle: React.CSSProperties = {
    width: `${mapWidth}px`,
    height: `${mapHeight}px`,
    position: 'relative',
    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
    transformOrigin: '0 0',
    cursor: isAddingPlace ? 'crosshair' : isDragging ? 'grabbing' : 'grab'
  };
  
  return (
    <div 
      ref={mapContainerRef} 
      className={cn("relative overflow-hidden border border-gray-300 rounded-lg w-full h-full", className)} 
      onWheel={handleWheel} 
      onMouseDown={handleMouseDown} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseLeave} 
      onClick={handleMapClick}
    >
      {/* Clickable background overlay that covers entire container */}
      <div className="map-background absolute inset-0 z-0" />
      
      {/* The actual map with grid and places */}
      <div className="absolute inset-0" style={mapStyle}>
        {/* Map background with color */}
        <div className="absolute inset-0 bg-slate-100"></div>
        
        {/* Render grid lines for reference */}
        <div className="absolute inset-0" style={{
          backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)'
        }}></div>
        
        {/* Render colored city blocks with grid-cell class for better click handling */}
        {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => 
          Array.from({ length: GRID_SIZE }).map((_, colIndex) => (
            <div 
              key={`block-${rowIndex}-${colIndex}`} 
              className="grid-cell"
              style={{
                position: 'absolute',
                left: colIndex * BLOCK_SIZE,
                top: rowIndex * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: 
                  hoverCell && hoverCell.x === colIndex && hoverCell.y === rowIndex && isAddingPlace
                    ? 'rgba(59, 130, 246, 0.2)' // Highlight hovered cell when adding place
                    : (rowIndex + colIndex) % 2 === 0 ? '#f8fafc' : '#f1f5f9',
                border: hoverCell && hoverCell.x === colIndex && hoverCell.y === rowIndex && isAddingPlace 
                  ? '2px dashed #3b82f6' // Highlight border for visual feedback
                  : '1px solid #e2e8f0',
                zIndex: 1
              }} 
            />
          ))
        )}
        
        {/* Render lanes */}
        {cityMap.blocks.map((row, rowIndex) => 
          row.map((block, colIndex) => 
            block.lanes.map(lane => 
              <MapLane 
                key={lane.id} 
                lane={lane} 
                blockX={colIndex} 
                blockY={rowIndex} 
                blockSize={BLOCK_SIZE} 
                onClick={() => handleLaneClick(colIndex, rowIndex, lane.id, lane.cost)} 
              />
            )
          )
        )}
        
        {/* Render places */}
        {cityMap.places.map(place => 
          <MapPlace 
            key={place.id} 
            place={place} 
            isSelected={selectedPlace?.id === place.id} 
            blockSize={BLOCK_SIZE} 
          />
        )}
        
        {/* Render map boundaries (walls) with proper z-index */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 z-5"></div> {/* Top wall */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800 z-5"></div> {/* Bottom wall */}
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-gray-800 z-5"></div> {/* Left wall */}
        <div className="absolute top-0 right-0 bottom-0 w-6 bg-gray-800 z-5"></div> {/* Right wall */}
      </div>
      
      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 space-y-2 z-20">
        <div className="bg-white p-2 rounded-md border border-gray-300 shadow-md">
          <div className="flex items-center gap-2">
            <button onClick={() => setScale(prev => Math.min(prev + 0.1, 2))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
              <Plus size={18} />
            </button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
              <Minus size={18} />
            </button>
          </div>
        </div>
        
        {/* Collapsible Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white shadow-md">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <MapControls />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Lane Cost Modal */}
      {showLaneCostModal && selectedLane && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  onChange={e => setSelectedLane({
                    ...selectedLane,
                    cost: parseInt(e.target.value) || 1
                  })} 
                />
              </div>
              <div className="flex justify-between">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={handleDeleteLane}>
                  Delete Lane
                </button>
                <div>
                  <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2" onClick={() => setShowLaneCostModal(false)}>
                    Cancel
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpdateLaneCost}>
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
