import { defineStore } from 'pinia';
import { useApiPost } from '../composables/useApiPost';
import { Notify } from 'quasar';
import { i18n } from '../boot/i18n';

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
    token: '',
  }),

  getters: {
    getUser: (state): User => state.user,
    getToken: (state): string => state.token,
  },

  actions: {
    setUser(user: User): void {
      Object.assign(this.user, user);
    },
    setToken(token: string): void {
      this.token = token;
    },
    /**
     * Login user
     * @returns LoginResponse | null
     */
    async login(): Promise<LoginResponse | null> {
      const { apiPost } = useApiPost();
      // check email
      if (!this.user.email) {
        Notify.create({
          message: i18n.global.t('login.form.messageEmailReqired'),
          color: 'negative',
        });
        return null;
      }
      // check password
      if (!this.user.password) {
        Notify.create({
          message: i18n.global.t('login.form.messagePasswordRequired'),
          color: 'negative',
        });
        return null;
      }
      // login
      const { data } = await apiPost<LoginResponse>({
        endpoint: '/login',
        payload: this.user,
        translationKey: 'login',
      });
      // set token
      if (data && data.key) {
        this.setToken(data.key);
      }

      return data;
    },
  },

  persist: true,
});
