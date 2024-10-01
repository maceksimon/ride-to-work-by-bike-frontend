<template>
  <q-page class="overflow-hidden bg-white" data-cy="q-main">
    <div class="q-px-lg q-pt-lg">
      <page-heading data-cy="routes-page-title">
        {{ $t('routes.titleRoutes') }}
        <template #secondary>
          <div data-cy="routes-page-instructions">
            <p>{{ $t('routes.instructionRouteLogTimeframe') }}</p>
            <p class="q-mb-none">
              {{ $t('routes.instructionRouteCombination') }}
            </p>
          </div>
        </template>
      </page-heading>
    </div>
    <route-tabs data-cy="route-tabs" />
  </q-page>
</template>

<script lang="ts">
// libraries
import { defineComponent } from 'vue';

// components
import PageHeading from 'src/components/global/PageHeading.vue';
import RouteTabs from 'src/components/routes/RouteTabs.vue';

export default defineComponent({
  name: 'RoutesPage',
  components: {
    RouteTabs,
    PageHeading,
  },
});
</script>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
