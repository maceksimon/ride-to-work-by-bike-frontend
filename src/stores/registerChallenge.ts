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
  terms: false,
};

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('login', {
  state: () => ({
    personalDetails: emptyFormPersonalDetails,
    payment: null, // TODO: add data type options
    participation: null, // TODO: add data type options
    organizationId: null as string | null,
    addressId: null as string | null,
  }),

  persist: true,
});
