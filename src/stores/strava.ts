// libraries
import { defineStore } from 'pinia';

// composables
import { useApiAuthStravaAccount } from '../composables/useApiAuthStravaAccount';
import { useApiDisconnectStravaAccount } from '../composables/useApiDisconnectStravaAccount';
import { useApiGetStravaAccount } from '../composables/useApiGetStravaAccount';
import { useApiGetStravaAuthUrl } from '../composables/useApiGetStravaAuthUrl';
import { useApiGetStravaAccountSync } from '../composables/useApiGetStravaAccountSync';

// enums
import { StravaScope } from '../components/enums/Strava';

// types
import type { Logger } from '../components/types/Logger';
import type { StravaAccount, SyncResult } from '../components/types/Strava';

interface StravaState {
  $log: Logger | null;
  account: StravaAccount | null;
  isLoading: boolean;
  authUrl: string | null;
}

export const useStravaStore = defineStore('strava', {
  state: (): StravaState => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    account: null,
    isLoading: false,
    authUrl: null,
  }),

  getters: {
    /**
     * Get Strava account
     * @returns {StravaAccount | null} - Strava account data
     */
    getAccount: (state): StravaAccount | null => state.account,
    /**
     * Get loading state
     * @returns {boolean} - Whether data is being loaded
     */
    getIsLoading: (state): boolean => state.isLoading,
    /**
     * Get authorization URL
     * @returns {string | null} - Strava authorization URL
     */
    getAuthUrl: (state): string | null => state.authUrl,
    /**
     * Check if Strava is connected
     * @returns {boolean} - Whether Strava is connected
     */
    getIsConnected: (state): boolean => state.account !== null,
    /**
     * Get sync result from Strava account
     * If it does not exist or is null, return null
     * @returns {SyncResult | null} - Current sync result or null
     */
    getSyncResult: (state): SyncResult | null => {
      const syncResult = state.account?.sync_outcome?.result;
      if (!syncResult) {
        return null;
      }
      return syncResult;
    },
    /**
     * Get last sync time
     * @returns {string | undefined} - Last sync time
     */
    getLastSyncTime: (state): string | null | undefined =>
      state.account?.last_sync_time,
    /**
     * Get hashtag from
     * @returns {string} - Hashtag from
     */
    getHashtagFrom: (state): string => state.account?.hashtag_from || '',
    /**
     * Get hashtag to
     * @returns {string} - Hashtag to
     */
    getHashtagTo: (state): string => state.account?.hashtag_to || '',
    /**
     * Get user sync count
     * @returns {number} - Current sync count
     */
    getUserSyncCount: (state): number => state.account?.user_sync_count || 0,
    /**
     * Get warning sync count
     * @returns {number} - Warning sync count threshold
     */
    getWarnUserSyncCount: (state): number =>
      state.account?.warn_user_sync_count || 0,
    /**
     * Get max sync count
     * @returns {number} - Maximum sync count
     */
    getMaxUserSyncCount: (state): number =>
      state.account?.max_user_sync_count || 0,
    /**
     * Check if near sync limit
     * @returns {boolean} - Whether near sync limit
     */
    getIsNearSyncLimit: (state): boolean => {
      const userSyncCount = state.account?.user_sync_count || 0;
      const warnUserSyncCount = state.account?.warn_user_sync_count || 0;
      return userSyncCount >= warnUserSyncCount;
    },
    /**
     * Check if reached sync limit
     * @returns {boolean} - Whether reached sync limit
     */
    getHasReachedSyncLimit: (state): boolean => {
      const userSyncCount = state.account?.user_sync_count || 0;
      const maxUserSyncCount = state.account?.max_user_sync_count || 0;
      return userSyncCount >= maxUserSyncCount;
    },
  },

  actions: {
    /**
     * Set loading state
     * @param {boolean} loading - New loading state
     * @returns {void}
     */
    setIsLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    /**
     * Set authorization URL
     * @param {string | null} url - Authorization URL
     * @returns {void}
     */
    setAuthUrl(url: string | null): void {
      this.authUrl = url;
    },
    /**
     * Set Strava account
     * @param {StravaAccount | null} account - Strava account data
     * @returns {void}
     */
    setAccount(account: StravaAccount | null): void {
      this.$log?.debug(`setAccount: ${JSON.stringify(account, null, 2)}`);
      this.account = account;
    },
    /**
     * Load Strava account data
     * @returns {Promise<void>}
     */
    async loadAccount(): Promise<void> {
      const { stravaAccount, loadStravaAccount } = useApiGetStravaAccount(
        this.$log,
      );
      this.setIsLoading(true);
      await loadStravaAccount();
      this.setAccount(stravaAccount.value);
      this.setIsLoading(false);
    },
    /**
     * Sync Strava account data
     * @returns {Promise<void>}
     */
    async syncAccount(): Promise<void> {
      const { stravaAccount, syncStravaAccount } = useApiGetStravaAccountSync(
        this.$log,
      );
      this.setIsLoading(true);
      await syncStravaAccount();
      this.setAccount(stravaAccount.value);
      this.setIsLoading(false);
    },
    /**
     * Get Strava authorization URL
     * @param {string} scope - Authorization scope
     * @returns {Promise<void>}
     */
    async loadAuthUrl(scope: StravaScope): Promise<void> {
      const { authUrl, getAuthUrl: loadAuthUrl } = useApiGetStravaAuthUrl(
        this.$log,
      );
      this.setIsLoading(true);
      await loadAuthUrl(scope);
      this.setAuthUrl(authUrl.value);
      this.setIsLoading(false);
    },
    /**
     * Authenticate Strava account
     * @param {string} code - Authorization code
     * @returns {Promise<void>}
     */
    async authAccount(code: string): Promise<void> {
      const { account, authAccount } = useApiAuthStravaAccount(this.$log);
      this.setIsLoading(true);
      await authAccount(code);
      this.setAccount(account.value);
      this.setIsLoading(false);
    },
    /**
     * Disconnect Strava account
     * @returns {Promise<void>}
     */
    async disconnectAccount(): Promise<void> {
      const { success, disconnectAccount } = useApiDisconnectStravaAccount(
        this.$log,
      );
      this.setIsLoading(true);
      await disconnectAccount();
      if (success.value) {
        this.setAccount(null);
      }
      this.setIsLoading(false);
    },
  },
});
