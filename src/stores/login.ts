import { defineStore } from 'pinia';

interface User {
  email: string;
  password: string;
}

export const emptyUser: User = {
  email: '',
  password: '',
};

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: emptyUser,
  }),

  getters: {
    getUser: (state): User => state.user,
  },

  actions: {
    setUser(user: User): void {
      Object.assign(this.user, user);
    },
  },

  persist: true,
});
