// enums
import { TransportType } from './Route';

export enum TripDirection {
  to = 'trip_to',
  from = 'trip_from',
}

export enum TripSourceApplication {
  app = 'app',
  strava = 'strava',
  garmin = 'garmin',
  fitbit = 'fitbit',
}

export interface Trip {
  id: number;
  trip_date: string;
  direction: TripDirection;
  commuteMode: TransportType;
  sourceApplication: TripSourceApplication;
  distanceMeters: number | null;
  durationSeconds: number | null;
  sourceId: string | null;
  file: string | null;
  description: string;
  track: string | null;
}

export interface GetTripsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Trip[];
}
