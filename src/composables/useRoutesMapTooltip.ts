// libraries
import { ref } from 'vue';
import { getLength } from 'ol/sphere';
import { LineString } from 'ol/geom';
import { unByKey } from 'ol/Observable';

// composables
import { useRoutesMap } from './useRoutesMap';

// types
import type { Coordinate } from 'ol/coordinate';
import type { EventsKey } from 'ol/events';
import type { Feature } from 'ol';
import type { DrawEvent } from 'ol/interaction/Draw';

export const useRoutesMapTooltip = () => {
  // parallel to drawn route
  const route = ref<Feature | null>(null);
  const tooltipCoord = ref<Coordinate | null>(null);
  const tooltipText = ref('');
  let listener: EventsKey;

  const { formatLength } = useRoutesMap();

  /**
   * Handles the start of a draw event for measuring the length of a line.
   * @param {DrawEvent} evt - The draw event object.
   * @return {void} This function does not return anything.
   */
  const onDrawStartLength = (evt: DrawEvent) => {
    route.value = evt.feature;
    const geom = route.value.getGeometry();
    if (geom instanceof LineString) {
      tooltipCoord.value = geom.getLastCoordinate();
      // sets listener to the route geometry object
      listener = geom.on('change', (evt) => {
        const geom = evt.target;
        if (geom instanceof LineString) {
          tooltipText.value = formatGeometryLength(geom);
          tooltipCoord.value = geom.getLastCoordinate();
        }
      });
    }
  };

  /**
   * Called after draw is finished.
   * Cleans up the drawn route, unsets the tooltip, and cleans up event listeners.
   * @return {void} This function does not return anything.
   */
  const onDrawEndLength = () => {
    // remove drawn route
    route.value = null;
    // unset tooltip so that a new one can be created
    tooltipCoord.value = null;
    tooltipText.value = '';
    // cleanup listeners
    unByKey(listener);
  };

  const formatGeometryLength = (line: LineString) => {
    const length = getLength(line);
    return formatLength(length);
  };

  return {
    route,
    tooltipCoord,
    tooltipText,
    onDrawStartLength,
    onDrawEndLength,
  };
};
