<script lang="ts">
// libraries
import { defineComponent } from 'vue';
import { i18n } from '../boot/i18n';

// import components
import DrawerHeader from 'components/global/DrawerHeader.vue';
import DrawerMenu from 'components/global/DrawerMenu.vue';
import DrawerToggleButtons from 'src/components/global/DrawerToggleButtons.vue';
import FooterBar from 'components/global/FooterBar.vue';
import MobileBottomPanel from 'components/global/MobileBottomPanel.vue';
import UserSelect from 'components/global/UserSelect.vue';

// mocks
import { menuBottom, menuTop } from '../mocks/layout';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

declare global {
  interface Window {
    i18n: typeof i18n;
  }
}

// set global i18n object (for test purposes)
if (window.Cypress) {
  window.i18n = i18n;
}

export default defineComponent({
  name: 'MainLayout',
  components: {
    DrawerHeader,
    DrawerMenu,
    DrawerToggleButtons,
    FooterBar,
    MobileBottomPanel,
    UserSelect,
  },
  setup() {
    const { containerContentWidth } = rideToWorkByBikeConfig;
    return {
      containerContentWidth,
      menuBottom,
      menuTop,
    };
  },
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Top bar: (mobile) -->
    <q-header reveal class="lt-md bg-white">
      <q-toolbar>
        <!-- Logo + Buttons (help, notification) -->
        <drawer-header
          mobile
          :show-logo="false"
          :show-drawer-open-button="true"
          data-cy="drawer-header-mobile"
        >
        </drawer-header>
      </q-toolbar>
    </q-header>

    <!-- Left-side drawer (desktop) -->
    <q-drawer
      show-if-above
      side="left"
      :width="320"
      class="gt-sm bg-primary q-py-lg"
      data-cy="q-drawer"
    >
      <div class="q-px-lg">
        <!-- Logo + Buttons (help, notification) -->
        <drawer-header data-cy="drawer-header" />
        <!-- User options dropdown -->
        <user-select class="q-pt-lg" data-cy="user-select-desktop" />
        <drawer-toggle-buttons
          class="q-pt-lg"
          data-cy="drawer-toggle-buttons"
        />
      </div>
      <!-- Navigation menu -->
      <drawer-menu :items="menuTop" class="q-pt-lg" data-cy="drawer-menu-top" />
      <q-separator color="blue-grey-2 q-my-sm q-mx-lg" />
      <drawer-menu :items="menuBottom" data-cy="drawer-menu-bottom" />
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view :style="{ 'max-width': containerContentWidth }" />
      <!-- Footer content (desktop) -->
      <footer-bar />
    </q-page-container>
    <!-- Footer content (mobile) -->
    <q-footer class="position-static md-position-absolute bg-transparent">
      <mobile-bottom-panel />
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
.md-absolute-bottom {
  @media (min-width: $breakpoint-md-min) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.position-static {
  position: static;
}

.md-position-absolute {
  @media (min-width: $breakpoint-md-min) {
    position: absolute;
  }
}

.pb-footer {
  padding-bottom: 420px !important;

  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 320px !important;
  }
}
</style>
