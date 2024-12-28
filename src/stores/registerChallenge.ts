// libraries
import { defineStore } from 'pinia';

// adapters
import { subsidiaryAdapter } from 'src/adapters/subsidiaryAdapter';

// composables
import { useApiGetSubsidiaries } from 'src/composables/useApiGetSubsidiaries';
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';
import { useApiGetTeams } from 'src/composables/useApiGetTeams';
import { useApiGetMerchandise } from 'src/composables/useApiGetMerchandise';
import { useApiGetFilteredMerchandise } from 'src/composables/useApiGetFilteredMerchandise';

// enums
import { Gender } from '../components/types/Profile';
import { NewsletterType } from '../components/types/Newsletter';
import {
  OrganizationSubsidiary,
  OrganizationType,
  OrganizationOption,
  OrganizationTeam,
} from '../components/types/Organization';
import { PaymentSubject } from '../components/enums/Payment';

// types
import type { Logger } from '../components/types/Logger';
import type { RegisterChallengePersonalDetailsForm } from '../components/types/RegisterChallenge';
import type { ValidatedCoupon } from '../components/types/Coupon';
import type {
  MerchandiseCard,
  MerchandiseItem,
} from '../components/types/Merchandise';
import { i18n } from '../boot/i18n';

const emptyFormPersonalDetails: RegisterChallengePersonalDetailsForm = {
  firstName: '',
  lastName: '',
  newsletter: [] as NewsletterType[],
  nickname: '',
  gender: null as Gender | null,
  terms: true,
  paymentSubject: PaymentSubject.individual,
};

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('registerChallenge', {
  state: () => ({
    $log: null as Logger | null,
    personalDetails: emptyFormPersonalDetails,
    payment: null, // TODO: add data type options
    organizationType: OrganizationType.none,
    organizationId: null as number | null,
    subsidiaryId: null as number | null,
    teamId: null as number | null,
    merchId: null as number | null,
    paymentSubject: PaymentSubject.individual,
    voucher: '' as ValidatedCoupon | string,
    subsidiaries: [] as OrganizationSubsidiary[],
    organizations: [] as OrganizationOption[],
    teams: [] as OrganizationTeam[],
    merchandiseItems: [] as MerchandiseItem[],
    merchandiseCards: {} as Record<Gender, MerchandiseCard[]>,
    isLoadingSubsidiaries: false,
    isLoadingOrganizations: false,
    isLoadingTeams: false,
    isLoadingMerchandise: false,
    isLoadingFilteredMerchandise: false,
  }),

  getters: {
    getPersonalDetails: (state): RegisterChallengePersonalDetailsForm =>
      state.personalDetails,
    getOrganizationType: (state): OrganizationType => state.organizationType,
    getOrganizationId: (state): number | null => state.organizationId,
    getSubsidiaryId: (state): number | null => state.subsidiaryId,
    getTeamId: (state): number | null => state.teamId,
    getMerchId: (state): number | null => state.merchId,
    getPaymentSubject: (state): PaymentSubject => state.paymentSubject,
    getVoucher: (state): ValidatedCoupon | string => state.voucher,
    getSubsidiaries: (state): OrganizationSubsidiary[] => state.subsidiaries,
    getOrganizations: (state): OrganizationOption[] => state.organizations,
    getTeams: (state): OrganizationTeam[] => state.teams,
    getMerchandiseItems: (state): MerchandiseItem[] => state.merchandiseItems,
    getMerchandiseCards: (state): Record<Gender, MerchandiseCard[]> =>
      state.merchandiseCards,
    getSelectedOrganizationLabel: (state): string => {
      if (state.organizationId) {
        const organization = state.organizations.find(
          (org) => org.id === state.organizationId,
        );
        return organization?.name || '';
      }
      return '';
    },
    getSelectedSubsidiaryLabel: (state): string => {
      if (state.subsidiaryId) {
        const subsidiary = state.subsidiaries.find(
          (sub) => sub.id === state.subsidiaryId,
        );
        return subsidiary?.title || '';
      }
      return '';
    },
    getSelectedTeamLabel: (state): string => {
      if (state.teamId) {
        const team = state.teams.find((t) => t.id === state.teamId);
        return team?.name || '';
      }
      return '';
    },
    getSelectedMerchandiseLabel: (state): string => {
      if (state.merchId) {
        const merchandise = state.merchandiseItems.find(
          (m) => m.id === state.merchId,
        );
        return merchandise?.label || i18n.global.t('form.merch.labelNoMerch');
      }
      return '';
    },
    getSelectedMerchandiseDescription: (state): string => {
      if (state.merchId) {
        const merchandise = state.merchandiseItems.find(
          (m) => m.id === state.merchId,
        );
        return merchandise?.description || '';
      }
      return '';
    },
    getSelectedSubsidiaryAddress: (state): string => {
      if (state.subsidiaryId) {
        const subsidiary = state.subsidiaries.find(
          (sub) => sub.id === state.subsidiaryId,
        );
        return subsidiaryAdapter.fromFormCompanyAddressFieldsToString(
          subsidiary?.address,
        );
      }
      return '';
    },
  },

  actions: {
    setPersonalDetails(personalDetails: RegisterChallengePersonalDetailsForm) {
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
    setPaymentSubject(paymentSubject: PaymentSubject) {
      this.paymentSubject = paymentSubject;
    },
    setVoucher(voucher: ValidatedCoupon | string) {
      this.voucher = voucher;
    },
    setSubsidiaries(subsidiaries: OrganizationSubsidiary[]) {
      this.subsidiaries = subsidiaries;
    },
    setOrganizations(organizations: OrganizationOption[]) {
      this.organizations = organizations;
    },
    setTeams(teams: OrganizationTeam[]) {
      this.teams = teams;
    },
    setMerchandiseItems(items: MerchandiseItem[]) {
      this.merchandiseItems = items;
    },
    setMerchandiseCards(cards: Record<Gender, MerchandiseCard[]>) {
      this.merchandiseCards = cards;
    },
    async loadSubsidiariesToStore(logger: Logger | null) {
      const { subsidiaries, loadSubsidiaries } = useApiGetSubsidiaries(logger);
      if (this.organizationId) {
        logger?.debug(
          `Load organization ID <${this.organizationId}>` +
            ' subsidiaries and save them into store.',
        );
        this.isLoadingSubsidiaries = true;
        await loadSubsidiaries(this.organizationId);
        this.subsidiaries = subsidiaries.value;
        logger?.debug(
          `Loaded subsidiaries <${this.subsidiaries}> saved into store.`,
        );
        this.isLoadingSubsidiaries = false;
      }
    },
    async loadOrganizationsToStore(logger: Logger | null) {
      const { organizations, loadOrganizations } =
        useApiGetOrganizations(logger);
      if (this.organizationType !== OrganizationType.none) {
        logger?.debug(
          `Load organizations for type <${this.organizationType}>` +
            ' and save them into store.',
        );
        this.isLoadingOrganizations = true;
        await loadOrganizations(this.organizationType);
        this.organizations = organizations.value;
        logger?.debug(
          `Loaded organizations <${this.organizations}> saved into store.`,
        );
        this.isLoadingOrganizations = false;
      }
    },
    async loadTeamsToStore(logger: Logger | null) {
      const { teams, loadTeams } = useApiGetTeams(logger);
      if (this.subsidiaryId) {
        logger?.debug(
          `Load subsidiary ID <${this.subsidiaryId}>` +
            ' teams and save them into store.',
        );
        this.isLoadingTeams = true;
        await loadTeams(this.subsidiaryId);
        this.teams = teams.value;
        logger?.debug(`Loaded teams <${this.teams}> saved into store.`);
        this.isLoadingTeams = false;
      }
    },
    async loadMerchandiseToStore(logger: Logger | null) {
      const { merchandiseItems, merchandiseCards, loadMerchandise } =
        useApiGetMerchandise(logger);
      logger?.info('Loading merchandise data into store.');
      this.isLoadingMerchandise = true;
      await loadMerchandise();
      this.merchandiseItems = merchandiseItems.value;
      this.merchandiseCards = merchandiseCards.value;
      logger?.debug(
        `Loaded merchandise items <${this.merchandiseItems.length}> and cards saved into store.`,
      );
      this.isLoadingMerchandise = false;
    },
    async loadFilteredMerchandiseToStore(logger: Logger | null, code: string) {
      const { merchandise, loadFilteredMerchandise } =
        useApiGetFilteredMerchandise(logger);
      logger?.debug(
        `Loading filtered merchandise data by code <${code}> into store.`,
      );
      this.isLoadingFilteredMerchandise = true;
      await loadFilteredMerchandise(code);
      this.setMerchId(merchandise.value[0]['id']);
      logger?.debug(
        `Loaded filtered merchandise item ID <${this.getMerchId}> saved into store.`,
      );
      this.isLoadingFilteredMerchandise = false;
    },
  },

  persist: {
    omit: [
      'subsidiaries',
      'organizations',
      'teams',
      'merchandiseItems',
      'merchandiseCards',
    ],
  },
});
