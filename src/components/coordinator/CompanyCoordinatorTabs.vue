<script lang="ts">
/**
 * CompanyCoordinatorTabs Component
 *
 * @description * Use this component to render tabs on Company Coordinator
 * page.
 *
 * @components
 * - `CompanyCoordinatorTasks`: Component to render content for tab "Tasks".
 *
 * @example
 * <company-coordinator-tabs />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=LjkTjDUR2TkIA3fl-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CompanyCoordinatorTabs',
  setup() {
    const activeTab = ref('');

    return {
      activeTab,
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
      <!-- Tab: Tasks -->
      <q-route-tab
        :to="routesConf['routes_calendar'].path"
        name="calendar"
        icon="mdi-calendar-blank"
        :label="$t('routes.tabCalendar')"
        data-cy="route-tabs-button-calendar"
      />
      <!-- Tab: Fees -->
      <q-route-tab
        :to="routesConf['routes_list'].path"
        name="list"
        icon="mdi-format-list-bulleted"
        :label="$t('routes.tabList')"
        data-cy="route-tabs-button-list"
      />
      <q-route-tab
        :to="routesConf['routes_map'].path"
        name="map"
        icon="mdi-map"
        alert-icon="mdi-lock"
        :label="$t('routes.tabMap')"
        data-cy="route-tabs-button-map"
      />
      <q-route-tab
        :to="routesConf['routes_app'].path"
        name="app"
        icon="mdi-cellphone"
        alert-icon="mdi-lock"
        :label="$t('routes.tabApp')"
        data-cy="route-tabs-button-app"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Tasks -->
      <q-tab-panel name="tasks" data-cy="route-tabs-panel-tasks">
        <div class="text-h6">{{ $t('routes.tabTasks') }}</div>
      </q-tab-panel>
      <!-- Panel: Fees -->
      <q-tab-panel name="fees" data-cy="route-tabs-panel-fees">
        <div class="text-h6">{{ $t('routes.tabFees') }}</div>
      </q-tab-panel>
      <!-- Panel: Invoices -->
      <q-tab-panel name="invoices" data-cy="route-tabs-panel-invoices">
        <div class="text-h6">{{ $t('routes.tabInvoices') }}</div>
      </q-tab-panel>
      <!-- Panel: Packages -->
      <q-tab-panel name="packages" data-cy="route-tabs-panel-packages">
        <div class="text-h6">{{ $t('routes.tabPackages') }}</div>
      </q-tab-panel>
      <!-- Panel: Participation -->
      <q-tab-panel
        name="participation"
        data-cy="route-tabs-panel-participation"
      >
        <div class="text-h6">{{ $t('routes.tabParticipation') }}</div>
      </q-tab-panel>
      <!-- Panel: Company challenges -->
      <q-tab-panel
        name="company-challenges"
        data-cy="route-tabs-panel-company-challenges"
      >
        <div class="text-h6">{{ $t('routes.tabCompanyChallenges') }}</div>
      </q-tab-panel>
      <!-- Panel: Results -->
      <q-tab-panel name="results" data-cy="route-tabs-panel-results">
        <div class="text-h6">{{ $t('routes.tabResults') }}</div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
