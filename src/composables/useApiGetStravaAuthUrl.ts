// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { StravaScope } from '../components/enums/Strava';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetStravaAuthUrlReturn = {
  authUrl: Ref<string | null>;
  isLoading: Ref<boolean>;
  getAuthUrl: (scope: StravaScope) => Promise<string | null>;
};

/**
 * Get Strava auth URL composable
 * Used for getting Strava authorization URL
 * @param {Logger | null} logger
 * @returns {UseApiGetStravaAuthUrlReturn}
 */
export const useApiGetStravaAuthUrl = (
  logger: Logger | null,
): UseApiGetStravaAuthUrlReturn => {
  const authUrl = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Get Strava authorization URL
   * @param {string} scope - Strava scope
   * @returns {Promise<string | null>} - Promise
   */
  const getAuthUrl = async (scope: StravaScope): Promise<string | null> => {
    logger?.debug(
      `Get Strava authorization URL from API with scope <${scope}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<{ auth_url: string }>({
      endpoint: `${rideToWorkByBikeConfig.urlApiStravaConnectAccount}${scope}/`,
      method: 'get',
      translationKey: 'getStravaAuthUrl',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.auth_url) {
      authUrl.value = data.auth_url;
    }

    isLoading.value = false;
    return authUrl.value;
  };

  return {
    authUrl,
    isLoading,
    getAuthUrl,
  };
};
