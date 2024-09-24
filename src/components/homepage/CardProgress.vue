<script lang="ts">
/**
 * CardProgress Component
 *
 * The `CardPost` component displays progress details in a card format.
 *
 * @description
 * This component uses `useCircleSize` composable and presents progress
 * data based on the `card` prop. It can have a default or dark variant.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `ListCardProgress`
 * component.
 *
 * @props
 * - `card` (Object, required): The card object detailing progress.
 *
 * @example
 * <card-progress
 *   :card="progressDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106437&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';
import { useCircleSize } from '../../composables/useCircleSize';

// types
import { CardProgress as CardProgressType, ItemPrize } from '../types';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CardProgress',
  props: {
    card: {
      type: Object as () => CardProgressType,
      required: true,
    },
  },
  setup() {
    const { circleSize } = useCircleSize();

    // first prize card is highlighted
    const isDark = (card: CardProgressType): boolean => {
      const prizes = card.prizes;
      const firstPrize = prizes?.filter(
        (item: ItemPrize): boolean => item.placement === 1,
      ).length;
      return firstPrize ? true : false;
    };

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      circleSize,
      borderRadius,
      isDark,
    };
  },
});
</script>

<template>
  <q-card
    flat
    bordered
    :dark="isDark(card)"
    :style="{ 'border-radius': borderRadius }"
    :class="isDark(card) ? 'bg-primary' : 'bg-white text-primary'"
    data-cy="card"
  >
    <!-- Card body -->
    <q-card-section data-cy="card-progress-body">
      <div class="flex items-center justify-center gap-16 q-pt-sm q-pb-lg">
        <!-- Card icon -->
        <q-icon
          :name="card.icon"
          size="18px"
          :color="isDark(card) ? 'white' : 'primary'"
          data-cy="card-progress-title-icon"
        />
        <!-- Card title -->
        <component
          :is="card.url ? 'a' : 'div'"
          :href="card.url"
          class="text-weight-bold text-body1"
          :class="isDark(card) ? 'text-white' : 'text-primary'"
          data-cy="card-progress-title"
        >
          <h3 class="q-my-none text-body1 text-weight-bold">
            {{ card.title }}
          </h3>
        </component>
      </div>

      <div
        class="gap-16 justify-center items-center q-py-xs"
        data-cy="card-progress-content"
      >
        <div
          class="relative-position flex justify-center"
          data-cy="card-progress-percentage"
        >
          <!-- Progress bar -->
          <q-circular-progress
            rounded
            class="q-mx-auto"
            :value="card.progress"
            :size="circleSize"
            :thickness="0.08"
            color="secondary"
            :track-color="isDark(card) ? 'blue-grey-8' : 'blue-grey-1'"
            data-cy="card-progress-circular"
          >
          </q-circular-progress>
          <!-- Progress label -->
          <div class="absolute-center text-center">
            <!-- Number -->
            <div
              class="circular-progress-number q-mt-xs"
              data-cy="circular-progress-number"
            >
              {{ card.progress }}%
            </div>
          </div>
        </div>
        <!-- Placement list -->
        <q-list dense class="q-mt-lg">
          <q-item
            v-for="(prize, index) in card.prizes"
            :key="'prize' + index"
            class="min-h-36 flex items-center justify-center"
            style="padding: 0"
            data-cy="card-progress-prizes"
          >
            <!-- Icon -->
            <q-icon
              name="svguse:icons/card_progress/icons.svg#winners-cup"
              size="18px"
              color="white"
              class="q-mr-sm"
              data-cy="card-progress-prizes-icon"
            />
            <!-- Label -->
            <div
              class="flex items-baseline text-h6"
              data-cy="card-progress-prize-label"
            >
              <span>{{ prize.placement }}</span
              >.&nbsp;
              <span data-cy="card-progress-prize-label">{{ prize.label }}</span
              >&nbsp;
            </div>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
    <!-- Separator -->
    <q-separator
      :color="isDark(card) ? 'white' : 'blue-grey-3'"
      style="opacity: 0.5"
      class="q-my-sm"
      data-cy="card-progress-separator"
    />
    <!-- Section share -->
    <q-card-section class="q-pt-sm">
      <q-list dense>
        <!-- Share button -->
        <q-item
          clickable
          :to="card.url"
          class="justify-center items-center text-uppercase text-caption text-weight-bold q-py-sm"
          :class="isDark(card) ? 'text-white' : 'text-primary'"
          :style="{ 'border-radius': borderRadius }"
          data-cy="card-progress-share"
        >
          <!-- Icon -->
          <q-icon
            name="svguse:icons/card_progress/icons.svg#share"
            size="18px"
            :color="isDark(card) ? 'white' : 'primary'"
            class="q-mr-xs"
            data-cy="card-progress-share-icon"
          />
          <!-- Label -->
          <span
            class="leading-1"
            :class="isDark(card) ? 'text-white' : 'text-primary'"
            >{{ $t('global.buttonShare') }}</span
          >
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.leading-1 {
  line-height: 1;
}

.z-1 {
  z-index: 1;
}

.rounded-20 {
  border-radius: 20px;
}

.gap-16 {
  gap: 16px;
}

.min-h-36 {
  min-height: 36px;
}
</style>
