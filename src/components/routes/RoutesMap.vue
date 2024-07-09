<script lang="ts">
/**
 * RoutesMap Component
 *
 * @description * Use this component to render a map that allows to log and
 * view user's routes.
 *
 * Uses Vue 3 OpenLayers library to render the map.
 *
 * @see https://vue3openlayers.netlify.app/
 *
 * @example
 * <routes-map />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104125&t=WHwfwyUaREf6VA9M-1)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent, ref } from 'vue';
import {
  Map,
  MapControls,
  Layers,
  Sources,
  Interactions,
  Styles,
} from 'vue3-openlayers';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';

// composables
import { useRoutesMap } from '../../composables/useRoutesMap';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { Coordinate } from 'ol/coordinate';
import type { DrawEvent } from 'ol/interaction/Draw';

export default defineComponent({
  name: 'RoutesMap',
  components: {
    OlMap: Map.OlMap,
    OlView: Map.OlView,
    OlTileLayer: Layers.OlTileLayer,
    OlVectorLayer: Layers.OlVectorLayer,
    OlSourceOsm: Sources.OlSourceOsm,
    OlSourceVector: Sources.OlSourceVector,
    OlStyle: Styles.OlStyle,
    OlStyleStroke: Styles.OlStyleStroke,
    OlInteractionModify: Interactions.OlInteractionModify,
    OlInteractionDraw: Interactions.OlInteractionDraw,
    OlInteractionSnap: Interactions.OlInteractionSnap,
    OlZoomControl: MapControls.OlZoomControl,
    OlZoomsliderControl: MapControls.OlZoomsliderControl,
  },
  setup() {
    const center = ref([14.4378, 50.0755]);
    const projection = ref('EPSG:4326');
    const zoom = ref(12);
    const rotation = ref(0);
    const mapHeight = ref<string>('600px');

    // animation
    const drawEnabled = ref<boolean>(false);
    const deleteEnabled = ref<boolean>(false);
    const animationPath = ref<string[][] | null>(null);
    const loggedRoutes = ref<Feature[]>([]);
    const drawRoute = ref<Feature>();
    const drawRoutePoints = computed((): Coordinate[] => {
      return drawRoute.value?.getGeometry()?.getCoordinates() || [];
    });
    const vectorLayer = ref<InstanceType<typeof Layers.OlVectorLayer> | null>(
      null,
    );
    const pointsLayer = ref<InstanceType<typeof Layers.OlVectorLayer> | null>(
      null,
    );
    const drawRouteHistory = ref<Coordinate[]>([]);

    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const { getPaletteColor, lighten } = colors;
    const primaryColor = lighten(getPaletteColor('primary'), 0);

    /**
     * Called when a new path is being drawn on the map.
     * @returns {void}
     */
    const onDrawStart = (): void => {
      clearMapRoutes();
    };

    /**
     * Called after a new path is drawn on the map.
     * @param event DrawEvent
     */
    const onDrawEnd = async (event: DrawEvent): Promise<void> => {
      // await fetchPathName(feature);
      const featureLineString = event.feature;
      drawRoute.value = featureLineString;
      drawRoute.value &&
        drawRouteHistory.value.push(
          drawRoute.value.getGeometry().getCoordinates(),
        );
    };

    const onModifyEnd = (event: DrawEvent): void => {
      const feature = event.features.getArray()[0];
      const newGeometry = feature.getGeometry()?.getCoordinates();
      drawRoute.value &&
        drawRoute.value.getGeometry().setCoordinates(newGeometry);
      drawRoute.value &&
        drawRouteHistory.value.push(
          drawRoute.value.getGeometry().getCoordinates(),
        );
    };

    /**
     * Undo last route modification.
     * @returns {void}
     */
    const onUndo = (): void => {
      if (drawRouteHistory.value.length === 1) return;
      drawRouteHistory.value.pop();
      const lastElement =
        drawRouteHistory.value[drawRouteHistory.value.length - 1];
      const lineString = new LineString(lastElement);
      const newFeature = new Feature({
        geometry: lineString,
      });
      clearMapRoutes();
      addMapRoute(newFeature);
    };

    /**
     * Renders selected route on the map.
     * First clears all previously drawn routes from the map.
     * @param feature Feature
     */
    const onRenderRoute = (feature: typeof Feature): void => {
      clearMapRoutes();
      addMapRoute(feature);
    };

    /**
     * Clears all drawn routes from the map.
     * @returns {void}
     */
    const clearMapRoutes = (): void => {
      const source = vectorLayer.value?.vectorLayer.getSource();
      source && source.clear();
      const pointsSource = pointsLayer.value?.vectorLayer.getSource();
      pointsSource && pointsSource.clear();
    };

    /**
     * Adds the drawn route on the map.
     * @param pathFeature Feature
     * @returns {void}
     */
    const addMapRoute = (pathFeature: typeof Feature): void => {
      const source = vectorLayer.value?.vectorLayer.getSource();
      source && source.addFeature(pathFeature);
    };

    const { styleFunction } = useRoutesMap();

    return {
      animationPath,
      borderRadius,
      center,
      drawEnabled,
      deleteEnabled,
      drawRoute,
      drawRoutePoints,
      loggedRoutes,
      mapHeight,
      projection,
      primaryColor,
      rotation,
      styleFunction,
      vectorLayer,
      pointsLayer,
      zoom,
      addMapRoute,
      onDrawStart,
      onDrawEnd,
      onRenderRoute,
      onModifyEnd,

      onUndo,
      drawRouteHistory,
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
      <div class="col-12 col-sm-2">
        <q-scroll-area :style="{ height: mapHeight }">
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
              v-for="(route, index) in loggedRoutes"
              :key="`route-${index}`"
              @click="onRenderRoute(route)"
            >
              <q-item-section v-if="route['startName'] && route['endName']">
                {{ `${route['startName']} → ${route['endName']}` }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
      <div class="relative-position col-12 col-sm-10">
        <!-- Tools -->
        <div
          class="flex justify-center absolute-top q-pa-sm"
          style="z-index: 1"
        >
          <q-toolbar
            class="col-auto gap-8 q-pa-sm"
            :style="{ borderRadius: '9999px', backgroundColor: primaryColor }"
          >
            <!-- Button: Enable draw (draw route) -->
            <q-btn
              dense
              round
              unelevated
              class="q-pa-none q-ma-none"
              color="transparent"
              text-color="primary"
              @click.prevent="drawEnabled = !drawEnabled"
            >
              <q-avatar
                size="32px"
                class="q-pa-none q-ma-none"
                :color="drawEnabled ? 'secondary' : 'white'"
              >
                <q-icon
                  name="mdi-pencil-plus"
                  color="primary"
                  size="18px"
                  data-cy="icon-add-route"
                />
              </q-avatar>
            </q-btn>
            <!-- Button: Enable delete (delete point/vertex) -->
            <q-btn
              dense
              round
              unelevated
              class="q-pa-none q-ma-none"
              color="transparent"
              text-color="primary"
              @click.prevent="deleteEnabled = !deleteEnabled"
            >
              <q-avatar
                size="32px"
                class="q-pa-none q-ma-none"
                :color="deleteEnabled ? 'secondary' : 'white'"
              >
                <q-icon
                  name="mdi-pencil-remove"
                  color="primary"
                  size="18px"
                  data-cy="icon-add-route"
                />
              </q-avatar>
            </q-btn>
            <!-- Button: Undo -->
            <q-btn
              dense
              round
              unelevated
              class="q-pa-none q-ma-none"
              color="transparent"
              text-color="primary"
              @click.prevent="onUndo"
            >
              <q-avatar size="32px" class="q-pa-none q-ma-none" color="white">
                <q-icon
                  name="mdi-undo"
                  color="primary"
                  size="18px"
                  data-cy="icon-add-route"
                />
              </q-avatar>
            </q-btn>
          </q-toolbar>
        </div>
        <!-- Map -->
        <ol-map
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          :style="{ height: mapHeight }"
        >
          <!-- View -->
          <ol-view
            ref="view"
            :center="center"
            :rotation="rotation"
            :zoom="zoom"
            :projection="projection"
          />
          <!-- Layer for OpenStreetMap tiles -->
          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>
          <!-- Controls -->
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
              <ol-style :override-style-function="styleFunction">
                <!-- LineString style -->
                <ol-style-stroke color="blue" :width="4"></ol-style-stroke>
              </ol-style>
            </ol-source-vector>
          </ol-vector-layer>
        </ol-map>
      </div>
    </div>
  </div>
</template>
