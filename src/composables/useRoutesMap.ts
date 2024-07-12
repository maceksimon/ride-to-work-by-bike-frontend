// libraries
import { colors } from 'quasar';
import { onMounted, provide, ref, unref } from 'vue';
import { Map } from 'vue3-openlayers';
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Stroke, Icon } from 'ol/style';
import { getLength } from 'ol/sphere';
import { fromLonLat, useGeographic } from 'ol/proj';

// composables
import { i18n } from '../boot/i18n';

// types
import type { Ref } from 'vue';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import type { Feature } from 'ol';
import type { OverrideStyleFunction } from 'vue3-openlayers/dist/components/styles';
import type { FeatureRoute } from '../components/types/Route';

const { getPaletteColor } = colors;
const primaryColor = getPaletteColor('primary');

export const useRoutesMap = () => {
  // provide ol options to child components
  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    debug: !isProduction,
  };
  provide('ol-options', options);

  // constants
  const MAX_ZOOM_CENTERING_FACTOR = 15;
  const DEFAULT_MAP_ZOOM = 13;

  const mapRef = ref<InstanceType<typeof Map.OlMap> | null>(null);
  const center = ref<Coordinate>(fromLonLat([14.4378, 50.0755]));
  const projection = ref('EPSG:3857');
  const zoom = ref(DEFAULT_MAP_ZOOM);

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
   * Centers the map on the given route.
   * @param {FeatureRoute} featureRoute - The route to center the map on.
   * @return {void}
   */
  const centerMapOnRoute = (route: Feature): void => {
    const extent = getRouteExtent(route);
    if (extent) {
      centerMapOnExtent(extent);
    }
  };

  /**
   * Get the extent of a route.
   * If route is not a Feature, returns null.
   * @param {Feature | Ref<Feature>} route - The LineString route.
   * @return {Extent | null} The extent of the route.
   */
  const getRouteExtent = (route: Feature | Ref<Feature>): Extent | null => {
    const geometry = unref(route).getGeometry();
    return geometry ? geometry.getExtent() : null;
  };

  /**
   * Centers the map on the given extent.
   * Takes the MAX_ZOOM_CENTERING_FACTOR into account.
   * @param {Extent} extent - The extent to center the map on.
   * @return {void}
   */
  const centerMapOnExtent = (extent: Extent): void => {
    const map = mapRef.value?.map;
    if (map) {
      const view = map.getView();
      view.fit(extent, {
        size: map.getSize(),
        maxZoom: MAX_ZOOM_CENTERING_FACTOR,
      });
    }
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
    return Math.round(length * 100);
  };

  /**
   * Returns a string representing the length of a route in kilometers.
   * @param {FeatureRoute} featureRoute - The route to calculate the length for.
   * @return {string} A string representing the length of the route in kilometers.
   */
  const getRouteLengthLabel = (featureRoute: FeatureRoute): string => {
    const length = getRouteLength(featureRoute.route);
    return `${length} ${i18n.global.t('global.routeLengthUnit')}`;
  };

  onMounted(() => {
    useGeographic();
  });

  /**
   * Centers the map on the current location if geolocation is supported.
   * If geolocation is not supported, an error message is logged to the console.
   * @return {void}
   */
  const centerOnCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = fromLonLat([
            position.coords.longitude,
            position.coords.latitude,
          ]);
          center.value = coords;
          if (mapRef.value?.map) {
            const view = mapRef.value.map.getView();
            view.setCenter(coords);
            view.setZoom(DEFAULT_MAP_ZOOM);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
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
    mapRef,
    center,
    zoom,
    projection,
    savedRoutes,
    centerMapOnExtent,
    centerMapOnRoute,
    centerOnCurrentLocation,
    getRouteExtent,
    getRouteLength,
    getRouteLengthLabel,
    saveRoute,
    styleFunction,
  };
};
