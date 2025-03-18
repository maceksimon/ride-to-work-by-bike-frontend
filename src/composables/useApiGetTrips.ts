// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Trip, GetTripsResponse } from '../components/types/Trip';
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetTripsReturn = {
  trips: Ref<Trip[]>;
  isLoading: Ref<boolean>;
  loadTrips: () => Promise<Trip[]>;
};

/**
 * Get trips composable
 * Used to getting API trips data
 * @param logger - Logger
 * @returns {UseApiGetTripsReturn}
 */
export const useApiGetTrips = (logger: Logger | null): UseApiGetTripsReturn => {
  const trips = ref<Trip[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load trips
   * Fetches trips, saves and returns them
   * @returns {Promise<Trip[]>} - Promise
   */
  const loadTrips = async (): Promise<Trip[]> => {
    // reset data
    logger?.debug(
      `Reseting trips data <${JSON.stringify(trips.value, null, 2)}>.`,
    );
    trips.value = [];
    logger?.debug(
      `Trips data reset to <${JSON.stringify(trips.value, null, 2)}>.`,
    );

    // get trips
    logger?.info('Get trips from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch trips
    const { data } = await apiFetch<GetTripsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiTrips}`,
      method: 'get',
      translationKey: 'getTrips',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      trips.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
    return trips.value;
  };

  /**
   * Fetch next page of trips
   * @param {string} url - Get trips next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of trips from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<GetTripsResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getTrips',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      trips.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    trips,
    isLoading,
    loadTrips,
  };
};
