// enums
import { TransportDirection } from '../components/types/Route';
import { TripDirection } from '../components/types/Trip';

// types
import type { Trip } from '../components/types/Trip';
import type {
  RouteItem,
  TransportType,
  RouteFeature,
} from '../components/types/Route';

/**
 * Adapter for converting between API and component trip data formats
 */
export const tripsAdapter = {
  /**
   * Convert Trip to RouteItem format
   * @param trip - Trip to convert
   * @returns RouteItem
   */
  toRouteItem(trip: Trip): RouteItem {
    const direction =
      trip.direction === TripDirection.to
        ? TransportDirection.toWork
        : TransportDirection.fromWork;
    const distance = trip.distanceMeters ? trip.distanceMeters.toString() : '0';
    const transport = trip.commuteMode as TransportType;

    return {
      id: trip.id.toString(),
      date: trip.trip_date,
      direction,
      distance,
      transport,
      // TODO: Handle the route feature data
      routeFeature: null as RouteFeature | null,
    };
  },
};
