// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from '../composables/useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const emptyUser: User = {
  email: '',
  first_name: '',
  last_name: '',
  pk: 0,
  username: '',
};

const { apiFetch } = useApi();

export const useLoginStore = defineStore('login', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    user: emptyUser,
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
    /**
     * Login user
     * Checks if email and password are set.
     * If not, shows a notification.
     * If yes, sends the login request to the API.
     * If successful, sets the token.
     * @param payload - LoginPayload
     * @returns Promise<LoginResponse | null>
     */
    async login(payload: LoginPayload): Promise<LoginResponse | null> {
      // check that email is set
      if (!payload.username) {
        Notify.create({
          message: i18n.global.t('login.form.messageEmailReqired'),
          color: 'negative',
        });
        return null;
      }
      // check that password is set
      if (!payload.password) {
        Notify.create({
          message: i18n.global.t('login.form.messagePasswordRequired'),
          color: 'negative',
        });
        return null;
      }
      // login
      const { data } = await apiFetch<LoginResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiLogin,
        method: 'post',
        payload,
        translationKey: 'login',
        logger: this.$log,
      });
      // set tokens
      if (data && data.access_token && data.refresh_token) {
        this.setAccessToken(data.access_token);
        this.setRefreshToken(data.refresh_token);
      }
      // set user
      if (data && data.user) {
        this.setUser(data.user);
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
