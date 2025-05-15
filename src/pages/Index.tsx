
import React from 'react';
import { MapProvider } from '@/context/MapContext';
import { CityMap } from '@/components/CityMap';
import { CollapsibleMenu } from '@/components/CollapsibleMenu';

const Index = () => {
  return (
    <MapProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold">Interactive City Map</h1>
          <p className="text-gray-500">25x25 grid city map with places and lanes</p>
        </header>
        
        <main className="flex-1 overflow-hidden relative">
          <CityMap className="h-full" />
          <CollapsibleMenu />
        </main>
      </div>
    </MapProvider>
  );
};

export default Index;
