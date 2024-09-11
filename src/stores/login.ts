import { defineStore } from 'pinia';
import { useApiPost } from '../composables/useApiPost';

type LoginResponse = {
  key: string;
};

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
    async login(): Promise<LoginResponse | null> {
      const { apiPost } = useApiPost();
      const { data } = await apiPost<LoginResponse>({
        endpoint: '/login',
        payload: this.user,
        translationKey: 'login',
      });

      return data;
    },
  },

  persist: true,
});
