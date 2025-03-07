<script lang="ts">
/**
 * ListCardPost Component
 *
 * The `ListCardPost` component renders a list of cards that showcase
 * various offers. The items are displayed in a 3-column grid.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the `CardPost` component inside a carousel slider. Shows 4 slides per view.
 *
 * @props
 * - `dark` (Boolean): If true, the component will use a dark theme.
 * - `title` (String): The heading or title for the list of offer cards.
 * - `cards` (Array of CardOfferType, required): An array of card items to be
 *   displayed. Each item is of type `CardOfferType`.
 * - `button` (Object of Link type): An object defining the button properties.
 *
 * @components
 * - `CardPost`: Component to render individual post cards.
 * - `SectionHeading`: Component to render a heading.
 *
 * @example
 * <list-card-post
 *  dark
 *  :cards="postList"
 *  :title="postsTitle"
 *  :button="buttonDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105645&mode=dev)
 */

// libraries
import { computed, defineComponent, inject } from 'vue';
import { Screen } from 'quasar';

// components
import CardPost from './CardPost.vue';
import SectionHeading from '../global/SectionHeading.vue';

import { i18n } from '../../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import { CardPost as CardPostType } from '../types';
import type { Logger } from '../types/Logger';

import { defaultLocale } from '../../i18n/def_locale';
import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

export default defineComponent({
  name: 'ListCardPost',
  components: {
    CardPost,
    SectionHeading,
  },
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array as () => CardPostType[],
      required: true,
    },
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const buttonUrl = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlBlog,
        defaultLocale,
        i18n,
      );
    });

    const buttonWidth = computed((): string => {
      return isLargeScreen.value ? 'auto' : '100%';
    });

    return {
      buttonUrl,
      buttonWidth,
    };
  },
});
</script>

<template>
  <div class="relative-position" data-cy="card-list-post">
    <!-- Title -->
    <section-heading class="q-mb-md">
      {{ title }}
    </section-heading>
    <!-- Swiper for news cards -->
    <swiper-container
      :navigation="true"
      :slides-per-view="4"
      :space-between="24"
      :breakpoints="{
        0: {
          slidesPerView: 1.2,
          spaceBetween: 24,
        },
        600: {
          slidesPerView: 2.2,
        },
        1024: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: 4,
        },
      }"
      data-cy="swiper-container"
    >
      <swiper-slide
        v-for="(card, index) in cards"
        :key="`${card.title}-${index}`"
        class="swiper-slide"
      >
        <card-post :card="card" data-cy="card-list-post-item" />
      </swiper-slide>
    </swiper-container>
    <!-- Link to more news -->
    <div class="text-center q-pt-md" data-cy="card-list-post-buttons">
      <q-btn
        rounded
        unelevated
        :outline="!dark"
        color="grey-10"
        :href="buttonUrl"
        target="_blank"
        :label="$t('index.cardListPost.button')"
        :style="{ width: buttonWidth }"
        data-cy="card-list-post-button"
      />
    </div>
  </div>
</template>
