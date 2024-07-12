<script lang="ts">
/**
 * RoutesMap Component
 *
 * @description * Use this component to render a map that allows to log and
 * view user's routes.
 *
 * Uses Vue 3 OpenLayers library to render the map.
 * @see https://vue3openlayers.netlify.app/
 *
 * @example
 * <routes-map />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104125&t=WHwfwyUaREf6VA9M-1)
 */

// libraries
import { colors, Screen } from 'quasar';
import { computed, defineComponent, ref } from 'vue';
import {
  Map,
  MapControls,
  Layers,
  Sources,
  Interactions,
  Styles,
} from 'vue3-openlayers';

// components
import RoutesMapToolbar from './RoutesMapToolbar.vue';

// composables
import { useGeocoding } from '../../composables/useGeocoding';
import { useRoutesMap } from '../../composables/useRoutesMap';
import { useRoutesMapDraw } from '../../composables/useRoutesMapDraw';
import { useRoutesMapTooltip } from '../../composables/useRoutesMapTooltip';
import { useRoutesMapVectorLayer } from '../../composables/useRoutesMapVectorLayer';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { DrawEvent } from 'ol/interaction/Draw';
import type { ModifyEvent } from 'ol/interaction/Modify';
import type { FeatureRoute } from '../types/Route';

export default defineComponent({
  name: 'RoutesMap',
  components: {
    OlMap: Map.OlMap,
    OlView: Map.OlView,
    OlOverlay: Map.OlOverlay,
    OlTileLayer: Layers.OlTileLayer,
    OlVectorLayer: Layers.OlVectorLayer,
    OlSourceOsm: Sources.OlSourceOsm,
    OlSourceVector: Sources.OlSourceVector,
    OlStyle: Styles.OlStyle,
    OlInteractionModify: Interactions.OlInteractionModify,
    OlInteractionDraw: Interactions.OlInteractionDraw,
    OlInteractionSnap: Interactions.OlInteractionSnap,
    OlZoomControl: MapControls.OlZoomControl,
    OlZoomsliderControl: MapControls.OlZoomsliderControl,
    RoutesMapToolbar,
  },
  setup() {
    // map
    const {
      mapRef,
      center,
      zoom,
      projection,
      savedRoutes,
      centerMapOnRoute,
      centerOnCurrentLocation,
      getRouteLength,
      getRouteLengthLabel,
      saveRoute,
      styleFunction,
    } = useRoutesMap();

    // styles
    const listHeight = computed((): string => {
      if (Screen.gt.sm) {
        return '600px';
      }
      return 'auto';
    });
    const mapHeight = '600px';
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const { getPaletteColor } = colors;
    const colorWhite = getPaletteColor('white');

    // animation
    const drawEnabled = ref<boolean>(false);
    const deleteEnabled = ref<boolean>(false);
    const animationPath = ref<string[][] | null>(null);

    // geocoding
    const { getRouteNames } = useGeocoding();
    // draw
    const { drawRoute, updateDrawRoute, undoDrawRoute } = useRoutesMapDraw();
    // tooltip
    const { tooltipCoord, tooltipText, onDrawStartLength, onDrawEndLength } =
      useRoutesMapTooltip();
    // vector layer
    const vectorLayer = ref<InstanceType<typeof Layers.OlVectorLayer> | null>(
      null,
    );
    const { addMapRoute, clearMapRoutes, renderSavedRoute } =
      useRoutesMapVectorLayer(vectorLayer);

    /**
     * Called when a new path is being drawn on the map.
     * @returns {void}
     */
    const onDrawStart = (event: DrawEvent): void => {
      clearMapRoutes();
      onDrawStartLength(event);
    };

    /**
     * Called after a new path is drawn on the map.
     * @param event DrawEvent
     * @returns {void}
     */
    const onDrawEnd = (event: DrawEvent): void => {
      const feature = event.feature;
      updateDrawRoute(feature);
      onDrawEndLength();
    };

    /**
     * Called after a path is modified on the map.
     * @param event ModifyEvent
     * @returns {void}
     */
    const onModifyEnd = (event: ModifyEvent): void => {
      // get first feature (there should always be only one)
      const feature = event.features.getArray()[0];
      updateDrawRoute(feature);
    };

    /**
     * Toggles the draw mode.
     */
    const toggleDrawEnabled = (): void => {
      drawEnabled.value = !drawEnabled.value;
      clearMapRoutes();
    };

    /**
     * If possible, undo last route modification and update route on the map.
     * If there are no changes in history, do nothing.
     * @returns {void}
     */
    const onUndo = (): void => {
      const newFeature = undoDrawRoute();
      if (newFeature) {
        // update map
        clearMapRoutes();
        addMapRoute(newFeature);
      }
    };

    /**
     * Save drawRoute to local array of routes.
     * Before saving, get start and end names of the route.
     * @returns {Promise<void>}
     */
    const onSaveRoute = async (): Promise<void> => {
      if (drawRoute.value) {
        const { startName, endName } = await getRouteNames(drawRoute.value);
        const length = getRouteLength(drawRoute.value);
        const featureRoute: FeatureRoute = {
          endName,
          length,
          route: drawRoute.value,
          startName,
        };
        saveRoute(featureRoute);
        // disable drawing
        drawEnabled.value = false;
      }
    };

    /**
     * Called when a saved routes list item is clicked.
     * Renders clicked route on the map.
     * @param featureRoute FeatureRoute
     * @returns {void}
     */
    const onSavedRouteClick = (featureRoute: FeatureRoute): void => {
      renderSavedRoute(featureRoute.route);
      centerMapOnRoute(featureRoute.route);
    };

    return {
      animationPath,
      borderRadius,
      center,
      colorWhite,
      deleteEnabled,
      drawEnabled,
      listHeight,
      mapHeight,
      mapRef,
      projection,
      savedRoutes,
      vectorLayer,
      zoom,

      tooltipCoord,
      tooltipText,

      addMapRoute,
      centerOnCurrentLocation,
      getRouteLengthLabel,
      onDrawStart,
      onDrawEnd,
      onModifyEnd,
      onSaveRoute,
      onSavedRouteClick,
      onUndo,
      renderSavedRoute,
      styleFunction,
      toggleDrawEnabled,
    };
  },
});
</script>

<template>
  <div>
    <!-- Container: Map -->
    <div
      class="row q-my-lg"
      data-cy="routes-map"
      :style="{
        borderRadius,
        overflow: 'hidden',
        border: '1px solid #E0E0E0',
      }"
    >
      <!-- Column: Drawn routes -->
      <div class="col-12 col-sm-2">
        <q-scroll-area :style="{ height: listHeight }">
          <!-- List: Drawn routes -->
          <q-list separator>
            <!-- List header -->
            <q-item class="bg-primary text-white text-weight-bold text-center">
              <q-item-section class="text-subtitle2 text-uppercase"
                >Vaše trasy</q-item-section
              >
            </q-item>
            <!-- Item: Drawn route -->
            <q-item
              clickable
              v-ripple
              v-for="(route, index) in savedRoutes"
              :key="`route-${index}`"
              @click="onSavedRouteClick(route)"
            >
              <q-item-section v-if="route['startName'] && route['endName']">
                <div>{{ `${route['startName']} → ${route['endName']}` }}</div>
                <div v-if="route['length']">
                  <small>
                    {{ getRouteLengthLabel(route) }}
                  </small>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Column: Map -->
      <div class="relative-position col-12 col-sm-10">
        <!-- Toolbar: Top -->
        <routes-map-toolbar
          :delete-enabled="deleteEnabled"
          :draw-enabled="drawEnabled"
          @current-position="centerOnCurrentLocation"
          @save:route="onSaveRoute"
          @update:delete-enabled="deleteEnabled = $event"
          @update:draw-enabled="drawEnabled = $event"
          @undo="onUndo"
          data-cy="routes-map-toolbar"
        />
        <!-- Map -->
        <ol-map
          ref="mapRef"
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          :style="{ height: mapHeight }"
          data-cy="routes-map-map"
        >
          <!-- View -->
          <ol-view
            ref="view"
            :center="center"
            :zoom="zoom"
            :projection="projection"
          />
          <!-- Layer for OpenStreetMap tiles -->
          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>
          <!-- Zoom controls -->
          <ol-zoom-control zoomInLabel="➕" zoomOutLabel="➖" />
          <ol-zoomslider-control />
          <!-- Layer for the drawn routes -->
          <ol-vector-layer ref="vectorLayer" title="routes">
            <ol-source-vector ref="vectorSource">
              <!-- Interaction modify handler -->
              <ol-interaction-modify
                v-if="drawEnabled"
                :delete-condition="() => deleteEnabled"
                @modifyend="onModifyEnd"
              />
              <!-- Interaction delete handler -->
              <ol-interaction-modify
                v-if="deleteEnabled"
                :delete-condition="() => true"
                @modifyend="onModifyEnd"
              />
              <!-- Interaction draw handler -->
              <ol-interaction-draw
                v-if="drawEnabled"
                type="LineString"
                @drawstart="onDrawStart"
                @drawend="onDrawEnd"
              />
              <!-- Interaction snap handler -->
              <ol-interaction-snap v-if="drawEnabled" />
              <!-- Style -->
              <ol-style :override-style-function="styleFunction" />
            </ol-source-vector>
          </ol-vector-layer>

          <!-- Tooltip on draw -->
          <ol-overlay
            v-if="tooltipCoord"
            :position="tooltipCoord"
            :offset="[0, -15]"
            positioning="bottom-center"
            :stopEvent="false"
            :insertFirst="false"
          >
            <div class="tooltip tooltip-measure">
              {{ tooltipText }}
            </div>
          </ol-overlay>
        </ol-map>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}
.tooltip-measure {
  font-weight: bold;
}
.tooltip-measure:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
</style>
