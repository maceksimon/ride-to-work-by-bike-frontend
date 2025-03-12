// types
import type { TimestampOrNull } from '@quasar/quasar-ui-qcalendar';
import type { Feature } from 'ol';

export enum TransportDirection {
  toWork = 'trip_to',
  fromWork = 'trip_from',
  recreational = 'recreational',
}

export enum TransportType {
  bike = 'bicycle',
  walk = 'by_foot',
  car = 'by_other_vehicle',
  none = 'no_work',
  bus = 'hromadna',
  home = 'telecommute',
}

export enum RouteTab {
  calendar = 'calendar',
  list = 'list',
  map = 'map',
  app = 'app',
}

export type RouteItem = {
  id: string;
  date: string;
  direction: TransportDirection;
  dirty?: boolean;
  distance: string;
  transport: TransportType;
  inputType?: RouteInputType;
  routeFeature: RouteFeature | null;
};

export type RouteInputType = 'input-number' | 'input-map';

export type RouteDay = {
  id: string;
  date: string;
  [TransportDirection.toWork]: RouteItem;
  [TransportDirection.fromWork]: RouteItem;
};

export type RouteCalendarActive = {
  timestamp: TimestampOrNull;
  direction: TransportDirection;
};

export type RouteLogData = {
  action: RouteInputType;
  distance: string;
  transportType: TransportType;
};

export interface RouteFeature {
  endName: string;
  length: number;
  feature: Feature | null;
  startName: string;
}
