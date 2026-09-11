export interface VTRZoneCoordinate {
  id: string;
  name: string;
  rangeName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  description: string;
}

export const VTR_WEATHER_ZONES: VTRZoneCoordinate[] = [
  {
    id: 'valmikinagar',
    name: 'Valmiki Nagar Core (Main Gate)',
    rangeName: 'Valmiki Nagar Range',
    latitude: 27.4294,
    longitude: 83.9048,
    elevationMeters: 135,
    description: 'Core ecotourism gate, Gandak River confluence, and historical forest range office.'
  },
  {
    id: 'manguraha',
    name: 'Manguraha Range',
    rangeName: 'Manguraha Forest Division',
    latitude: 27.2790,
    longitude: 84.4420,
    elevationMeters: 110,
    description: 'Dense sal forest range with prominent predator corridors and high herbivore density.'
  },
  {
    id: 'gobardhana',
    name: 'Gobardhana Range',
    rangeName: 'Gobardhana Range',
    latitude: 27.3150,
    longitude: 84.3210,
    elevationMeters: 120,
    description: 'Pristine riparian woodland adjacent to Someshwar Hill foothills.'
  },
  {
    id: 'harnatanr',
    name: 'Harnatanr Range',
    rangeName: 'Harnatanr Forest Range',
    latitude: 27.2180,
    longitude: 84.1480,
    elevationMeters: 98,
    description: 'Southern buffer and grassland fringe with active community anti-poaching squads.'
  }
];
