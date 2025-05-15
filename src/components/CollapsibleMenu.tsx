
import React, { useState } from 'react';
import { useMap } from '@/context/MapContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Plus, Trash2, Edit, ChevronUp, ChevronDown, Menu } from 'lucide-react';
import { PlaceTypeSelector } from './PlaceTypeSelector';
import { PlaceType } from '@/data/mapData';

export const CollapsibleMenu: React.FC = () => {
  const { 
    selectedPlace, 
    startAddingPlace, 
    isAddingPlace, 
    cancelAddingPlace,
    deletePlace,
    updatePlace,
  } = useMap();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlace, setEditedPlace] = useState(selectedPlace);

  // Handle the start of place editing
  const handleEditPlace = () => {
    setEditedPlace(selectedPlace);
    setIsEditing(true);
  };

  // Save the edited place
  const handleSavePlace = () => {
    if (editedPlace) {
      updatePlace(editedPlace);
      setIsEditing(false);
    }
  };

  // Handle field changes in edit mode
  const handleFieldChange = (field: string, value: string) => {
    if (editedPlace) {
      setEditedPlace({
        ...editedPlace,
        [field]: value
      });
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className="w-[280px] shadow-lg rounded-lg bg-white"
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
            {isOpen ? <ChevronUp size={20} /> : <Menu size={20} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-4">
          <div className="text-lg font-bold">Map Controls</div>
          
          {/* Add Place Controls */}
          {!isAddingPlace && !selectedPlace && (
            <div className="space-y-4">
              <Button 
                className="w-full flex items-center justify-between"
                onClick={() => startAddingPlace('commercial')}
              >
                <span>Add New Place</span>
                <Plus size={16} />
              </Button>
              <PlaceTypeSelector />
            </div>
          )}

          {/* Show when adding a place */}
          {isAddingPlace && (
            <div className="space-y-2">
              <div className="font-medium">Adding New Place</div>
              <p className="text-sm text-gray-500">Click on the map to place it</p>
              <Button variant="outline" className="w-full" onClick={cancelAddingPlace}>
                Cancel
              </Button>
            </div>
          )}

          {/* Selected Place Controls */}
          {selectedPlace && !isEditing && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
                <p className="text-sm text-gray-500">{selectedPlace.type} - {selectedPlace.address}</p>
                <p className="text-sm mt-2">{selectedPlace.description}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleEditPlace}
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:text-red-700"
                  onClick={() => deletePlace(selectedPlace.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Edit Place Form */}
          {isEditing && editedPlace && (
            <Drawer open={isEditing} onOpenChange={setIsEditing}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Edit Place</DrawerTitle>
                  <DrawerDescription>
                    Make changes to the selected place.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 py-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={editedPlace.name} 
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={editedPlace.description} 
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={editedPlace.address} 
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleSavePlace}>Save changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
