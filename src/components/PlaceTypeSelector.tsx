
import React from 'react';
import { useMap } from '@/context/MapContext';
import { Button } from '@/components/ui/button';
import { Home, Building, School, MapPin } from 'lucide-react';

export const PlaceTypeSelector: React.FC = () => {
  const { startAddingPlace } = useMap();
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="flex flex-col h-20 items-center justify-center"
          onClick={() => startAddingPlace('residential')}
        >
          <Home className="mb-1" size={20} />
          <span className="text-xs">Residential</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col h-20 items-center justify-center"
          onClick={() => startAddingPlace('commercial')}
        >
          <Building className="mb-1" size={20} />
          <span className="text-xs">Commercial</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col h-20 items-center justify-center"
          onClick={() => startAddingPlace('public')}
        >
          <MapPin className="mb-1" size={20} />
          <span className="text-xs">Public</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col h-20 items-center justify-center"
          onClick={() => startAddingPlace('utility')}
        >
          <School className="mb-1" size={20} />
          <span className="text-xs">Utility</span>
        </Button>
      </div>
    </div>
  );
};
