import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: {
      email: 'test@example.com',
    },
  }),

  getters: {},

  actions: {},

  persist: true,
});
