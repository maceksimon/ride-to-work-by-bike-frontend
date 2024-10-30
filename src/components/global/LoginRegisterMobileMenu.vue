<script lang="ts">
/**
 * LoginRegisterMobileMenu Component
 *
 * @description * Use this component to render a mobile dropdown menu in
 * `LoginRegisterHeader` component.
 * Note: It should be rendered only on mobile devices and only on pages
 * using the `LoginRegisterLayout`.
 *
 * @components
 * - `HelpButton`: Component to render help icon with dialog.
 *
 * @example
 * <login-register-mobile-menu />
 *
 * @see
 * [Figma Design: Variant Logged out](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=1074-15529&t=4UqwJpgG48utdVoI-1)
 * [Figma Design: Variant Logged in](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=1174-15287&t=4UqwJpgG48utdVoI-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import HelpButton from './HelpButton.vue';

export default defineComponent({
  name: 'LoginRegisterMobileMenu',
  components: {
    HelpButton,
  },
  setup() {
    const mobileMenuOffsetTop = 20;
    const mobileMenuOffsetRight = 0;

    return {
      mobileMenuOffsetTop,
      mobileMenuOffsetRight,
    };
  },
});
</script>

<template>
  <q-btn unelevated round color="white" text-color="primary" icon="menu">
    <q-menu
      class="block"
      anchor="bottom right"
      self="top right"
      :offset="[mobileMenuOffsetRight, mobileMenuOffsetTop]"
    >
      <q-list style="min-width: 80vw">
        <help-button>
          <template #button="{ openDialog }">
            <q-item clickable @click.prevent="openDialog">
              <q-item-section>New tab</q-item-section>
            </q-item>
          </template>
        </help-button>
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
