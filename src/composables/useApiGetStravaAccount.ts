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
import type { Logger } from '../components/types/Logger';
import type { StravaAccount } from '../components/types/Strava';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetStravaAccountReturn = {
  stravaAccount: Ref<StravaAccount | null>;
  isLoading: Ref<boolean>;
  loadStravaAccount: () => Promise<StravaAccount | null>;
};

/**
 * Get Strava account composable
 * Used for fetching Strava account information
 * @param {Logger | null} logger
 * @returns {UseApiGetStravaAccountReturn}
 */
export const useApiGetStravaAccount = (
  logger: Logger | null,
): UseApiGetStravaAccountReturn => {
  const stravaAccount = ref<StravaAccount | null>(null);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load Strava account information
   * @returns {Promise<void>} - Promise
   */
  const loadStravaAccount = async (): Promise<StravaAccount | null> => {
    logger?.info('Getting Strava account information from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<{ results: StravaAccount[] }>({
      endpoint: rideToWorkByBikeConfig.urlApiStravaGetAccount,
      method: 'get',
      translationKey: 'getStravaAccount',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      stravaAccount.value = data.results[0];
    }

    isLoading.value = false;
    return stravaAccount.value;
  };

  return {
    stravaAccount,
    isLoading,
    loadStravaAccount,
  };
};
