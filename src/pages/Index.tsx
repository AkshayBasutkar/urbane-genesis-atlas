
import React from 'react';
import { MapProvider } from '@/context/MapContext';
import { CityMap } from '@/components/CityMap';
import { Sidebar } from '@/components/Sidebar';

const Index = () => {
  return (
    <MapProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold">City Map Simulation</h1>
          <p className="text-gray-500">Interactive city planning and pathfinding</p>
        </header>
        
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            <CityMap className="min-h-[800px] h-full" />
          </div>
          <Sidebar />
        </main>
      </div>
    </MapProvider>
  );
};

export default Index;
