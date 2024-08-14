// libraries
import { computed, ref } from 'vue';

// types
import type {
  RouteInputType,
  RouteLogData,
  TransportType,
} from 'src/components/types/Route';

export const useLogRoutes = (initialRoute: RouteLogData | null) => {
  const action = ref<RouteInputType>(initialRoute?.action || 'input-number');
  const distance = ref<number>(initialRoute?.distance || 0);
  const transportType = ref<TransportType>(
    initialRoute?.transportType || 'bike',
  );
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
    transportType,
    isShownDistance,
  };
};
