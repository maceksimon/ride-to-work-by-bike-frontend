// libraries
import { Notify } from 'quasar';
import { ref } from 'vue';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiDisconnectStravaAccountReturn = {
  success: Ref<boolean>;
  isLoading: Ref<boolean>;
  disconnectAccount: () => Promise<boolean>;
};

/**
 * Disconnect Strava account composable
 * Used for disconnecting Strava account
 * Shows notification about success or error
 * @param {Logger | null} logger
 * @returns {UseApiDisconnectStravaAccountReturn}
 */
export const useApiDisconnectStravaAccount = (
  logger: Logger | null,
): UseApiDisconnectStravaAccountReturn => {
  const success = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Disconnect Strava account
   * @returns {Promise<boolean>} - Promise
   */
  const disconnectAccount = async (): Promise<boolean> => {
    logger?.info('Disconnecting Strava account.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<{ success?: string; error?: string }>({
      endpoint: rideToWorkByBikeConfig.urlApiStravaDisconnectAccount,
      method: 'get',
      translationKey: 'disconnectStravaAccount',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // handle success or error from response
    if (data?.success) {
      success.value = true;
      Notify.create({
        type: 'positive',
        message: i18n.global.t('disconnectStravaAccount.apiMessageSuccess'),
      });
      logger?.info('User strava account was deleted successfully.');
    } else if (data?.error) {
      success.value = false;
      Notify.create({
        type: 'negative',
        message: i18n.global.t(
          'disconnectStravaAccount.apiMessageErrorWithMessage',
          { error: data.error },
        ),
      });
      logger?.debug(
        `User strava account was deleted unsuccessfully <${data.error}>.`,
      );
    }

    isLoading.value = false;
    return success.value;
  };

  return {
    success,
    isLoading,
    disconnectAccount,
  };
};
