<script lang="ts">
/**
 * CardChallenge Component
 *
 * The `CardChallenge` component displays a challenge card with relevant details.
 *
 * @description
 * This component presents information about a challenge within the biking
 * initiative. The card may contain an image, title, and other details.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `SectionColumns`
 * component.
 *
 * @props
 * - `card` (Object, required): The card object with details for display. It should be of
 *   type `CardChallengeType`.
 *
 * @example
 * <card-challenge
 *   :card="challengeDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105617&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import { CardChallenge as CardChallengeType } from '../types';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CardChallenge',
  props: {
    card: {
      type: Object as () => CardChallengeType,
      required: true,
    },
  },
  setup() {
    const badgeMargin = '-12px';
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    return { badgeMargin, borderRadius };
  },
});
</script>

<template>
  <q-card
    dark
    flat
    bordered
    data-cy="card"
    :style="{ 'border-radius': borderRadius }"
  >
    <!-- Bg image -->
    <q-img
      :img-style="{ borderRadius: borderRadius }"
      :src="card?.image?.src"
      :alt="card?.image?.alt"
      :ratio="7 / 8"
    >
      <!-- Gradient overlay -->
      <div
        class="absolute-full gradient-overlay"
        :style="{
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }"
        data-cy="card-gradient-overlay"
      ></div>

      <!-- Header -->
      <q-card-section
        class="text-subtitle1 absolute-top flex items-center justify-center gap-8 bg-primary"
        data-cy="card-title"
      >
        <!-- Person icon -->
        <q-icon class="q-py-sm" name="person" size="xs" />
        <!-- Title link -->
        <component
          :is="card?.url ? 'a' : 'div'"
          :href="card?.url"
          class="text-white text-weight-bold q-py-sm"
          data-cy="card-link"
        >
          {{ card?.title }}
        </component>
      </q-card-section>
    </q-img>

    <!-- Date -->
    <q-card-section
      v-if="card?.dates"
      class="absolute-bottom text-center text-body2"
      data-cy="card-dates"
    >
      {{ $t('index.cardChallenge.dates') }}
      <span class="text-weight-bold" data-cy="card-dates-date">{{
        card?.dates
      }}</span>
    </q-card-section>

    <!-- Company challenge label -->
    <div
      class="absolute-top flex justify-center"
      :style="{ top: badgeMargin }"
      data-cy="card-company-wrapper"
    >
      <q-badge
        v-if="card?.company"
        class="text-caption text-weight-bold q-px-sm"
        text-color="primary"
        color="secondary"
        rounded
        data-cy="card-company"
      >
        {{ $t('index.cardChallenge.company') }}
      </q-badge>
    </div>
  </q-card>
</template>

<style scoped>
a:hover {
  text-decoration: none;
}

.gradient-overlay {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 69%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
}
</style>
