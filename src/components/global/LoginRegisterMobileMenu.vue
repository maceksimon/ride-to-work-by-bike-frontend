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
 * - `LanguageSwitcher`: Component to render language switcher.
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
import LanguageSwitcher from './LanguageSwitcher.vue';

export default defineComponent({
  name: 'LoginRegisterMobileMenu',
  components: {
    HelpButton,
    LanguageSwitcher,
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
      <q-list style="min-width: 80vw" class="q-py-sm">
        <!-- Logged in info -->
        <q-item class="text-center">
          <q-item-section>
            <q-item-label caption>Jste přihlášeni jako</q-item-label>
            <q-item-label class="text-weight-bold text-primary"
              >anonym@dopracenakole.cz</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />
        <!-- Item: Help -->
        <help-button>
          <template #button="{ openDialog }">
            <q-item clickable @click.prevent="openDialog">
              <q-item-section>{{ 'Nápověda' }}</q-item-section>
            </q-item>
          </template>
        </help-button>
        <!-- Item: Log out -->
        <q-item clickable v-close-popup>
          <q-item-section>Odhlásit se</q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />
        <q-item v-close-popup>
          <!-- Item: Language switcher -->
          <language-switcher
            variant="light"
            class="q-py-none q-my-none"
            style="padding: 0"
          />
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
