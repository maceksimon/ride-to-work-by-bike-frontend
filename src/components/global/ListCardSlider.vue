<script lang="ts">
/**
 * ListCardSlider Component
 *
 * The `ListCardSlider` component renders a list of cards in a slider.
 * Commonly used in `ResultsDetailPage`.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the selected component inside a carousel slider. Shows 4 slides per view.
 *
 * @props
 * - `title` (String): The heading or title for the list of offer cards.
 * - `cards` (Array of CardPostType | CardPrizeType, required): An array of card items to be
 *   displayed. Each item is of type `CardPostType | CarPrizeType`.
 * - `cardType` (String): The component to be used to render each card.
 * - `button` (Object of Link type): An object defining the button properties.
 * - `slides` (Number): The number of slides per view on desktop.
 *
 * @components
 * - `CardPost`: Component to render individual post cards.
 * - `SectionHeading`: Component to render section heading.
 *
 * @example
 * <list-card-slider
 *  :title="postsTitle"
 *  :cards="postList"
 *  cardType="CardPost"
 *  :button="buttonDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104622&t=kkfIGnCfHl1zA8Gq-1)
 */

// libraries
import { defineComponent, computed } from 'vue';
import { Screen } from 'quasar';

// components
import CardPost from '../homepage/CardPost.vue';
import CardLocation from './CardLocation.vue';
import CardPrize from './CardPrize.vue';
import SectionHeading from '../global/SectionHeading.vue';

// types
import {
  CardLocationType,
  CardPost as CardPostType,
  CardPrizeType,
  Link,
} from '../types';

export default defineComponent({
  name: 'ListCardSlider',
  components: {
    CardLocation,
    CardPost,
    CardPrize,
    SectionHeading,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array as () =>
        | CardPostType[]
        | CardPrizeType[]
        | CardLocationType[],
      required: true,
    },
    cardType: {
      type: String,
      required: true,
    },
    button: {
      type: Object as () => Link,
      required: false,
    },
    perex: {
      type: String,
      required: false,
      default: '',
    },
    slides: {
      type: Number,
      required: false,
      default: 4,
    },
  },
  setup() {
    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const buttonWidth = computed((): string => {
      return isLargeScreen.value ? 'auto' : '100%';
    });

    return {
      buttonWidth,
    };
  },
});
</script>

<template>
  <div class="relative-position slider" data-cy="list-card-slider">
    <!-- Title -->
    <section-heading class="q-mb-md" data-cy="list-card-slider-title">
      {{ title }}
      <template #perex>
        {{ perex }}
      </template>
    </section-heading>
    <!-- Swiper for cards -->
    <swiper-container
      :navigation="true"
      :slides-per-view="slides"
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
          slidesPerView: slides,
        },
      }"
      data-cy="swiper-container"
    >
      <swiper-slide
        v-for="(card, index) in cards"
        :key="`${card.title}-${index}`"
        class="swiper-slide"
      >
        <component
          :is="cardType"
          :card="card"
          data-cy="list-card-slider-item"
        />
      </swiper-slide>
    </swiper-container>
    <!-- Button: More content -->
    <div
      v-if="button"
      class="absolute-bottom-left full-width text-center q-pt-md"
      data-cy="list-card-slider-buttons"
    >
      <q-btn
        rounded
        unelevated
        outline
        color="grey-10"
        :to="button.url"
        :label="button.title"
        :style="{ width: buttonWidth }"
        data-cy="list-card-slider-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider {
  padding-bottom: 54px;
  overflow: hidden;
}
</style>
