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

type UseApiAuthStravaAccountReturn = {
  account: Ref<StravaAccount | null>;
  accountStatus: Ref<'created' | 'updated' | null>;
  isLoading: Ref<boolean>;
  authAccount: (code: string) => Promise<void>;
};

/**
 * Auth Strava account composable
 * Used for authenticating Strava account with code
 * @param {Logger | null} logger
 * @returns {UseApiAuthStravaAccountReturn}
 */
export const useApiAuthStravaAccount = (
  logger: Logger | null,
): UseApiAuthStravaAccountReturn => {
  const account = ref<StravaAccount | null>(null);
  const accountStatus = ref<'created' | 'updated' | null>(null);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Authenticate Strava account with code
   * @param {string} code - Strava authorization code
   * @returns {Promise<void>} - Promise
   */
  const authAccount = async (code: string): Promise<void> => {
    logger?.info('Authenticating Strava account with code.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<{
      account_status: 'created' | 'updated';
      account: StravaAccount;
    }>({
      endpoint: `${rideToWorkByBikeConfig.urlApiStravaAuthAccount}${code}/`,
      method: 'get',
      translationKey: 'authStravaAccount',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data) {
      accountStatus.value = data.account_status;
      account.value = data.account;
    }

    isLoading.value = false;
  };

  return {
    account,
    accountStatus,
    isLoading,
    authAccount,
  };
};
