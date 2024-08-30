import { defineStore } from 'pinia';

// types
import { FormPersonalDetailsFields } from '../components/types/Form';
import { Organization } from '../components/types/Organization';

const emptyFormPersonalDetails: FormPersonalDetailsFields = {
  firstName: '',
  lastName: '',
  email: '',
  nickname: '',
  gender: '',
  newsletter: [],
  terms: false,
};

export const useRegisterChallengeStore = defineStore('login', {
  state: () => ({
    form: {
      personalDetails: emptyFormPersonalDetails,
      payment: null, // TODO: add data type options
      participation: null, // TODO: add data type options
      organization: null as Organization | null,
    },
  }),

  persist: true,
});
