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
import type { OrganizationSubsidiary } from '../components/types/Organization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface GetSubsidiariesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationSubsidiary[];
}

export const useApiGetSubsidiaries = (logger: Logger | null) => {
  const subsidiaries = ref<OrganizationSubsidiary[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load subsidiaries
   * Fetches subsidiaries and saves them into options
   */
  const loadSubsidiaries = async (organizationId: number): Promise<void> => {
    // reset options
    subsidiaries.value = [];

    // get subsidiaries
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch subsidiaries
    const { data } = await apiFetch<GetSubsidiariesResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiOrganizations}${organizationId}/subsidiaries/`,
      method: 'get',
      translationKey: 'getSubsidiaries',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      subsidiaries.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of subsidiaries
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch next page
    const { data } = await apiFetch<GetSubsidiariesResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getSubsidiaries',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      subsidiaries.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    subsidiaries,
    isLoading,
    loadSubsidiaries,
  };
};
