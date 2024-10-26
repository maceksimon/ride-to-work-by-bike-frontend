import { defineStore } from 'pinia';

// enums
import { OrganizationType } from '../components/types/Organization';

// composables
import { useApi } from '../composables/useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// utils
import { requestDefaultHeader, requestTokenHeader } from 'src/utils';

// stores
import { useLoginStore } from './login';

// types
import type {
  FormPersonalDetailsApi,
  FormPersonalDetailsFields,
} from '../components/types/Form';
import type { Logger } from '../components/types/Logger';

export const emptyFormPersonalDetails: FormPersonalDetailsFields = {
  firstName: '',
  lastName: '',
  nickname: '',
  gender: null,
  newsletter: [],
  terms: true,
};

interface RegisterChallengeValuesApi {
  personalDetails: FormPersonalDetailsApi;
  organizationId?: number | null;
  subsidiaryId?: number | null;
  teamId?: number | null;
  merchId?: number | null;
}

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('registerChallenge', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    personalDetails: emptyFormPersonalDetails,
    payment: null, // TODO: add data type options
    organizationType: null as OrganizationType | null,
    organizationId: null as number | null,
    subsidiaryId: null as number | null,
    teamId: null as number | null,
    merchId: null as number | null,
  }),

  getters: {
    getPersonalDetails: (state): FormPersonalDetailsFields =>
      state.personalDetails,
    getOrganizationType: (state): OrganizationType | null =>
      state.organizationType,
    getOrganizationId: (state): number | null => state.organizationId,
    getSubsidiaryId: (state): number | null => state.subsidiaryId,
    getTeamId: (state): number | null => state.teamId,
    getMerchId: (state): number | null => state.merchId,
  },

  actions: {
    setPersonalDetails(personalDetails: FormPersonalDetailsFields) {
      Object.assign(this.personalDetails, personalDetails);
    },
    setOrganizationType(organizationType: OrganizationType) {
      this.organizationType = organizationType;
    },
    setOrganizationId(organizationId: number | null) {
      this.organizationId = organizationId;
    },
    setSubsidiaryId(subsidiaryId: number | null) {
      this.subsidiaryId = subsidiaryId;
    },
    setTeamId(teamId: number | null) {
      this.teamId = teamId;
    },
    setMerchId(merchId: number | null) {
      this.merchId = merchId;
    },
    /**
     * Get register challenge values
     * Used on load to check if user has an ongoing registration.
     * @returns {Promise<RegisterChallengeValuesApi | null>}
     */
    async getRegisterChallengeValues(): Promise<RegisterChallengeValuesApi | null> {
      const { apiFetch } = useApi();
      const loginStore = useLoginStore();
      this.$log?.info('Fetching register challenge values from API.');
      // Append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      const { data } = await apiFetch<RegisterChallengeValuesApi>({
        endpoint: rideToWorkByBikeConfig.urlApiChallengeRegistrationUser,
        method: 'get',
        translationKey: 'registerChallengeGet',
        showSuccessMessage: false,
        logger: this.$log,
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
      });

      if (data) {
        this.$log?.debug('Register challenge values fetched successfully.');
        this.$log?.debug(`Fetched data: ${JSON.stringify(data, null, 2)}`);

        // Update store with fetched data
        if (data.personalDetails) {
          this.setPersonalDetails({
            ...this.personalDetails,
            ...data.personalDetails,
          });
        }
        if (data.organizationId) {
          this.setOrganizationId(data.organizationId);
          // TODO: derive organization type from organizationId
        }
        if (data.subsidiaryId) {
          this.setSubsidiaryId(data.subsidiaryId);
        }
        if (data.teamId) {
          this.setTeamId(data.teamId);
        }
        if (data.merchId) {
          this.setMerchId(data.merchId);
        }

        return data;
      } else {
        this.$log?.warn('No data received from register challenge values API.');
        return null;
      }
    },
  },

  persist: true,
});
