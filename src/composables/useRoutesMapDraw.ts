// libraries
import { ref } from 'vue';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';

// types
import type { Coordinate } from 'ol/coordinate';

export const useRoutesMapDraw = () => {
  const drawRoute = ref<Feature>();
  const drawRouteHistory = ref<Coordinate[]>([]);

  /**
   * Updates current route after drawing on the map.
   * Also saves route coordinates into history.
   * @param feature Feature
   * @returns {void}
   */
  const updateDrawRoute = (feature: Feature): void => {
    drawRoute.value = feature;
    saveRouteToHistory(feature);
  };

  /**
   * Saves route coordinates into history. To enable "undo" action.
   * @param route Feature
   * @returns {void}
   */
  const saveRouteToHistory = (route: Feature): void => {
    const geometry = route.getGeometry();
    if (geometry) {
      const coordinates = geometry.getCoordinates();
      if (coordinates) {
        drawRouteHistory.value.push(coordinates);
      }
    }
  };

  /**
   * Returns one-before-last element in history.
   * If there is only one element in history, returns null.
   * @returns {Feature | null}
   */
  const undoDrawRoute = (): Feature | null => {
    if (drawRouteHistory.value.length === 1) {
      return null;
    }
    // remove last history item
    drawRouteHistory.value.pop();
    // get new last history item
    const lastElement =
      drawRouteHistory.value[drawRouteHistory.value.length - 1];
    if (lastElement) {
      // return new feature (LineString)
      const lineString = new LineString(lastElement);
      const feature = new Feature({
        geometry: lineString,
      });
      drawRoute.value = feature;
      return feature;
    }
    return null;
  };

  return {
    drawRoute,
    drawRouteHistory,
    updateDrawRoute,
    undoDrawRoute,
  };
};