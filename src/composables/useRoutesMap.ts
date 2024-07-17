// libraries
import { colors, Notify } from 'quasar';
import { onMounted, provide, ref, unref } from 'vue';
import { Map } from 'vue3-openlayers';
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Stroke, Icon } from 'ol/style';
import { getLength } from 'ol/sphere';
import { fromLonLat, useGeographic } from 'ol/proj';

// composables
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Ref } from 'vue';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import type { Feature } from 'ol';
import type { OverrideStyleFunction } from 'vue3-openlayers/dist/components/styles';
import type { FeatureRoute } from '../components/types/Route';
import type { FeatureLike } from 'ol/Feature';

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
  const maxZoomCenteringFactor = 15;
  const defaultMapZoom = Number(rideToWorkByBikeConfig.mapZoom);
  const defaultMapProjection = rideToWorkByBikeConfig.mapProjection;
  const defaultMapLon = Number(rideToWorkByBikeConfig.mapCenterLon);
  const defaultMapLat = Number(rideToWorkByBikeConfig.mapCenterLat);

  const mapRef = ref<InstanceType<typeof Map.OlMap> | null>(null);
  const center = ref<Coordinate>(fromLonLat([defaultMapLon, defaultMapLat]));
  const projection = ref(defaultMapProjection);
  const zoom = ref(defaultMapZoom);
  const customSVGIconsFilePath = 'icons/routes_map';

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
   * Takes the maxZoomCenteringFactor into account.
   * @param {Extent} extent - The extent to center the map on.
   * @return {void}
   */
  const centerMapOnExtent = (extent: Extent): void => {
    const map = mapRef.value?.map;
    if (map) {
      const view = map.getView();
      view.fit(extent, {
        size: map.getSize(),
        maxZoom: maxZoomCenteringFactor,
      });
    }
  };

  /**
   * Get the length of a route based on the geometry.
   * @param {Feature | Ref<Feature>} route - The LineString route.
   * @return {number} The length of the route.
   */
  const getRouteLength = (route: Feature | Ref<Feature>): number => {
    const geom = unref(route).getGeometry();
    if (geom instanceof LineString) {
      return getLength(geom);
    }
    return 0;
  };

  /**
   * Get length of route in kilometers.
   * @param {FeatureRoute} featureRoute - The route to calculate the length for.
   * @return {string} Length of the route in kilometers.
   */
  const getRouteLengthLabel = (featureRoute: FeatureRoute): string => {
    const length = getRouteLength(featureRoute.route);
    return formatLength(length);
  };

  /**
   * Formats the length value to a rounded string with the global route length unit.
   * @param {number} length - The length value to format.
   * @return {string} The formatted length string.
   */
  const formatLength = (length: number) => {
    const lengthRoudned = Math.round(length * 100);
    return `${lengthRoudned} ${i18n.global.t('global.routeLengthUnit')}`;
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
            view.setZoom(defaultMapZoom);
          }
        },
        (error) => {
          Notify.create({
            type: 'negative',
            message: i18n.global.t('notify.geolocationError', { error: error }),
          });
        },
      );
    } else {
      Notify.create({
        type: 'negative',
        message: i18n.global.t('notify.geolocationNotSupported'),
      });
    }
  };

  /**
   * Styling for the drawn routes.
   * Uses function override to create styles for LineString vertices.
   * @param feature FeatureLike
   * @return {Style[]}
   */
  const styleFunction: OverrideStyleFunction = (feature: FeatureLike) => {
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
    if (geometry instanceof LineString) {
      styles.push(
        new Style({
          geometry: new MultiPoint(geometry.getCoordinates()),
          image: new Icon({
            src: `${customSVGIconsFilePath}/route-dot.svg`,
            anchor: [0.5, 0.5],
          }),
        }),
      );
      // style for starting point
      styles.push(
        new Style({
          geometry: new Point(geometry.getFirstCoordinate()),
          image: new Icon({
            src: `${customSVGIconsFilePath}/route-start.svg`,
            anchor: [0.5, 1],
          }),
        }),
      );
      // style for ending point
      styles.push(
        new Style({
          geometry: new Point(geometry.getLastCoordinate()),
          image: new Icon({
            src: `${customSVGIconsFilePath}/route-end.svg`,
            anchor: [0.5, 1],
          }),
        }),
      );
    }

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
    formatLength,
    getRouteExtent,
    getRouteLength,
    getRouteLengthLabel,
    saveRoute,
    styleFunction,
  };
};
