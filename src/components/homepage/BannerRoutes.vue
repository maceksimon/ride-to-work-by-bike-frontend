<script lang="ts">
/**
 * BannerRoutes Component
 *
 * The `BannerRoutes` component acts as a reminder to log biking routes.
 *
 * @description
 * Displayed as a banner, this component highlights the number of biking routes
 * that have not been logged by the user.
 *
 *
 * @props
 * - `routesCount` (Number, required): The number of biking routes that are yet
 *   to be logged by the user.
 * - `variant` (String: 'default' | 'start', required): Determines the
 *   appearance based on whether user has already started logging routes.
 *
 * @example
 * <banner-routes
 *   :routesCount="unloggedRoutesCount"
 * />
 *
 * @see
 * [Figma Design - default](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22990&mode=dev)
 * [Figma Design - start](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103951&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

export default defineComponent({
  name: 'BannerRoutes',
  props: {
    routesCount: {
      type: Number,
      required: true,
    },
    variant: {
      type: String as () => 'default' | 'start',
      required: true,
    },
  },
  setup() {
    const { borderRadiusCard, colorSecondaryOpacity } = rideToWorkByBikeConfig;

    return {
      borderRadiusCard,
      colorSecondaryOpacity,
    };
  },
});
</script>

<template>
  <div
    class="text-grey-10"
    :class="[variant === 'default' ? 'q-py-sm' : 'q-py-lg']"
    :style="`border-radius: ${borderRadiusCard}; background-color: ${colorSecondaryOpacity}`"
    data-cy="banner-routes-card"
  >
    <div class="row justify-between">
      <!-- Title -->
      <div
        class="col-12 flex items-center q-py-sm q-px-xl"
        :class="[variant === 'default' ? 'col-md-8' : 'justify-center']"
        data-cy="banner-routes-section-title"
      >
        <h3
          class="text-h5 text-weight-bold q-my-none"
          data-cy="banner-routes-title"
        >
          <span v-if="variant === 'default'">
            <!-- TODO: fix conjugation in CZ and SK -->
            {{
              $tc('index.bannerRoutes.title', routesCount, { n: routesCount })
            }}
          </span>
          <span v-else-if="variant === 'start'">
            {{ $t('index.bannerRoutes.titleStart') }}
          </span>
        </h3>
      </div>
      <!-- Link to Route log -->
      <div
        class="col-12 flex items-center justify-end q-py-sm q-px-xl"
        :class="[variant === 'default' ? 'col-md-4' : 'justify-center']"
        data-cy="banner-routes-section-button"
      >
        <q-btn
          rounded
          unelevated
          color="primary"
          size="16px"
          text-color="white"
          class="q-pa-md q-pl-lg q-pr-lg text-weight-bold"
          data-cy="banner-routes-button-add-routes"
        >
          <!-- Plus icon -->
          <q-icon
            name="add"
            size="24px"
            color="white"
            class="q-mr-sm"
            data-cy="banner-routes-button-icon"
          />
          <!-- Button text -->
          <span v-if="variant === 'default'" class="inline-block q-px-sm">
            {{ $t('index.bannerRoutes.addRoutes') }}
          </span>
          <span v-else-if="variant == 'start'">
            {{ $t('index.bannerRoutes.addFirstRoutes') }}
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-wrap {
  flex-wrap: wrap;
}
</style>
