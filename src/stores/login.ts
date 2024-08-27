import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: {
      email: null as string | null,
      password: null as string | number | null,
    },
  }),

  getters: {
    userEmailString: (state): string =>
      state.user.email ? state.user.email : '',
    userPasswordString: (state): string =>
      state.user.password ? state.user.password.toString() : '',
  },

  actions: {
    setUserEmail(email: string | null): void {
      this.user.email = email;
    },
    setUserPassword(password: string | number | null): void {
      this.user.password = password;
    },
  },

  persist: true,
});
