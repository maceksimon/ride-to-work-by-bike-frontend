// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from '../composables/useApi';

// config
import { routesConf } from '../router/routes_conf';

// types
import type { Logger } from '../components/types/Logger';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface User {
  email: string;
  password: string;
}

export const emptyUser: User = {
  email: '',
  password: '',
};

const { apiFetch } = useApi();

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: emptyUser,
    logger: null as Logger | null,
    accessToken: '',
    refreshToken: '',
  }),

  getters: {
    getUser: (state): User => state.user,
    getAccessToken: (state): string => state.accessToken,
    getRefreshToken: (state): string => state.refreshToken,
  },

  actions: {
    setUser(user: User): void {
      Object.assign(this.user, user);
    },
    setAccessToken(token: string): void {
      this.accessToken = token;
    },
    setRefreshToken(token: string): void {
      this.refreshToken = token;
    },
    setLogger(logger: Logger): void {
      this.logger = logger;
    },
    /**
     * Login user
     * Checks if email and password are set.
     * If not, shows a notification.
     * If yes, sends the login request to the API.
     * If successful, sets the token.
     * @returns Promise<LoginResponse | null>
     */
    async login(): Promise<LoginResponse | null> {
      // check that email is set
      if (!this.user.email) {
        Notify.create({
          message: i18n.global.t('login.form.messageEmailReqired'),
          color: 'negative',
        });
        return null;
      }
      // check that password is set
      if (!this.user.password) {
        Notify.create({
          message: i18n.global.t('login.form.messagePasswordRequired'),
          color: 'negative',
        });
        return null;
      }
      // login
      const { data } = await apiFetch<LoginResponse>({
        endpoint: routesConf.api_login.path,
        method: 'post',
        payload: this.user,
        translationKey: 'login',
        logger: this.logger,
      });
      // set tokens
      if (data && data.access && data.refresh) {
        this.setAccessToken(data.access);
        this.setRefreshToken(data.refresh);
      }

      return data;
    },
    /**
     * Logout user
     * Sets the access token, refresh token and user to empty values.
     */
    logout(): void {
      this.setAccessToken('');
      this.setRefreshToken('');
      this.setUser(emptyUser);
    },
  },

  persist: true,
});
