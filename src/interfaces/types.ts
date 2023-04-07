export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
}

export interface TripQuery {
  origin: string;
  destination: string;
}

export interface TripDetails {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  fare: string;
}