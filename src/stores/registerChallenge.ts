import { defineStore } from 'pinia';

// types
import {
  FormPersonalDetailsFields,
  FormPersonalDetailsFieldsNullable,
} from '../components/types/Form';

const emptyFormPersonalDetails: FormPersonalDetailsFieldsNullable = {
  firstName: null,
  lastName: null,
  email: null,
  nickname: null,
  gender: null,
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
    getAddressId: (state): string | null => state.addressId,
    getOrganizationId: (state): string | null => state.organizationId,
    getPersonalDetails: (state): FormPersonalDetailsFieldsNullable =>
      state.personalDetails,
    getPersonalDetailsStringDefaults: (state): FormPersonalDetailsFields => ({
      firstName: state.personalDetails.firstName || '',
      lastName: state.personalDetails.lastName || '',
      email: state.personalDetails.email || '',
      nickname: state.personalDetails.nickname || '',
      gender: state.personalDetails.gender,
      newsletter: state.personalDetails.newsletter,
      terms: state.personalDetails.terms,
    }),
  },

  actions: {
    setFormAddressId(addressId: string | null) {
      this.addressId = addressId;
    },
    setFormOrganizationId(organizationId: string | null) {
      this.organizationId = organizationId;
    },
    setPersonalDetails(personalDetails: FormPersonalDetailsFieldsNullable) {
      Object.assign(this.personalDetails, personalDetails);
    },
  },

  persist: true,
});
