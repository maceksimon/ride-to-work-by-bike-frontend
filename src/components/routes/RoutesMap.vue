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
import { defineComponent, ref } from 'vue';
import { Map, Layers, Sources, Interactions, Styles } from 'vue3-openlayers';
import Feature from 'ol/Feature';

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
  },
  setup() {
    const center = ref([14.4378, 50.0755]);
    const projection = ref('EPSG:4326');
    const zoom = ref(12);
    const rotation = ref(0);
    const mapHeight = ref<string>('600px');

    const drawEnable = ref<boolean>(true);
    const animationPath = ref<string[][] | null>(null);
    const drawnRoutes = ref<(typeof Feature)[]>([]);
    const vectorLayer = ref<InstanceType<typeof Layers.OlVectorLayer> | null>(
      null,
    );

    /**
     * Called when a new path is being drawn on the map.
     */
    const drawstart = (): void => {
      clearMapRoutes();
    };

    /**
     * Called after a new path is drawn on the map.
     * @param event
     */
    const drawend = async (event): Promise<void> => {
      const feature = event.feature;
      await fetchPathName(feature);
      drawnRoutes.value.push(feature);
    };

    /**
     * For a given feature (LineString drawn on the map), fetches the
     * name of the start and end point.
     * @param feature Feature
     */
    const fetchPathName = async (feature) => {
      // get coordinates from pathFeature
      const coordinates = feature.getGeometry()?.getCoordinates();
      const startCoordinates = coordinates[0];
      const endCoordinates = coordinates[coordinates.length - 1];
      // assign names
      feature['startName'] = await getLocationName(startCoordinates);
      feature['endName'] = await getLocationName(endCoordinates);
    };

    /**
     * Calls the OpenStreetMap API and returns the name of the location
     * given its coordinates.
     * @param coord number[]
     */
    const getLocationName = async (coord: number[]) => {
      const [lon, lat] = coord;
      // TODO: update fetch method (if we will use it)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`,
      );
      const data = await response.json();
      const locationName = data.address.road;
      return locationName;
    };

    /**
     * Renders selected route on the map.
     * First clears all previously drawn routes from the map.
     * @param pathFeature Feature
     */
    const onRenderRoute = (route) => {
      clearMapRoutes();
      addMapRoute(route);
    };

    /**
     * Clears the drawn routes from the map.
     * @returns {void}
     */
    const clearMapRoutes = (): void => {
      const source = vectorLayer.value?.vectorLayer.getSource();
      source && source.clear();
    };

    /**
     * Adds the drawn route on the map.
     * @param pathFeature Feature
     */
    const addMapRoute = (pathFeature) => {
      const source = vectorLayer.value?.vectorLayer.getSource();
      source && source.addFeature(pathFeature);
    };

    return {
      animationPath,
      center,
      drawEnable,
      drawnRoutes,
      mapHeight,
      projection,
      rotation,
      vectorLayer,
      zoom,
      addMapRoute,
      drawstart,
      drawend,
      onRenderRoute,
    };
  },
});
</script>

<template>
  <div
    class="row q-my-lg"
    data-cy="routes-map"
    :style="{
      borderRadius: '16px',
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
            v-for="(route, index) in drawnRoutes"
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
    <div class="col-12 col-sm-10">
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
        <!-- Layer for the drawn routes -->
        <ol-vector-layer ref="vectorLayer" title="routes">
          <ol-source-vector ref="vectorSource">
            <!-- Interaction modify handler -->
            <ol-interaction-modify v-if="drawEnable"> </ol-interaction-modify>
            <!-- Interaction draw handler -->
            <ol-interaction-draw
              v-if="drawEnable"
              type="LineString"
              @drawstart="drawstart"
              @drawend="drawend"
            >
            </ol-interaction-draw>
            <!-- Styling for the drawn routes -->
            <ol-style>
              <ol-style-stroke color="blue" :width="4"></ol-style-stroke>
            </ol-style>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
    </div>
  </div>
</template>
