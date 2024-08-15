// libraries
import { computed, onMounted, ref, watch } from 'vue';

// types
import type {
  RouteInputType,
  RouteItem,
  TransportType,
} from 'src/components/types/Route';

export const useLogRoutes = (routes: RouteItem[]) => {
  const routesCount = computed((): number => routes.length);

  const action = ref<RouteInputType>('input-number');
  const distance = ref<number>(0);
  const transportType = ref<TransportType>('bike');

  const setRouteInputData = (routes: RouteItem[]): void => {
    if (routes.length === 1) {
      action.value = routes[0].inputType || 'input-number';
      distance.value = routes[0].distance || 0;
      transportType.value = routes[0].transport || 'bike';
    }
  };

  onMounted(() => {
    watch(routes, () => setRouteInputData(routes));
  });

  const isShownDistance = computed((): boolean => {
    return (
      transportType.value === 'bike' ||
      transportType.value === 'walk' ||
      transportType.value === 'bus'
    );
  });

  return {
    action,
    distance,
    routesCount,
    transportType,
    isShownDistance,
  };
};
