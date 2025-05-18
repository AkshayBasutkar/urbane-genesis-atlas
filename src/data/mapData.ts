export type PlaceType = 
  'residential' | 
  'commercial' | 
  'public' | 
  'utility';

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  description: string;
  address: string;
  x: number;
  y: number;
}

export interface Road {
  id: string;
  name: string;
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  width: number;
  cost: number;
}

export interface Lane {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cost: number;
}

export interface Block {
  id: string;
  x: number;
  y: number;
  lanes: Lane[];
}

export interface CityMap {
  name: string;
  width: number;
  height: number;
  blocks: Block[][];
  places: Place[];
  roads: Road[];
}

// Helper function to generate a random number of lanes (2-4) for each block
const generateRandomLanes = (startX: number, startY: number): Lane[] => {
  const laneCount = Math.floor(Math.random() * 3) + 2; // 2-4 lanes
  const lanes: Lane[] = [];
  
  // Create lanes in different directions
  const directions = [
    { dx: 1, dy: 0 }, // right
    { dx: 0, dy: 1 }, // down
    { dx: -1, dy: 0 }, // left
    { dx: 0, dy: -1 }, // up
  ];
  
  // Shuffle directions to randomize which lanes are created
  const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
  
  // Take the first laneCount directions
  for (let i = 0; i < laneCount; i++) {
    if (i < shuffledDirections.length) {
      const { dx, dy } = shuffledDirections[i];
      lanes.push({
        id: `lane-${startX}-${startY}-${i}`,
        startX: startX,
        startY: startY,
        endX: startX + dx,
        endY: startY + dy,
        cost: Math.floor(Math.random() * 9) + 1 // cost between 1-10
      });
    }
  }
  
  return lanes;
};

// Define the grid size constant
const GRID_SIZE = 100; // Changed from 25 to 100

// Create a GRID_SIZE x GRID_SIZE grid of blocks
const createCityGrid = (): Block[][] => {
  const grid: Block[][] = [];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: Block[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        id: `block-${x}-${y}`,
        x: x,
        y: y,
        lanes: generateRandomLanes(x, y)
      });
    }
    grid.push(row);
  }
  
  return grid;
};

// Initial city map data
export const initialCityMap: CityMap = {
  name: "GridCity",
  width: GRID_SIZE,
  height: GRID_SIZE,
  blocks: createCityGrid(),
  places: [
    {
      id: "place-1",
      name: "City Hall",
      type: "public",
      description: "The main administrative building of the city",
      address: "1 Main Street",
      x: 50, // Moved to center of larger grid
      y: 50  // Moved to center of larger grid
    },
    {
      id: "place-2",
      name: "Central Park",
      type: "public",
      description: "A beautiful park in the heart of downtown",
      address: "10 Park Avenue",
      x: 45,
      y: 45
    },
    {
      id: "place-3",
      name: "Downtown Hospital",
      type: "utility",
      description: "The main hospital serving the city center",
      address: "100 Health Road",
      x: 42,
      y: 55
    },
    {
      id: "place-4",
      name: "Sunset Apartments",
      type: "residential",
      description: "A luxury apartment complex",
      address: "25 Sunset Boulevard",
      x: 60,
      y: 40
    },
    {
      id: "place-5",
      name: "Shopping Mall",
      type: "commercial",
      description: "The city's largest shopping center",
      address: "55 Commerce Street",
      x: 70,
      y: 70
    }
  ],
  roads: [],
};
