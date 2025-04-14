<template>
  <q-page class="overflow-hidden bg-white" data-cy="q-main">
    <div class="q-px-lg q-pt-lg">
      <page-heading data-cy="routes-connect-apps-page-title">
        {{ $t('routes.titleRoutesConnectApps') }}
        <template #secondary>
          <!-- TODO: add secondary text -->
        </template>
      </page-heading>
      <!-- Loading spinner -->
      <q-inner-loading
        :showing="true"
        color="primary"
        data-cy="spinner-routes-connect-apps-page"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
// libraries
import { Notify } from 'quasar';
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// components
import PageHeading from 'src/components/global/PageHeading.vue';

// composables
import { i18n } from 'src/boot/i18n';

// stores
import { useStravaStore } from 'src/stores/strava';

export default defineComponent({
  name: 'RoutesConnectAppsPage',
  components: {
    PageHeading,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const stravaStore = useStravaStore();

    onMounted(async () => {
      const code = route.query.code as string;
      if (!code) {
        Notify.create({
          message: i18n.global.t('routes.messageStravaNoAuthCode'),
          type: 'negative',
        });
        // redirect to routes-app page
        router.push({ name: 'routes-app' });
        return;
      }
      await stravaStore.authAccount(code);
      // redirect to routes-app page
      router.push({ name: 'routes-app' });
    });

    return {
      stravaStore,
    };
  },
});
</script>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
