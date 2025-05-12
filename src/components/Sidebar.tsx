
import React, { useState } from 'react';
import { useMap } from '@/context/MapContext';
import { PlaceDetails } from './PlaceDetails';
import { PlaceTypeSelector } from './PlaceTypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MapPin, Home, Building, School } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    cityMap, 
    selectedPlace, 
    isAddingPlace,
    cancelAddingPlace,
    deletePlace,
    searchQuery,
    setSearchQuery,
    searchPlaces
  } = useMap();
  
  const searchResults = searchPlaces();
  
  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Interactive City Map</h1>
        <p className="text-sm text-gray-500">{cityMap.name} - 25x25 Grid</p>
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
              <h2 className="text-lg font-semibold">Locate Place</h2>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="icon">
                  <Search size={18} />
                </Button>
              </div>
              
              {searchQuery && (
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {searchResults.map(place => (
                      <div 
                        key={place.id}
                        className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          // Select the place to highlight it on the map
                          useState(() => {
                            setSearchQuery('');
                            return null;
                          });
                        }}
                      >
                        <MapPin size={16} className="mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{place.name}</p>
                          <p className="text-xs text-gray-500 truncate">{place.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <h2 className="text-lg font-semibold">Instructions</h2>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Click on a place to view/edit details</li>
                <li>• Click on a lane to update its cost or delete it</li>
                <li>• Use the buttons above to add new places</li>
                <li>• Search for places by name or address</li>
              </ul>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <h2 className="text-lg font-semibold">Map Legend</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <Home size={10} />
                  </div>
                  <span className="text-xs">Residential</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <Building size={10} />
                  </div>
                  <span className="text-xs">Commercial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <MapPin size={10} />
                  </div>
                  <span className="text-xs">Public</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <School size={10} />
                  </div>
                  <span className="text-xs">Utility</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-lg font-semibold">Statistics</h2>
              <div className="space-y-1 text-sm">
                <p>Total Places: {cityMap.places.length}</p>
                <p>Grid Size: 25x25</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {!selectedPlace && !isAddingPlace && (
        <div className="mt-auto border-t p-4">
          <Button className="w-full">
            <Plus size={16} className="mr-2" />
            Add New Place
          </Button>
        </div>
      )}
    </div>
  );
};
