import { defineStore } from 'pinia';

// types
import { FormPersonalDetailsFields } from '../components/types/Form';

const emptyFormPersonalDetails: FormPersonalDetailsFields = {
  firstName: '',
  lastName: '',
  email: '',
  nickname: '',
  gender: '',
  newsletter: [],
  terms: true,
};

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('registerChallenge', {
  state: () => ({
    personalDetails: emptyFormPersonalDetails,
    payment: null, // TODO: add data type options
    participation: null, // TODO: add data type options
    organizationId: null as string | null,
    addressId: null as string | null,
  }),

  getters: {
    getAddressId: (state) => state.addressId,
    getOrganizationId: (state) => state.organizationId,
    getPersonalDetails: (state) => state.personalDetails,
  },

  actions: {
    setFormAddressId(addressId: string | null) {
      this.addressId = addressId;
    },
    setFormOrganizationId(organizationId: string | null) {
      this.organizationId = organizationId;
    },
    setPersonalDetails(personalDetails: FormPersonalDetailsFields) {
      this.personalDetails = personalDetails;
    },
  },

  persist: true,
});
