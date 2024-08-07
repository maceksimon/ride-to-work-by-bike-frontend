<script lang="ts">
/**
 * ProfileTabs Component
 *
 * @description * Use this component to render tabs on the Profile page.
 * Note: Used on `ProfilePage`.
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <profile-tabs />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=X2rh1VOnQ1CkvTqG-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// routes
import { routesConf } from 'src/router/routes_conf';

type ProfileTabsOption = 'details' | 'forms' | 'newsletter' | 'notifications';

export default defineComponent({
  name: 'ProfileTabs',
  setup() {
    const activeTab = ref('' as ProfileTabsOption);

    return {
      activeTab,
      routesConf,
    };
  },
});
</script>

<template>
  <div>
    <!-- Tab buttons -->
    <q-tabs
      inline-label
      v-model="activeTab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="route-tabs"
    >
      <q-route-tab
        :to="routesConf['profile_details'].path"
        name="details"
        :label="$t('profile.tabDetails')"
        data-cy="route-tabs-button-details"
      />
      <q-route-tab
        :to="routesConf['profile_forms'].path"
        name="forms"
        :label="$t('profile.tabForms')"
        data-cy="route-tabs-button-forms"
      />
      <q-route-tab
        :to="routesConf['profile_newsletter'].path"
        name="newsletter"
        :label="$t('profile.tabNewsletter')"
        data-cy="route-tabs-button-newsletter"
      />
      <q-route-tab
        :to="routesConf['profile_notifications'].path"
        name="notifications"
        :label="$t('profile.tabNotifications')"
        data-cy="route-tabs-button-notifications"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator class="q-mx-lg" />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Details -->
      <q-tab-panel
        class="q-px-lg"
        name="details"
        data-cy="route-tabs-panel-details"
      >
        Personal details
      </q-tab-panel>
      <!-- Panel: Forms -->
      <q-tab-panel
        class="q-px-lg"
        name="forms"
        data-cy="route-tabs-panel-forms"
      >
        Forms
      </q-tab-panel>
      <!-- Panel: Newsletter -->
      <q-tab-panel
        class="q-px-lg"
        name="newsletter"
        data-cy="route-tabs-panel-newsletter"
      >
        Newsletter
      </q-tab-panel>
      <!-- Panel: Notifications -->
      <q-tab-panel
        class="q-px-lg"
        name="notifications"
        data-cy="route-tabs-panel-notifications"
      >
        Notifications
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
