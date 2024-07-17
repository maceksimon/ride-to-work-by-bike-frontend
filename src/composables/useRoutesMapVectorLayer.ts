// libraries
import { computed } from 'vue';
import { Layers } from 'vue3-openlayers';

// types
import type { Ref } from 'vue';
import type { Feature } from 'ol';

export const useRoutesMapVectorLayer = (
  vectorLayer: Ref<typeof Layers.OlVectorLayer>,
) => {
  // vector layer source
  const source = computed(() => vectorLayer.value?.vectorLayer.getSource());

  /**
   * Adds the drawn route on the map.
   * @param pathFeature Feature
   * @return {void}
   */
  const addMapRoute = (pathFeature: Feature): void => {
    source.value && source.value.addFeature(pathFeature);
  };

  /**
   * Clears all drawn routes from the map.
   * @return {void}
   */
  const clearMapRoutes = (): void => {
    const source = vectorLayer.value?.vectorLayer.getSource();
    source && source.clear();
  };

  /**
   * Renders selected route on the map.
   * First clears all previously drawn routes from the map.
   * @param feature Feature
   * @return {void}
   */
  const renderSavedRoute = (feature: Feature): void => {
    clearMapRoutes();
    addMapRoute(feature);
  };

  return {
    addMapRoute,
    clearMapRoutes,
    renderSavedRoute,
  };
};
