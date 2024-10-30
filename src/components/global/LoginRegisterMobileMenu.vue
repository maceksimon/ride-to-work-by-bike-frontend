<script lang="ts">
/**
 * LoginRegisterMobileMenu Component
 *
 * @description * Use this component to ... .
 * You can adjust its appearance by ... .
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <LoginRegisterMobileMenu></LoginRegisterMobileMenu>
 *
 * @see [Figma Design](...)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginRegisterMobileMenu',
});
</script>

<template>
  <q-btn unelevated round color="white" text-color="primary" icon="menu">
    <q-menu
      class="block"
      anchor="bottom right"
      self="top right"
      :offset="[0, 20]"
    >
      <q-list style="min-width: 80vw">
        <q-item clickable v-close-popup>
          <q-item-section>New tab</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>New incognito tab</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Recent tabs</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>History</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Downloads</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Help &amp; Feedback</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
