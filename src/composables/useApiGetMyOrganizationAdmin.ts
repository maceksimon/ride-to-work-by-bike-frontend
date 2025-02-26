// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  OrganizationAdmin,
  OrganizationAdminResponse,
  UseApiGetMyOrganizationAdminReturn,
} from '../components/types/apiOrganization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get organization admin composable
 * Used for fetching information about organization administrators
 * @param {Logger | null} logger
 * @returns {UseApiGetMyOrganizationAdminReturn}
 */
export const useApiGetMyOrganizationAdmin = (
  logger: Logger | null,
): UseApiGetMyOrganizationAdminReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Get organization admin information
   * @returns {Promise<OrganizationAdmin[]>} - Promise resolving to array of organization admins
   */
  const getMyOrganizationAdmin = async (): Promise<OrganizationAdmin[]> => {
    logger?.info('Getting organization admin information from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<OrganizationAdminResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiMyOrganizationAdmin}`,
      method: 'get',
      translationKey: 'getMyOrganizationAdmin',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    logger?.debug(
      `Organization admin response data <${JSON.stringify(data, null, 2)}>.`,
    );

    isLoading.value = false;
    return data?.organization_admin ?? [];
  };

  return {
    isLoading,
    getMyOrganizationAdmin,
  };
};
