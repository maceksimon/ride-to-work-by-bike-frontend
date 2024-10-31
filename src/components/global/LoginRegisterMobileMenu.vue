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
import { computed, defineComponent, ref } from 'vue';

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
    const isOpen = ref(false);
    const icon = computed(() => (isOpen.value ? 'close' : 'menu'));

    const loginStore = useLoginStore();
    const userEmail = computed((): string => loginStore.getUserEmail);

    const { borderRadiusCard: borderRadius, colorWhiteBackgroundOpacity } =
      rideToWorkByBikeConfig;
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity = changeAlpha(white, colorWhiteBackgroundOpacity);
    const border = `1px solid ${whiteOpacity}`;
    const mobileMenuOffsetTop = 20;
    const mobileMenuOffsetRight = 0;

    const onLogout = () => {
      loginStore.logout();
    };

    return {
      border,
      borderRadius,
      icon,
      isOpen,
      mobileMenuOffsetTop,
      mobileMenuOffsetRight,
      onLogout,
      userEmail,
    };
  },
});
</script>

<template>
  <div data-cy="login-register-mobile-menu">
    <!-- Menu button -->
    <q-btn
      unelevated
      round
      color="white"
      text-color="primary"
      :icon="icon"
      data-cy="mobile-menu-button"
    >
      <!-- Menu dropdown -->
      <q-menu
        v-model="isOpen"
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
              <!-- Label -->
              <q-item-label caption data-cy="mobile-menu-user-info-label">
                {{ $t('loginRegisterMobileMenu.labelLoggedInAs') }}
              </q-item-label>
              <!-- Email -->
              <q-item-label
                class="text-weight-bold text-white"
                data-cy="mobile-menu-user-info-email"
              >
                {{ userEmail }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <!-- Separator -->
          <q-separator
            v-if="userEmail"
            dark
            class="q-my-sm"
            data-cy="mobile-menu-separator"
          />
          <!-- Item: Help -->
          <help-button data-cy="mobile-menu-help">
            <template #button="{ openDialog }">
              <!-- Item -->
              <q-item dark clickable @click.prevent="openDialog">
                <q-item-section>
                  {{ $t('loginRegisterMobileMenu.labelHelp') }}
                </q-item-section>
              </q-item>
            </template>
          </help-button>
          <!-- Item: Log out -->
          <q-item
            dark
            clickable
            v-close-popup
            data-cy="mobile-menu-logout"
            @click="onLogout"
          >
            <q-item-section>{{ $t('userSelect.logout') }}</q-item-section>
          </q-item>
          <!-- Separator -->
          <q-separator dark class="q-my-sm" data-cy="mobile-menu-separator" />
          <!-- Language header -->
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
