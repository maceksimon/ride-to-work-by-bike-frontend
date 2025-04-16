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

type UseApiGetStravaAccountSyncReturn = {
  stravaAccount: Ref<StravaAccount | null>;
  isLoading: Ref<boolean>;
  syncStravaAccount: () => Promise<StravaAccount | null>;
};

/**
 * Get Strava account sync composable
 * Used for fetching Strava account information with sync
 * @param {Logger | null} logger
 * @returns {UseApiGetStravaAccountSyncReturn}
 */
export const useApiGetStravaAccountSync = (
  logger: Logger | null,
): UseApiGetStravaAccountSyncReturn => {
  const stravaAccount = ref<StravaAccount | null>(null);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Sync Strava account information
   * @returns {Promise<void>} - Promise
   */
  const syncStravaAccount = async (): Promise<StravaAccount | null> => {
    logger?.info('Getting Strava account information with sync from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<{ results: StravaAccount[] }>({
      endpoint: rideToWorkByBikeConfig.urlApiStravaGetAccountSync,
      method: 'get',
      translationKey: 'getStravaAccountSync',
      showSuccessMessage: true,
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
    syncStravaAccount,
  };
};
