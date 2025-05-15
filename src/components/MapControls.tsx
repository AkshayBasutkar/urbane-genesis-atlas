
import React, { useState } from 'react';
import { useMap } from '@/context/MapContext';
import { PlaceTypeSelector } from './PlaceTypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MapPin, 
  Home, 
  Building, 
  School, 
  Trash2, 
  Edit, 
  Info
} from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

export const MapControls: React.FC = () => {
  const { 
    cityMap, 
    selectedPlace, 
    isAddingPlace,
    cancelAddingPlace,
    deletePlace,
    updatePlace,
    searchQuery,
    setSearchQuery,
    searchPlaces,
    startAddingPlace
  } = useMap();
  
  const searchResults = searchPlaces();
  
  // Edit place state
  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [editedPlace, setEditedPlace] = useState(selectedPlace);
  
  // Start editing the selected place
  const handleEditPlace = () => {
    setEditedPlace(selectedPlace);
    setIsEditingPlace(true);
  };
  
  // Save edited place
  const handleSaveEdit = () => {
    if (editedPlace) {
      updatePlace(editedPlace);
      setIsEditingPlace(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">City Map</h1>
        <p className="text-sm text-gray-500">{cityMap.name} - 25x25 Grid</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {selectedPlace ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{selectedPlace.name}</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={handleEditPlace}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => deletePlace(selectedPlace.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Type:</span> {selectedPlace.type}</p>
                <p><span className="font-medium">Address:</span> {selectedPlace.address}</p>
                <p><span className="font-medium">Description:</span> {selectedPlace.description}</p>
              </div>
            </div>
          ) : isAddingPlace ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Adding New Place</h2>
              <p className="text-sm text-gray-600">Click on the map to place it</p>
              <Button variant="outline" onClick={cancelAddingPlace}>
                Cancel
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="add-place">
                <AccordionTrigger>Add New Place</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <PlaceTypeSelector />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="search">
                <AccordionTrigger>Locate Place</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
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
                                setSearchQuery('');
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="legend">
                <AccordionTrigger>Map Legend</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 pt-2">
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="stats">
                <AccordionTrigger>Statistics</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 text-sm pt-2">
                    <p>Total Places: {cityMap.places.length}</p>
                    <p>Grid Size: 25x25</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="help">
                <AccordionTrigger>Instructions</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 text-sm text-gray-600 pt-2">
                    <li>• Click on a place to view/edit details</li>
                    <li>• Click on a lane to update its cost or delete it</li>
                    <li>• Use the add place menu to add new places</li>
                    <li>• Search for places by name or address</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </ScrollArea>
      
      {!selectedPlace && !isAddingPlace && (
        <div className="mt-auto border-t p-4">
          <Button className="w-full" onClick={() => startAddingPlace('commercial')}>
            <Plus size={16} className="mr-2" />
            Add New Place
          </Button>
        </div>
      )}
      
      {/* Edit Place Dialog */}
      <Dialog open={isEditingPlace} onOpenChange={setIsEditingPlace}>
        <DialogContent>
          <DialogTitle>Edit Place</DialogTitle>
          <DialogDescription>
            Update the details of this place.
          </DialogDescription>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={editedPlace?.name || ''} 
                onChange={e => setEditedPlace(prev => prev ? {...prev, name: e.target.value} : prev)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                value={editedPlace?.description || ''} 
                onChange={e => setEditedPlace(prev => prev ? {...prev, description: e.target.value} : prev)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input 
                value={editedPlace?.address || ''} 
                onChange={e => setEditedPlace(prev => prev ? {...prev, address: e.target.value} : prev)} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPlace(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
