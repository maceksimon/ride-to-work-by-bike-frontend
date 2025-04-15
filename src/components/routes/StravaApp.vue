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
import { Screen } from 'quasar';
import { computed, defineComponent, onMounted, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// stores
import { useStravaStore } from '../../stores/strava';

// enums
import { StravaScope } from '../enums/StravaScope';

export default defineComponent({
  name: 'StravaApp',
  setup() {
    const isSyncAll = ref<boolean>(false);
    const stravaStore = useStravaStore();

    const stravaUserAccount = computed(() => {
      return stravaStore.getAccount;
    });

    const userInfo = computed(() => {
      if (!stravaUserAccount.value) {
        return '';
      }
      if (!stravaUserAccount.value.strava_username) {
        return `${stravaUserAccount.value.first_name} ${stravaUserAccount.value.last_name}`;
      }
      return `${stravaUserAccount.value.first_name} ${stravaUserAccount.value.last_name} (${stravaUserAccount.value.strava_username})`;
    });

    const syncError = computed<string>((): string => {
      if (
        stravaUserAccount.value?.sync_outcome &&
        'error' in stravaUserAccount.value.sync_outcome
      ) {
        return stravaUserAccount.value.sync_outcome.error as string;
      }
      return '';
    });

    const isWarnUserSync = computed<boolean>((): boolean => {
      return (
        (stravaUserAccount.value?.user_sync_count || 0) >
        (stravaUserAccount.value?.warn_user_sync_count || 0)
      );
    });

    const isAllowedToSync = computed<boolean>((): boolean => {
      return (
        (stravaUserAccount.value?.user_sync_count || 0) <
        (stravaUserAccount.value?.max_user_sync_count || 0)
      );
    });

    const newTripsCount = computed<number>((): number => {
      return stravaUserAccount.value?.sync_outcome?.result?.new_trips || 0;
    });

    const syncedTripsCount = computed<number>((): number => {
      return stravaUserAccount.value?.sync_outcome?.result?.synced_trips || 0;
    });

    const syncedActivitiesCount = computed<number>((): number => {
      return (
        stravaUserAccount.value?.sync_outcome?.result?.synced_activities || 0
      );
    });

    const hashtagTo = computed<string>((): string => {
      return stravaUserAccount.value?.hashtag_to || '';
    });

    const hashtagFrom = computed<string>((): string => {
      return stravaUserAccount.value?.hashtag_from || '';
    });

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

    const handleSync = async (): Promise<void> => {
      await stravaStore.loadAccount();
    };

    const { urlFaq, urlHelpdesk, urlStravaPrivacyZones } =
      rideToWorkByBikeConfig;

    const textMaxWidth = Screen.sizes.sm;

    return {
      isSyncAll,
      stravaStore,
      stravaUserAccount,
      handleConnect,
      handleDisconnect,
      handleSync,
      userInfo,
      newTripsCount,
      syncedTripsCount,
      syncedActivitiesCount,
      hashtagTo,
      hashtagFrom,
      syncError,
      textMaxWidth,
      isAllowedToSync,
      isWarnUserSync,
      urlFaq,
      urlHelpdesk,
      urlStravaPrivacyZones,
    };
  },
});
</script>

<template>
  <div data-cy="strava-app">
    <!-- List -->
    <q-expansion-item
      header-class="rounded-borders"
      data-cy="strava-app-expansion-item"
    >
      <template v-slot:header>
        <div class="full-width row items-center gap-8">
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
            <!-- Buttons -->
            <div class="flex items-center gap-8 q-mr-md">
              <!-- Status (linked) -->
              <q-chip
                v-if="stravaStore.getIsConnected"
                color="secondary"
                class="col-shrink-0 text-teal-10"
                icon="check"
              >
                {{ $t('routes.statusLinked') }}
              </q-chip>
            </div>
          </div>
        </div>
      </template>
      <!-- Metadata -->
      <div class="q-pa-md text-body2">
        <!-- Info: User is connected -->
        <div v-if="stravaStore.getIsConnected">
          <div
            v-if="stravaUserAccount"
            class="flex items-center gap-8 justify-between q-my-sm"
          >
            <!-- Text: Connected user -->
            {{ $t('routes.statusConnectedUser', { userInfo }) }}
            <!-- Chip: Sync success -->
            <q-chip
              v-if="stravaStore.getLastSyncTime"
              size="sm"
              class="q-mx-none q-my-sm"
              data-cy="strava-app-sync-status"
              >{{ $t('routes.labelLastSync') }}:
              {{ $d(new Date(stravaStore.getLastSyncTime), 'numeric') }}
            </q-chip>
            <!-- Chip: Sync error -->
            <q-chip
              v-else-if="syncError"
              color="negative"
              class="q-mx-none q-my-sm"
              data-cy="strava-app-sync-status"
              >{{ $t('routes.labelSyncError') }}</q-chip
            >
          </div>
          <div
            class="q-my-sm text-pretty"
            :style="{ 'max-width': `${textMaxWidth}px` }"
          >
            <!-- Info: User has synced trips -->
            <template v-if="syncedTripsCount">
              {{ $t('routes.statusSyncSuccess') }}
              {{
                $t('routes.statusSyncedTrips', {
                  syncedTrips: syncedTripsCount,
                  newTrips: newTripsCount,
                })
              }}
            </template>
            <!-- Info: Sync error -->
            <template v-if="syncError">
              <p>
                {{
                  $t('routes.statusSyncErrorWithMessage', {
                    message: syncError,
                  })
                }}
              </p>
            </template>
            <!-- Info: User has no synced trips -->
            <template v-else>
              <p>
                {{
                  $t('routes.instructionSyncTripsFromStrava', {
                    syncedActivities: syncedActivitiesCount,
                    hashtagTo,
                    hashtagFrom,
                  })
                }}
              </p>
              <p>{{ $t('routes.instructionSyncReadAllSettings') }}</p>
            </template>
            <template v-if="isWarnUserSync">
              <p
                v-html="
                  $t('routes.instructionSyncWarnUser', { url: urlHelpdesk })
                "
              ></p>
            </template>
          </div>
          <div class="q-mt-md flex items-center gap-8">
            <!-- Button: Sync -->
            <q-btn
              v-if="isAllowedToSync"
              unelevated
              outline
              rounded
              color="primary"
              class="bg-white"
              :loading="stravaStore.getIsLoading"
              :disabled="stravaStore.getIsLoading"
              @click="handleSync"
              data-cy="strava-app-sync-button"
            >
              {{ $t('routes.buttonSync') }}
            </q-btn>
            <!-- Button: Disconnect -->
            <q-btn
              v-if="stravaStore.getIsConnected"
              unelevated
              outline
              rounded
              color="negative"
              class="bg-white"
              :loading="stravaStore.getIsLoading"
              :disabled="stravaStore.getIsLoading"
              @click="handleDisconnect"
              data-cy="strava-app-disconnect-button"
            >
              {{ $t('routes.buttonDisconnect') }}
            </q-btn>
          </div>
        </div>
        <!-- Info: User is not connected -->
        <div v-else>
          <div
            class="text-pretty"
            :style="{ 'max-width': `${textMaxWidth}px` }"
          >
            <h3 class="text-subtitle1 q-mb-none">
              {{ $t('routes.titleStravaNotConnected') }}
            </h3>
            <!-- Option: Scope -->
            <q-toggle
              v-model="isSyncAll"
              :label="$t('routes.labelSyncAll')"
              class="q-my-md"
              data-cy="strava-app-sync-all-toggle"
            />
            <p
              v-html="
                $t('routes.instructionStravaNotConnected', {
                  url: urlStravaPrivacyZones,
                })
              "
            ></p>
            <h3 class="text-subtitle1">
              {{ $t('routes.titleStravaHowItWorks') }}
            </h3>
            <p
              v-html="$t('routes.instructionStravaHowItWorks', { url: urlFaq })"
            ></p>
          </div>
          <div class="q-mt-lg flex items-center gap-8">
            <!-- Button: Connect -->
            <q-btn
              v-if="!stravaStore.getIsConnected"
              unelevated
              outline
              rounded
              color="primary"
              class="bg-white"
              :disabled="stravaStore.getIsLoading"
              :loading="stravaStore.getIsLoading"
              @click="handleConnect"
              data-cy="strava-app-connect-button"
            >
              {{ $t('routes.buttonLinkToApp') }}
            </q-btn>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<style lang="scss">
.text-pretty {
  text-wrap: pretty;
}
</style>
