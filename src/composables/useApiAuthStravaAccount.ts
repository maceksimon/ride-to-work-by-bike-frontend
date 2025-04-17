// libraries
import { Notify } from 'quasar';
import { ref } from 'vue';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { StravaAccountStatus } from '../components/enums/Strava';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';
import type {
  StravaAccount,
  StravaAuthResponse,
} from '../components/types/Strava';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiAuthStravaAccountReturn = {
  account: Ref<StravaAccount | null>;
  accountStatus: Ref<StravaAccountStatus | null>;
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
  const accountStatus = ref<StravaAccountStatus | null>(null);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Authenticate Strava account with code
   * @param {string} code - Strava authorization code
   * @returns {Promise<void>} - Promise
   */
  const authAccount = async (code: string): Promise<void> => {
    logger?.debug(`Authenticating Strava account with code <${code}>.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<StravaAuthResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiStravaAuthAccount}${code}/`,
      method: 'get',
      translationKey: 'authStravaAccount',
      showSuccessMessage: true,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // handle error response
    if (data && 'error' in data) {
      Notify.create({
        type: 'negative',
        message: i18n.global.t('authStravaAccount.apiMessageErrorWithMessage', {
          message: data.error,
        }),
      });
    }
    // handle success response
    else if (data && 'account_status' in data && 'account' in data) {
      accountStatus.value = data.account_status;
      account.value = data.account[0];
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
