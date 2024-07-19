// libraries
import { ref } from 'vue';
import { LineString } from 'ol/geom';

// types
import type { Feature } from 'ol';
import type { RouteItem } from '../components/types/Route';

export const useRoutesMapStorage = () => {
  // list of saved routes
  const savedRoutes = ref<RouteItem[]>([]);

  /**
   * Compares two features' geometries.
   * @param {Feature} feature1 - The first feature.
   * @param {Feature} feature2 - The second feature.
   * @return {boolean} Returns true if the geometries are equal.
   */
  const compareFeatures = (feature1: Feature, feature2: Feature): boolean => {
    const geom1 = feature1.getGeometry();
    const geom2 = feature2.getGeometry();
    if (!(geom1 instanceof LineString && geom2 instanceof LineString)) {
      return false;
    }
    const coords1 = geom1?.getCoordinates();
    const coords2 = geom2?.getCoordinates();
    return JSON.stringify(coords1) === JSON.stringify(coords2);
  };

  // function groupRouteItemsByFeature(routeItems: RouteItem[]): Map<RouteFeature, RouteItem[]> {
  //   const groups = new Map<RouteFeature, RouteItem[]>();

  //   routeItems.forEach((item) => {
  //     let foundGroup = false;

  //     for (const [feature, group] of groups) {
  //       if (
  //         item.routeFeature !== null &&
  //         item.routeFeature.feature !== null &&
  //         feature.feature !== null &&
  //         compareFeatures(item.routeFeature.feature, feature.feature)
  //       ) {
  //         group.push(item);
  //         foundGroup = true;
  //         break;
  //       }
  //     }

  //     if (!foundGroup) {
  //       if (item.routeFeature !== null) {
  //         groups.set(item.routeFeature, [item]);
  //       }
  //     }
  //   });

  //   return groups;
  // }

  // const savedRoutesGrouped = computed((): Map<RouteFeature, RouteItem[]> => {
  //   return groupRouteItemsByFeature(savedRoutes.value as RouteItem[]);
  // });

  /**
   * Saves a route to the list of saved routes.
   * @param {RouteItem[]} routes - The route to be saved.
   * @return {void}
   */
  const saveRoutes = (routes: RouteItem[]): void => {
    routes.forEach((route) => {
      savedRoutes.value.push(route);
    });
  };

  return {
    savedRoutes,
    saveRoutes,
    compareFeatures,
  };
};
