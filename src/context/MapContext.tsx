
import React, { createContext, useContext, useState } from 'react';
import { CityMap, Place, PlaceType, Lane, initialCityMap } from '@/data/mapData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MapContextType {
  cityMap: CityMap;
  selectedPlace: Place | null;
  isAddingPlace: boolean;
  newPlaceType: PlaceType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectPlace: (place: Place | null) => void;
  startAddingPlace: (type: PlaceType) => void;
  cancelAddingPlace: () => void;
  addPlace: (place: Omit<Place, 'id'>) => void;
  updatePlace: (place: Place) => void;
  deletePlace: (placeId: string) => void;
  updateLaneCost: (blockX: number, blockY: number, laneId: string, newCost: number) => void;
  deleteLane: (blockX: number, blockY: number, laneId: string) => void;
  clearSelection: () => void;
  searchPlaces: () => Place[];
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cityMap, setCityMap] = useState<CityMap>(initialCityMap);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceType, setNewPlaceType] = useState<PlaceType>('commercial');
  const [searchQuery, setSearchQuery] = useState('');

  const selectPlace = (place: Place | null) => {
    setSelectedPlace(place);
  };

  const startAddingPlace = (type: PlaceType) => {
    setIsAddingPlace(true);
    setNewPlaceType(type);
    setSelectedPlace(null);
    toast('Click on the map to place a new ' + type);
  };

  const cancelAddingPlace = () => {
    setIsAddingPlace(false);
  };

  const addPlace = (place: Omit<Place, 'id'>) => {
    const newPlace = {
      ...place,
      id: uuidv4()
    };
    
    setCityMap(prev => ({
      ...prev,
      places: [...prev.places, newPlace]
    }));
    
    setIsAddingPlace(false);
    toast.success(`Added new ${place.type}: ${place.name}`);
  };

  const updatePlace = (place: Place) => {
    setCityMap(prev => ({
      ...prev,
      places: prev.places.map(p => p.id === place.id ? place : p)
    }));
    toast.success(`Updated ${place.name}`);
  };

  const deletePlace = (placeId: string) => {
    const placeToDelete = cityMap.places.find(p => p.id === placeId);
    if (placeToDelete) {
      setCityMap(prev => ({
        ...prev,
        places: prev.places.filter(p => p.id !== placeId)
      }));
      
      if (selectedPlace?.id === placeId) {
        setSelectedPlace(null);
      }
      
      toast.success(`Removed ${placeToDelete.name}`);
    }
  };

  const updateLaneCost = (blockX: number, blockY: number, laneId: string, newCost: number) => {
    setCityMap(prev => {
      // Create a deep copy of the blocks grid
      const newBlocks = [...prev.blocks.map(row => [...row])];
      
      // Find the lane and update its cost
      const block = newBlocks[blockY][blockX];
      const updatedLanes = block.lanes.map(lane => 
        lane.id === laneId ? { ...lane, cost: newCost } : lane
      );
      
      // Update the block with the new lanes
      newBlocks[blockY][blockX] = { ...block, lanes: updatedLanes };
      
      return {
        ...prev,
        blocks: newBlocks
      };
    });
    
    toast.success(`Updated lane cost to ${newCost}`);
  };

  const deleteLane = (blockX: number, blockY: number, laneId: string) => {
    setCityMap(prev => {
      // Create a deep copy of the blocks grid
      const newBlocks = [...prev.blocks.map(row => [...row])];
      
      // Find the block and filter out the lane to delete
      const block = newBlocks[blockY][blockX];
      const updatedLanes = block.lanes.filter(lane => lane.id !== laneId);
      
      // Update the block with the remaining lanes
      newBlocks[blockY][blockX] = { ...block, lanes: updatedLanes };
      
      return {
        ...prev,
        blocks: newBlocks
      };
    });
    
    toast.success('Lane removed');
  };

  const clearSelection = () => {
    setSelectedPlace(null);
  };
  
  const searchPlaces = (): Place[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return cityMap.places.filter(place => 
      place.name.toLowerCase().includes(query) || 
      place.description.toLowerCase().includes(query) ||
      place.address.toLowerCase().includes(query)
    );
  };

  const value = {
    cityMap,
    selectedPlace,
    isAddingPlace,
    newPlaceType,
    searchQuery,
    setSearchQuery,
    selectPlace,
    startAddingPlace,
    cancelAddingPlace,
    addPlace,
    updatePlace,
    deletePlace,
    updateLaneCost,
    deleteLane,
    clearSelection,
    searchPlaces
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
