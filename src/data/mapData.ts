
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

// Create a 25x25 grid of blocks
const createCityGrid = (): Block[][] => {
  const grid: Block[][] = [];
  
  for (let y = 0; y < 25; y++) {
    const row: Block[] = [];
    for (let x = 0; x < 25; x++) {
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
  width: 25,
  height: 25,
  blocks: createCityGrid(),
  places: [
    {
      id: "place-1",
      name: "City Hall",
      type: "public",
      description: "The main administrative building of the city",
      address: "1 Main Street",
      x: 12,
      y: 12
    },
    {
      id: "place-2",
      name: "Central Park",
      type: "public",
      description: "A beautiful park in the heart of downtown",
      address: "10 Park Avenue",
      x: 10,
      y: 10
    },
    {
      id: "place-3",
      name: "Downtown Hospital",
      type: "utility",
      description: "The main hospital serving the city center",
      address: "100 Health Road",
      x: 8,
      y: 14
    },
    {
      id: "place-4",
      name: "Sunset Apartments",
      type: "residential",
      description: "A luxury apartment complex",
      address: "25 Sunset Boulevard",
      x: 15,
      y: 8
    },
    {
      id: "place-5",
      name: "Shopping Mall",
      type: "commercial",
      description: "The city's largest shopping center",
      address: "55 Commerce Street",
      x: 18,
      y: 18
    }
  ]
};
