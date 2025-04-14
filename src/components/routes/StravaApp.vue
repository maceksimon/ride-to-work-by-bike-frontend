<script lang="ts">
/**
 * StravaApp Component
 *
 * @description * Use this component to render a banner for Strava integration
 * in the `RoutesApps` view. It displays the connection status and allows
 * users to connect/disconnect their Strava account.

 * @example
 * <strava-app />
 */

// libraries
import { defineComponent, onMounted, ref } from 'vue';

// stores
import { useStravaStore } from '../../stores/strava';

// enums
import { StravaScope } from '../enums/StravaScope';

export default defineComponent({
  name: 'StravaApp',
  setup() {
    const isSyncAll = ref<boolean>(false);
    const stravaStore = useStravaStore();

    onMounted(async () => {
      await stravaStore.loadAccount();
    });

    const handleConnect = async (): Promise<void> => {
      const scope: StravaScope = isSyncAll.value
        ? StravaScope.readAll
        : StravaScope.read;
      await stravaStore.loadAuthUrl(scope);
      if (stravaStore.getAuthUrl) {
        window.location.href = stravaStore.getAuthUrl;
      }
    };

    const handleDisconnect = async (): Promise<void> => {
      await stravaStore.disconnectAccount();
    };

    return {
      isSyncAll,
      stravaStore,
      handleConnect,
      handleDisconnect,
    };
  },
});
</script>

<template>
  <div class="q-pa-md" data-cy="strava-app">
    <div class="row items-center gap-8">
      <!-- Image -->
      <q-img
        src="/image/logo-strava.webp"
        alt=""
        :ratio="1"
        width="48px"
        height="48px"
        class="col-shrink-0 rounded-borders q-mr-md"
        data-cy="strava-app-image"
      />
      <!-- Text -->
      <div class="col flex items-center justify-between gap-8">
        <!-- Title -->
        <h3 class="text-body1 q-my-none" data-cy="strava-app-title">
          {{ $t('routes.appStrava') }}
        </h3>
        <!-- Metadata -->
        <div class="flex items-center justify-between gap-8">
          <!-- Option: Sync All -->
          <q-toggle
            v-model="isSyncAll"
            :label="$t('routes.labelSyncAll')"
            class="q-mr-md"
            data-cy="strava-app-sync-all-toggle"
          />
          <!-- Status (linked) -->
          <div
            v-if="stravaStore.getIsConnected"
            class="col-shrink-0 flex items-center gap-8 q-mr-md"
          >
            <q-avatar size="18px">
              <q-icon
                class="inline-block"
                name="check"
                size="18px"
                data-cy="strava-app-icon"
              />
            </q-avatar>
            <span
              class="inline-block text-subtitle2 text-weight-bold"
              data-cy="strava-app-status"
              >{{ $t('routes.statusLinked') }}</span
            >
          </div>
          <!-- Sync Status -->
          <div
            v-if="stravaStore.getIsConnected"
            class="col-shrink-0 flex items-center gap-8 q-mr-md"
          >
            <span
              class="inline-block text-subtitle2"
              data-cy="strava-app-sync-status"
              >{{ $t('routes.lastSync') }}:
              {{ stravaStore.getLastSyncTime }}</span
            >
          </div>
          <!-- Buttons -->
          <div class="flex items-center gap-8">
            <!-- Connect Button -->
            <q-btn
              v-if="!stravaStore.getIsConnected"
              unelevated
              outline
              rounded
              color="primary"
              :loading="stravaStore.getIsLoading"
              @click="handleConnect"
              data-cy="strava-app-connect-button"
            >
              {{ $t('routes.buttonLinkToApp') }}
            </q-btn>
            <!-- Disconnect Button -->
            <q-btn
              v-if="stravaStore.getIsConnected"
              unelevated
              outline
              rounded
              color="negative"
              :loading="stravaStore.getIsLoading"
              @click="handleDisconnect"
              data-cy="strava-app-disconnect-button"
            >
              {{ $t('routes.buttonDisconnect') }}
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
