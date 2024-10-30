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
import { colors } from 'quasar';
import { computed, defineComponent } from 'vue';

// components
import HelpButton from './HelpButton.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useLoginStore } from '../../stores/login';

export default defineComponent({
  name: 'LoginRegisterMobileMenu',
  components: {
    HelpButton,
    LanguageSwitcher,
  },
  setup() {
    const mobileMenuOffsetTop = 20;
    const mobileMenuOffsetRight = 0;

    const loginStore = useLoginStore();
    const userEmail = computed((): string => loginStore.getUserEmail);
    const { borderRadiusCard: borderRadius, colorWhiteBackgroundOpacity } =
      rideToWorkByBikeConfig;
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity = changeAlpha(white, colorWhiteBackgroundOpacity);
    const border = `1px solid ${whiteOpacity}`;

    return {
      border,
      borderRadius,
      mobileMenuOffsetTop,
      mobileMenuOffsetRight,
      userEmail,
    };
  },
});
</script>

<template>
  <div data-cy="login-register-mobile-menu">
    <q-btn
      unelevated
      round
      color="white"
      text-color="primary"
      icon="menu"
      data-cy="mobile-menu-button"
    >
      <q-menu
        dark
        class="block bg-primary"
        anchor="bottom right"
        self="top right"
        :offset="[mobileMenuOffsetRight, mobileMenuOffsetTop]"
        :style="{ border, borderRadius }"
        data-cy="mobile-menu-dropdown"
      >
        <q-list dark style="min-width: 80vw" class="q-py-sm">
          <!-- Logged in info -->
          <q-item
            dark
            v-if="userEmail"
            class="text-center"
            data-cy="mobile-menu-user-info"
          >
            <q-item-section>
              <q-item-label caption data-cy="mobile-menu-user-info-label">
                {{ $t('loginRegisterMobileMenu.labelLoggedInAs') }}
              </q-item-label>
              <q-item-label
                class="text-weight-bold text-primary"
                data-cy="mobile-menu-user-info-email"
              >
                {{ userEmail }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="userEmail" dark class="q-my-sm" />
          <!-- Item: Help -->
          <help-button data-cy="mobile-menu-help">
            <template #button="{ openDialog }">
              <q-item dark clickable @click.prevent="openDialog">
                <q-item-section>{{
                  $t('loginRegisterMobileMenu.labelHelp')
                }}</q-item-section>
              </q-item>
            </template>
          </help-button>
          <!-- Item: Log out -->
          <q-item dark clickable v-close-popup data-cy="mobile-menu-logout">
            <q-item-section>{{
              $t('loginRegisterMobileMenu.labelLogOut')
            }}</q-item-section>
          </q-item>
          <q-separator dark class="q-my-sm" />
          <q-item-label header data-cy="mobile-menu-language-header">
            {{ $t('loginRegisterMobileMenu.labelLanguage') }}
          </q-item-label>
          <q-item dark v-close-popup data-cy="mobile-menu-language-switcher">
            <!-- Item: Language switcher -->
            <language-switcher
              variant="light"
              class="q-py-none q-my-none"
              data-cy="language-switcher"
            />
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
