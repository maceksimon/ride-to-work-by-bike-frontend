// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiDeleteCompetitionReturn {
  isLoading: Ref<boolean>;
  deleteCompetition: (id: number) => Promise<boolean>;
}

/**
 * Composable for deleting a company challenge
 * @param {Logger | null} logger - Logger
 * @returns {UseApiDeleteCompetitionReturn}
 */
export const useApiDeleteCompetition = (
  logger: Logger | null,
): UseApiDeleteCompetitionReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Delete a competition/company challenge with given ID
   * @param {number} id - Competition ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteCompetition = async (id: number): Promise<boolean> => {
    logger?.debug(`Delete competition with ID <${id}>.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // delete competition
    const { success } = await apiFetch<Record<string, never>>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCompetition}${id}/`,
      method: 'delete',
      translationKey: 'deleteCompetition',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    isLoading.value = false;
    return success;
  };

  return {
    isLoading,
    deleteCompetition,
  };
};
