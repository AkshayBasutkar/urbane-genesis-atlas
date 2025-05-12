
import React, { useState } from 'react';
import { Place, PlaceType } from '@/data/mapData';
import { useMap } from '@/context/MapContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash } from 'lucide-react';

interface PlaceDetailsProps {
  place: Place;
  onDelete: () => void;
}

export const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place, onDelete }) => {
  const { updatePlace } = useMap();
  const [editedPlace, setEditedPlace] = useState<Place>({ ...place });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPlace(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value: PlaceType) => {
    setEditedPlace(prev => ({ ...prev, type: value }));
  };
  
  const handleSave = () => {
    updatePlace(editedPlace);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Place Details</h2>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash size={16} />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name"
            value={editedPlace.name} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Type</Label>
          <Select 
            value={editedPlace.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            name="address"
            value={editedPlace.address} 
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description"
            value={editedPlace.description || ''} 
            onChange={handleChange}
            rows={3} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="x">X Position</Label>
            <Input 
              id="x" 
              name="x"
              type="number" 
              value={editedPlace.x} 
              onChange={(e) => setEditedPlace(prev => ({ 
                ...prev, x: parseInt(e.target.value) 
              }))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="y">Y Position</Label>
            <Input 
              id="y" 
              name="y"
              type="number" 
              value={editedPlace.y} 
              onChange={(e) => setEditedPlace(prev => ({ 
                ...prev, y: parseInt(e.target.value) 
              }))} 
            />
          </div>
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
