
import React, { createContext, useContext, useState } from 'react';
import { CityMap, Place, PlaceType, Road, initialCityMap } from '@/data/mapData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MapContextType {
  cityMap: CityMap;
  selectedPlace: Place | null;
  isAddingPlace: boolean;
  newPlaceType: PlaceType;
  selectPlace: (place: Place | null) => void;
  startAddingPlace: (type: PlaceType) => void;
  cancelAddingPlace: () => void;
  addPlace: (place: Omit<Place, 'id'>) => void;
  updatePlace: (place: Place) => void;
  deletePlace: (placeId: string) => void;
  addRoad: (road: Omit<Road, 'id'>) => void;
  updateRoad: (road: Road) => void;
  deleteRoad: (roadId: string) => void;
  clearSelection: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cityMap, setCityMap] = useState<CityMap>(initialCityMap);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceType, setNewPlaceType] = useState<PlaceType>('commercial');

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

  const addRoad = (road: Omit<Road, 'id'>) => {
    const newRoad = {
      ...road,
      id: uuidv4()
    };
    
    setCityMap(prev => ({
      ...prev,
      roads: [...prev.roads, newRoad]
    }));
    
    toast.success(`Added new road: ${road.name}`);
  };

  const updateRoad = (road: Road) => {
    setCityMap(prev => ({
      ...prev,
      roads: prev.roads.map(r => r.id === road.id ? road : r)
    }));
    toast.success(`Updated ${road.name}`);
  };

  const deleteRoad = (roadId: string) => {
    const roadToDelete = cityMap.roads.find(r => r.id === roadId);
    if (roadToDelete) {
      setCityMap(prev => ({
        ...prev,
        roads: prev.roads.filter(r => r.id !== roadId)
      }));
      toast.success(`Removed ${roadToDelete.name}`);
    }
  };

  const clearSelection = () => {
    setSelectedPlace(null);
  };

  const value = {
    cityMap,
    selectedPlace,
    isAddingPlace,
    newPlaceType,
    selectPlace,
    startAddingPlace,
    cancelAddingPlace,
    addPlace,
    updatePlace,
    deletePlace,
    addRoad,
    updateRoad,
    deleteRoad,
    clearSelection
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
