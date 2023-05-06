export interface Place {
  place_id: string;
  name: string;
  address: string;
  coordinate: Coordinate;
}

export interface Vehicle {
  id: number,
  name: string,
  selected: boolean,
  controlMode: ControlMode,
}

export interface TripRequest {
  origin: Place;
  destination: Place;
}

export interface TripDetails {
  pickUp: Place;
  dropOff: Place;
  distance: string;
  duration: string;
  fare: string;
  balance: string;
  result: string;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export enum ControlMode {
  View = 'view',
  Create = 'create',
  Edit = 'edit',
}