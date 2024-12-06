<script lang="ts">
/**
 * Show current date time
 *
 * @description * Use this component to debug Cypress component/e2e tests
 * Note: Especially if you need change system time via `cy.clock()` command,
 *       required for identification if this campaign competition phase type
 *       is active/inactive
 *
 * @example
 * <show-current-datetime />
 *
 */

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShowCurrentDatetime',
  setup() {
    let datetimeNow;
    if (window.Cypress) datetimeNow = new Date().toLocaleString();

    return {
      datetimeNow,
    };
  },
});
</script>

<template>
  <div>
    <div v-if="datetimeNow" class="text-red text-bold">
      DEBUG: current date time {{ datetimeNow }}
    </div>
  </div>
</template>
