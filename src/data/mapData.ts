
export type PlaceType = 
  'residential' | 
  'commercial' | 
  'industrial' | 
  'park' | 
  'hospital' | 
  'school' | 
  'road';

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Road {
  id: string;
  name: string;
  start: { x: number, y: number };
  end: { x: number, y: number };
  cost: number;
  width: number;
}

export interface Block {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  places: Place[];
}

export interface CityMap {
  name: string;
  width: number;
  height: number;
  blocks: Block[];
  roads: Road[];
  places: Place[];
}

// Initial city map data
export const initialCityMap: CityMap = {
  name: "Academica",
  width: 1000,
  height: 800,
  blocks: [
    {
      id: "block-1",
      name: "Downtown",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      places: []
    },
    {
      id: "block-2",
      name: "Residential Area",
      x: 500,
      y: 100,
      width: 300,
      height: 200,
      places: []
    },
    {
      id: "block-3",
      name: "Industrial Park",
      x: 100,
      y: 400,
      width: 300,
      height: 200,
      places: []
    },
    {
      id: "block-4",
      name: "University District",
      x: 500,
      y: 400,
      width: 300,
      height: 200,
      places: []
    }
  ],
  roads: [
    // Horizontal roads
    {
      id: "road-1",
      name: "Main Street",
      start: { x: 0, y: 200 },
      end: { x: 1000, y: 200 },
      cost: 1,
      width: 20
    },
    {
      id: "road-2",
      name: "College Avenue",
      start: { x: 0, y: 500 },
      end: { x: 1000, y: 500 },
      cost: 1,
      width: 20
    },
    // Vertical roads
    {
      id: "road-3",
      name: "Market Street",
      start: { x: 200, y: 0 },
      end: { x: 200, y: 800 },
      cost: 2,
      width: 20
    },
    {
      id: "road-4",
      name: "Tech Boulevard",
      start: { x: 450, y: 0 },
      end: { x: 450, y: 800 },
      cost: 1,
      width: 20
    },
    {
      id: "road-5",
      name: "Park Road",
      start: { x: 700, y: 0 },
      end: { x: 700, y: 800 },
      cost: 3,
      width: 20
    },
    // Connecting roads
    {
      id: "road-6",
      name: "Central Avenue",
      start: { x: 200, y: 200 },
      end: { x: 450, y: 200 },
      cost: 1,
      width: 15
    },
    {
      id: "road-7",
      name: "University Drive",
      start: { x: 450, y: 500 },
      end: { x: 700, y: 500 },
      cost: 2,
      width: 15
    }
  ],
  places: [
    // Downtown block
    {
      id: "place-1",
      name: "City Hall",
      type: "commercial",
      description: "The main administrative building of the city",
      x: 120,
      y: 120,
      width: 70,
      height: 60
    },
    {
      id: "place-2",
      name: "Central Park",
      type: "park",
      description: "A beautiful park in the heart of downtown",
      x: 220,
      y: 120,
      width: 160,
      height: 60
    },
    {
      id: "place-3",
      name: "Downtown Hospital",
      type: "hospital",
      description: "The main hospital serving the city center",
      x: 120,
      y: 220,
      width: 100,
      height: 60
    },
    
    // Residential Area
    {
      id: "place-4",
      name: "Sunset Apartments",
      type: "residential",
      description: "A luxury apartment complex",
      x: 520,
      y: 120,
      width: 120,
      height: 80
    },
    {
      id: "place-5",
      name: "Community Center",
      type: "commercial",
      description: "Local community gathering space",
      x: 660,
      y: 120,
      width: 100,
      height: 60
    },
    {
      id: "place-6",
      name: "Neighborhood Park",
      type: "park",
      description: "A small park for local residents",
      x: 600,
      y: 220,
      width: 80,
      height: 60
    },
    
    // Industrial Park
    {
      id: "place-7",
      name: "Tech Manufacturing",
      type: "industrial",
      description: "A large manufacturing facility",
      x: 120,
      y: 420,
      width: 140,
      height: 100
    },
    {
      id: "place-8",
      name: "Research Labs",
      type: "industrial",
      description: "Advanced research facilities",
      x: 280,
      y: 420,
      width: 100,
      height: 80
    },
    {
      id: "place-9",
      name: "Innovation Center",
      type: "commercial",
      description: "Hub for startups and tech companies",
      x: 200,
      y: 540,
      width: 120,
      height: 50
    },
    
    // University District
    {
      id: "place-10",
      name: "State University",
      type: "school",
      description: "The main campus of the state university",
      x: 520,
      y: 420,
      width: 180,
      height: 120
    },
    {
      id: "place-11",
      name: "Student Housing",
      type: "residential",
      description: "Housing for university students",
      x: 720,
      y: 420,
      width: 60,
      height: 120
    },
    {
      id: "place-12",
      name: "Science Center",
      type: "school",
      description: "Advanced research and education facility",
      x: 580,
      y: 560,
      width: 100,
      height: 30
    }
  ]
};
