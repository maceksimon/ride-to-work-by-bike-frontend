<script lang="ts">
/**
 * RoutesMap Component
 *
 * @description * Use this component to ... .
 * You can adjust its appearance by ... .
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <routes-map />
 *
 * @see [Figma Design](...)
 */

// libraries
import { defineComponent, ref } from 'vue';
import { Map, Layers, Sources } from 'vue3-openlayers';

export default defineComponent({
  name: 'RoutesMap',
  components: {
    OlMap: Map.OlMap,
    OlView: Map.OlView,
    OlTileLayer: Layers.OlTileLayer,
    OlSourceOsm: Sources.OlSourceOsm,
  },
  setup() {
    const center = ref([40, 40]);
    const projection = ref('EPSG:4326');
    const zoom = ref(3);
    const rotation = ref(0);

    return {
      center,
      projection,
      zoom,
      rotation,
    };
  },
});
</script>

<template>
  <div data-cy="routes-map">
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 400px"
    >
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-map>
  </div>
</template>
