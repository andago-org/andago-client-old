export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  coordinate: Coordinate;
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
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}