import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: {
      email: '',
      password: '' as string | number | null,
    },
  }),

  getters: {
    userEmail: (state): string => state.user.email,
    userPassword: (state): string | number | null => state.user.password,
  },

  actions: {
    setUserEmail(email: string): void {
      this.user.email = email;
    },
    setUserPassword(password: string | number | null): void {
      this.user.password = password;
    },
  },

  persist: true,
});
