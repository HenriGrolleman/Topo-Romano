export enum GameMode {
  MENU = 'MENU',
  POINT = 'AANWIJZEN',
  DRAG = 'SLEPEN',
  TYPE = 'INVULLEN',
  CHOICE = 'MEERKEUZE',
  RACE = 'RACE'
}

export enum LocationType {
  CONTINENT = 'continent',
  OCEAN = 'ocean',
  REGION = 'region',
  MOUNTAIN = 'mountain'
}

export interface GeoLocation {
  id: string;      // The unique ID
  label: string;   // The visual label on the map (1, 2, a, b, I, II...)
  name: string;    // The full name (Afrika, Grote Oceaan...)
  x: number;       // Left percentage (0-100)
  y: number;       // Top percentage (0-100)
  type: LocationType;
}

export interface GameState {
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  isFinished: boolean;
  correctAnswers: string[];
  wrongAnswers: string[];
}