import { colors } from 'quasar';
import { ref, unref } from 'vue';
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Stroke, Icon } from 'ol/style';
import { getLength } from 'ol/sphere';

// types
import type { Ref } from 'vue';
import type { Feature } from 'ol';
import type { OverrideStyleFunction } from 'vue3-openlayers/dist/components/styles';
import type { FeatureRoute } from '../components/types/Route';

const { getPaletteColor } = colors;
const primaryColor = getPaletteColor('primary');

export const useRoutesMap = () => {
  // list of saved routes
  const savedRoutes = ref<FeatureRoute[]>([]);

  /**
   * Saves a route to the list of saved routes.
   * @param {FeatureRoute} route - The route to be saved.
   * @return {void}
   */
  const saveRoute = (route: FeatureRoute): void => {
    savedRoutes.value.push(route);
  };

  /**
   * Get the length of a route based on the geometry.
   * @param {Feature | Ref<Feature>} route - The LineString route.
   * @return {number} The length of the route.
   */
  const getRouteLength = (route: Feature | Ref<Feature>): number => {
    let length = 0;
    const geom = unref(route).getGeometry();
    if (geom instanceof LineString) {
      length = getLength(geom);
    }
    return length;
  };

  /**
   * Styling for the drawn routes.
   * Uses function override to create styles for LineString vertices.
   * @param feature Feature
   * @returns {Style[]}
   */
  const styleFunction: OverrideStyleFunction = (feature) => {
    const geometry = feature.getGeometry();
    // basic styles for LineString
    const styles = [
      new Style({
        stroke: new Stroke({
          color: primaryColor,
          width: 4,
        }),
      }),
    ];
    if (!geometry) return styles;
    // style for mid-points
    styles.push(
      new Style({
        geometry: new MultiPoint(geometry.getCoordinates()),
        image: new Icon({
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cpath fill='currentColor' d='M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 60a12 12 0 1 1 12-12a12 12 0 0 1-12 12'/%3E%3C/svg%3E",
          anchor: [0.5, 0.5],
        }),
      }),
    );
    // style for starting point
    styles.push(
      new Style({
        geometry: new Point(geometry.getFirstCoordinate()),
        image: new Icon({
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m4.5 7H14v5h-4V9H7.5L12 4.5Z'/%3E%3C/svg%3E",
          anchor: [0.5, 1],
        }),
      }),
    );
    // style for ending point
    styles.push(
      new Style({
        geometry: new Point(geometry.getLastCoordinate()),
        image: new Icon({
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m-4.5 8H10V5h4v5h2.5L12 14.5Z'/%3E%3C/svg%3E",
          anchor: [0.5, 1],
        }),
      }),
    );

    return styles;
  };

  return {
    savedRoutes,
    getRouteLength,
    saveRoute,
    styleFunction,
  };
};
