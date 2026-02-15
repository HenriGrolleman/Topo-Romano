import { GeoLocation, LocationType } from '../types';

export const LOCATIONS: GeoLocation[] = [
  // Cijfers (Werelddelen / Gebieden)
  { id: 'l1', label: '1', name: 'Noord-Amerika', x: 20, y: 30, type: LocationType.CONTINENT },
  { id: 'l2', label: '2', name: 'Europa', x: 53, y: 30, type: LocationType.CONTINENT },
  { id: 'l3', label: '3', name: 'Midden-Amerika', x: 23, y: 48, type: LocationType.REGION },
  { id: 'l4', label: '4', name: 'Midden-Oosten', x: 62, y: 42, type: LocationType.REGION },
  { id: 'l5', label: '5', name: 'Azië', x: 72, y: 35, type: LocationType.CONTINENT },
  { id: 'l6', label: '6', name: 'Zuid-Amerika', x: 32, y: 70, type: LocationType.CONTINENT },
  { id: 'l7', label: '7', name: 'Afrika', x: 53, y: 55, type: LocationType.CONTINENT },
  { id: 'l8', label: '8', name: 'Oceanië', x: 88, y: 75, type: LocationType.CONTINENT },
  { id: 'l9', label: '9', name: 'Antarctica', x: 55, y: 92, type: LocationType.CONTINENT },

  // Romeinse cijfers (Wateren)
  { id: 'lI', label: 'I', name: 'Grote Oceaan', x: 8, y: 55, type: LocationType.OCEAN }, 
  // Note: duplicate visual I exists on right side, handling logically as one entry for simplicity in data,
  // typically generic maps accept left or right click for Pacific. We place it left for now.
  { id: 'lII', label: 'II', name: 'Atlantische Oceaan', x: 38, y: 45, type: LocationType.OCEAN },
  { id: 'lIII', label: 'III', name: 'Indische Oceaan', x: 70, y: 65, type: LocationType.OCEAN },
  { id: 'lIV', label: 'IV', name: 'Noordelijke IJszee', x: 50, y: 8, type: LocationType.OCEAN },

  // Letters (Gebergten / Gebieden)
  { id: 'la', label: 'a', name: 'Rocky Mountains', x: 16, y: 24, type: LocationType.MOUNTAIN },
  { id: 'lb', label: 'b', name: 'Amazone', x: 28, y: 58, type: LocationType.REGION },
  { id: 'lc', label: 'c', name: 'Andes', x: 28, y: 75, type: LocationType.MOUNTAIN },
  { id: 'ld', label: 'd', name: 'Atlas', x: 48, y: 38, type: LocationType.MOUNTAIN },
  { id: 'le', label: 'e', name: 'Sahara', x: 50, y: 45, type: LocationType.REGION },
  { id: 'lf', label: 'f', name: 'Sinaï', x: 57, y: 38, type: LocationType.REGION },
  { id: 'lg', label: 'g', name: 'Himalaya', x: 75, y: 38, type: LocationType.MOUNTAIN },
  { id: 'lh', label: 'h', name: 'Gobi', x: 80, y: 32, type: LocationType.REGION },
  { id: 'li', label: 'i', name: 'Siberië', x: 80, y: 15, type: LocationType.REGION },
];