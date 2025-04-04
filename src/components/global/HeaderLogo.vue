<script lang="ts">
/**
 * HeaderLogo Component
 *
 * The `HeaderLogo` component displays the application logo in the header,
 * typically used as a home button.
 *
 * @description
 * This component renders a clickable logo image that navigates to the home page
 * when clicked.
 * Note: Used in `DrawerHeader` component.
 *
 * @props
 * - `width` (string): logo image width.
 * - `height` (string): logo image height.
 * - `url` (string, default: null): logo image URL link.
 *
 * @example
 * <header-logo />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=nCt4lu0QQsQLD8oQ-1)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'HeaderLogo',
  props: {
    width: {
      type: String,
      default: '140px',
    },
    height: {
      type: String,
      default: '40px',
    },
    url: {
      type: [String, null],
      default: null,
    },
  },
  setup(props) {
    const { url } = props;
    let linkUrl;
    linkUrl = url ? url : rideToWorkByBikeConfig.urlRTWBBLogo;
    return {
      linkUrl,
    };
  },
});
</script>

<template>
  <q-btn
    flat
    no-caps
    :href="linkUrl"
    class="q-pa-none"
    data-cy="header-logo-button"
  >
    <q-img
      :width="width"
      :height="height"
      fit="contain"
      src="~assets/svg/logo-white.svg"
      :alt="$t('index.logoAltText')"
      data-cy="header-logo-image"
    />
  </q-btn>
</template>
