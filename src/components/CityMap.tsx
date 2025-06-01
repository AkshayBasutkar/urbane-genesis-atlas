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
const GRID_SIZE = 100; // 100x100 grid

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
  const [scale, setScale] = useState(0.2); // Start with an even smaller scale for the larger map
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
    const newScale = Math.min(Math.max(0.1, scale + delta), 2);

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
    if (isAddingPlace) return;
    if (e.button === 0) {
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
  
  const handleMapClick = (e: React.MouseEvent) => {
    if (!isAddingPlace) {
      const target = e.target as HTMLElement;
      if (target.classList.contains('map-background') || 
          target.classList.contains('grid-cell')) {
        clearSelection();
        setSelectedLane(null);
      }
      return;
    }
    
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const gridX = Math.floor((mouseX - position.x) / (BLOCK_SIZE * scale));
    const gridY = Math.floor((mouseY - position.y) / (BLOCK_SIZE * scale));
    
    if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
      const newPlace: Omit<Place, 'id'> = {
        name: `New ${newPlaceType}`,
        type: newPlaceType,
        description: `A new ${newPlaceType}`,
        address: `Block ${gridX},${gridY}`,
        x: gridX,
        y: gridY
      };
      addPlace(newPlace);
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
  
  // Generate row numbers (along the left side) - show every 10th row for 100x100 grid
  const renderRowNumbers = () => {
    return Array.from({ length: GRID_SIZE }).map((_, index) => (
      index % 10 === 0 ? (
        <div 
          key={`row-${index}`}
          className="absolute text-xs font-semibold bg-white/70 px-1 rounded-sm z-10 select-none"
          style={{
            left: -24,
            top: index * BLOCK_SIZE + BLOCK_SIZE/2 - 8,
            transform: 'scale(1)',
            transformOrigin: 'center'
          }}
        >
          {index}
        </div>
      ) : null
    ));
  };

  // Generate column numbers (along the top) - show every 10th column for 100x100 grid
  const renderColumnNumbers = () => {
    return Array.from({ length: GRID_SIZE }).map((_, index) => (
      index % 10 === 0 ? (
        <div 
          key={`col-${index}`}
          className="absolute text-xs font-semibold bg-white/70 px-1 rounded-sm z-10 select-none"
          style={{
            left: index * BLOCK_SIZE + BLOCK_SIZE/2 - 6,
            top: -20,
            transform: 'scale(1)',
            transformOrigin: 'center'
          }}
        >
          {index}
        </div>
      ) : null
    ));
  };

  // Calculate the viewport to only render visible blocks
  const getVisibleRange = () => {
    if (!mapContainerRef.current) return { startX: 0, endX: GRID_SIZE, startY: 0, endY: GRID_SIZE };
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    
    // Calculate which blocks are visible
    const startX = Math.max(0, Math.floor(-position.x / (BLOCK_SIZE * scale)));
    const endX = Math.min(GRID_SIZE, Math.ceil((containerWidth - position.x) / (BLOCK_SIZE * scale)));
    const startY = Math.max(0, Math.floor(-position.y / (BLOCK_SIZE * scale)));
    const endY = Math.min(GRID_SIZE, Math.ceil((containerHeight - position.y) / (BLOCK_SIZE * scale)));
    
    return { startX, endX, startY, endY };
  };

  const { startX, endX, startY, endY } = getVisibleRange();
  
  return (
    <div 
      ref={mapContainerRef} 
      className={cn("relative overflow-hidden border border-gray-300 rounded-lg", className)} 
      onWheel={handleWheel} 
      onMouseDown={handleMouseDown} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp} 
      onClick={handleMapClick}
    >
      <div className="map-background absolute inset-0 w-full h-full" style={mapStyle}>
        {/* Map background with color */}
        <div className="absolute inset-0 bg-slate-100"></div>
        
        {/* Render grid lines for reference */}
        <div className="absolute inset-0" style={{
          backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)'
        }}></div>
        
        {/* Render only visible colored city blocks */}
        {Array.from({ length: endY - startY }).map((_, relativeRowIndex) => {
          const rowIndex = startY + relativeRowIndex;
          return Array.from({ length: endX - startX }).map((_, relativeColIndex) => {
            const colIndex = startX + relativeColIndex;
            return (
              <div 
                key={`block-${colIndex}-${rowIndex}`} 
                className="grid-cell"
                style={{
                  position: 'absolute',
                  left: colIndex * BLOCK_SIZE,
                  top: rowIndex * BLOCK_SIZE,
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  backgroundColor: (rowIndex + colIndex) % 2 === 0 ? '#f8fafc' : '#f1f5f9',
                  border: '1px solid #e2e8f0'
                }} 
              />
            );
          });
        })}
        
        {/* Row and Column numbers */}
        {renderRowNumbers()}
        {renderColumnNumbers()}
        
        {/* Render lanes only for visible blocks */}
        {Array.from({ length: endY - startY }).map((_, relativeRowIndex) => {
          const rowIndex = startY + relativeRowIndex;
          if (rowIndex >= cityMap.blocks.length) return null;
          
          return Array.from({ length: endX - startX }).map((_, relativeColIndex) => {
            const colIndex = startX + relativeColIndex;
            if (colIndex >= cityMap.blocks[rowIndex].length) return null;
            
            const block = cityMap.blocks[rowIndex][colIndex];
            return block.lanes.map(lane => 
              <MapLane 
                key={lane.id} 
                lane={lane} 
                blockX={colIndex} 
                blockY={rowIndex} 
                blockSize={BLOCK_SIZE} 
                onClick={() => handleLaneClick(colIndex, rowIndex, lane.id, lane.cost)} 
              />
            );
          });
        })}
        
        {/* Render places */}
        {cityMap.places.map(place => 
          <MapPlace 
            key={place.id} 
            place={place} 
            isSelected={selectedPlace?.id === place.id} 
            blockSize={BLOCK_SIZE} 
          />
        )}
        
        {/* Render map boundaries (walls) */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800"></div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800"></div>
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-gray-800"></div>
        <div className="absolute top-0 right-0 bottom-0 w-6 bg-gray-800"></div>
      </div>
      
      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <div className="bg-white p-2 rounded-md border border-gray-300 shadow-md">
          <div className="flex items-center gap-2">
            <button onClick={() => setScale(prev => Math.min(prev + 0.1, 2))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
              <Plus size={18} />
            </button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
              <Minus size={18} />
            </button>
          </div>
        </div>
        
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
