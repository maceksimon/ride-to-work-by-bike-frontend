import { i18n } from '../boot/i18n';

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
   * @param {Trip} trip - Trip to convert
   * @returns {RouteItem} - Route item
   */
  toRouteItem(trip: Trip): RouteItem {
    const direction =
      trip.direction === TripDirection.to
        ? TransportDirection.toWork
        : TransportDirection.fromWork;
    const distance = (trip: Trip) =>
      i18n.global.n(
        trip.distanceMeters ? trip.distanceMeters / 1000.0 : 0,
        'routeDistanceDecimalNumber',
        'en',
      );
    const transport = trip.commuteMode as TransportType;

    return {
      id: trip.id.toString(),
      date: trip.trip_date,
      direction: direction,
      distance: distance(trip),
      transport,
      // TODO: Handle the route feature data
      routeFeature: null as RouteFeature | null,
    };
  },
};
