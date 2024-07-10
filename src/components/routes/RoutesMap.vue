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
import { defineComponent, ref } from 'vue';
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
import { getLength } from 'ol/sphere';

// composables
import { useRoutesMap } from '../../composables/useRoutesMap';
import { useRoutesMapDraw } from '../../composables/useRoutesMapDraw';
import { useRoutesMapVectorLayer } from '../../composables/useRoutesMapVectorLayer';
import { useGeocoding } from '../../composables/useGeocoding';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { DrawEvent } from 'ol/interaction/Draw';
import type { ModifyEvent } from 'ol/interaction/Modify';

export interface FeatureRoute {
  endName: string;
  length: number;
  route: Feature;
  startName: string;
}

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

    // styles
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const { getPaletteColor } = colors;
    const colorWhite = getPaletteColor('white');

    // animation
    const drawEnabled = ref<boolean>(false);
    const deleteEnabled = ref<boolean>(false);
    const animationPath = ref<string[][] | null>(null);
    const savedRoutes = ref<FeatureRoute[]>([]);

    const vectorLayer = ref<InstanceType<typeof Layers.OlVectorLayer> | null>(
      null,
    );
    const { addMapRoute, clearMapRoutes, renderSavedRoute } =
      useRoutesMapVectorLayer(vectorLayer);

    const { drawRoute, updateDrawRoute, undoDrawRoute } = useRoutesMapDraw();

    const { styleFunction } = useRoutesMap();

    const { getRouteNames } = useGeocoding();

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
     * @returns {void}
     */
    const onDrawEnd = (event: DrawEvent): void => {
      const feature = event.feature;
      updateDrawRoute(feature);
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

    const onSaveRoute = async (): Promise<void> => {
      if (drawRoute.value) {
        // add route name
        const { startName, endName } = await getRouteNames(drawRoute.value);
        // get route length
        let length = 0;
        const geom = drawRoute.value.getGeometry();
        if (geom instanceof LineString) {
          length = getLength(geom);
        }
        // save route
        savedRoutes.value.push({
          endName,
          length,
          route: drawRoute.value,
          startName,
        } as FeatureRoute);
      }
    };

    const onSavedRouteClick = (featureRoute: FeatureRoute): void => {
      renderSavedRoute(featureRoute.route);
    };

    return {
      animationPath,
      borderRadius,
      center,
      colorWhite,
      deleteEnabled,
      drawEnabled,
      mapHeight,
      projection,
      rotation,
      savedRoutes,
      vectorLayer,
      zoom,
      addMapRoute,
      onDrawStart,
      onDrawEnd,
      onModifyEnd,
      onSaveRoute,
      onSavedRouteClick,
      onUndo,
      renderSavedRoute,
      styleFunction,
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
              v-for="(route, index) in savedRoutes"
              :key="`route-${index}`"
              @click="onSavedRouteClick(route)"
            >
              <q-item-section v-if="route['startName'] && route['endName']">
                <div>{{ `${route['startName']} → ${route['endName']}` }}</div>
                <div v-if="route['length']">
                  <small
                    >{{ route['length'] }}
                    {{ $t('global.routeLengthUnit') }}</small
                  >
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Column: Map -->
      <div class="relative-position col-12 col-sm-10">
        <!-- Toolbar -->
        <div
          class="flex justify-center absolute-top q-pa-sm"
          style="z-index: 1"
        >
          <q-toolbar
            class="col-auto gap-8 q-pa-sm"
            :style="{ borderRadius: '9999px', backgroundColor: colorWhite }"
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
                :color="drawEnabled ? 'primary' : 'grey-3'"
              >
                <q-icon
                  name="mdi-pencil-plus"
                  :color="drawEnabled ? 'white' : 'primary'"
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
                :color="deleteEnabled ? 'primary' : 'grey-3'"
              >
                <q-icon
                  name="mdi-pencil-remove"
                  :color="deleteEnabled ? 'white' : 'primary'"
                  size="18px"
                  data-cy="icon-remove-point"
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
              <q-avatar size="32px" class="q-pa-none q-ma-none" color="grey-3">
                <q-icon
                  name="mdi-undo"
                  color="primary"
                  size="18px"
                  data-cy="icon-undo"
                />
              </q-avatar>
            </q-btn>
            <!-- Button: Save route -->
            <q-btn
              dense
              round
              unelevated
              class="q-pa-none q-ma-none"
              color="transparent"
              text-color="primary"
              @click.prevent="onSaveRoute"
            >
              <q-avatar size="32px" class="q-pa-none q-ma-none" color="grey-3">
                <q-icon
                  name="mdi-check"
                  color="primary"
                  size="18px"
                  data-cy="icon-save-route"
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
        </ol-map>
      </div>
    </div>
  </div>
</template>
