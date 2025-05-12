
import React, { useState } from 'react';
import { useMap } from '@/context/MapContext';
import { PlaceDetails } from './PlaceDetails';
import { PlaceTypeSelector } from './PlaceTypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Road } from '@/data/mapData';
import { Plus, Flag, Road as RoadIcon } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    cityMap, 
    selectedPlace, 
    isAddingPlace,
    cancelAddingPlace,
    deletePlace,
    addRoad,
    updateRoad,
  } = useMap();
  
  const [newRoadName, setNewRoadName] = useState('');
  const [newRoadCost, setNewRoadCost] = useState(1);
  const [isAddingRoad, setIsAddingRoad] = useState(false);
  const [roadStart, setRoadStart] = useState({ x: 0, y: 0 });
  
  const handleAddRoad = () => {
    if (!newRoadName) {
      toast.error('Please enter a road name');
      return;
    }
    
    setIsAddingRoad(true);
    toast('Click two points on the map to create a road');
  };
  
  const handleMapClick = (e: React.MouseEvent) => {
    if (!isAddingRoad) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!roadStart.x && !roadStart.y) {
      setRoadStart({ x, y });
      toast('Now click the endpoint for the road');
    } else {
      // Create the road
      const newRoad: Omit<Road, 'id'> = {
        name: newRoadName,
        start: roadStart,
        end: { x, y },
        cost: newRoadCost,
        width: 15
      };
      
      addRoad(newRoad);
      
      // Reset state
      setIsAddingRoad(false);
      setRoadStart({ x: 0, y: 0 });
      setNewRoadName('');
    }
  };
  
  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">{cityMap.name}</h1>
        <p className="text-sm text-gray-500">Interactive City Map</p>
      </div>
      
      <div className="p-4 space-y-6">
        {selectedPlace ? (
          <PlaceDetails 
            place={selectedPlace} 
            onDelete={() => deletePlace(selectedPlace.id)} 
          />
        ) : isAddingPlace ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Adding New Place</h2>
            <p className="text-sm text-gray-600">Click on the map to place it</p>
            <Button variant="outline" onClick={cancelAddingPlace}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Add New Place</h2>
              <PlaceTypeSelector />
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-lg font-semibold">Add New Road</h2>
              <div className="space-y-2">
                <Input
                  placeholder="Road name"
                  value={newRoadName}
                  onChange={(e) => setNewRoadName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm">Cost:</label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={newRoadCost}
                    onChange={(e) => setNewRoadCost(parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <Button 
                  onClick={handleAddRoad}
                  disabled={isAddingRoad}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Road
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <h2 className="text-lg font-semibold">Map Legend</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-residential"></div>
                  <span className="text-xs">Residential</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-commercial"></div>
                  <span className="text-xs">Commercial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-industrial"></div>
                  <span className="text-xs">Industrial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-park"></div>
                  <span className="text-xs">Park</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-hospital"></div>
                  <span className="text-xs">Hospital</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-school"></div>
                  <span className="text-xs">School</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-road"></div>
                  <span className="text-xs">Road</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-lg font-semibold">Statistics</h2>
              <div className="space-y-1 text-sm">
                <p>Total Places: {cityMap.places.length}</p>
                <p>Total Roads: {cityMap.roads.length}</p>
                <p>Total Blocks: {cityMap.blocks.length}</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-auto border-t p-4">
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            <Flag size={16} className="mr-2" />
            Mark Places
          </Button>
          <Button variant="outline" size="sm">
            <RoadIcon size={16} className="mr-2" />
            View Routes
          </Button>
        </div>
      </div>
    </div>
  );
};
