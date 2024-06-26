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
    :flat="true"
    :dark="isDark(card)"
    :bordered="true"
    :style="{ 'border-radius': borderRadius }"
    :class="
      isDark(card) ? 'bg-blue-grey-6 text-white' : 'bg-white text-grey-10'
    "
    data-cy="card"
  >
    <!-- Card header -->
    <q-card-section
      class="flex items-center justify-center gap-16 z-1"
      data-cy="card-progress-header"
    >
      <div class="flex items-center gap-16 text-body1">
        <!-- Card icon -->
        <q-icon
          :name="card.icon"
          size="18px"
          :color="isDark(card) ? 'white' : 'blue-grey-5'"
        />
        <!-- Card title -->
        <component
          :is="card.url ? 'a' : 'div'"
          :href="card.url"
          class="text-weight-bold"
          :class="isDark(card) ? 'text-white' : 'text-grey-10'"
          data-cy="card-progress-title"
        >
          <h3 class="text-body1 text-weight-bold">{{ card.title }}</h3>
        </component>
      </div>
    </q-card-section>

    <!-- Section progress -->
    <q-card-section>
      <div
        class="gap-16 justify-center items-center"
        data-cy="card-progress-content"
      >
        <div
          class="relative-position flex justify-center"
          data-cy="card-progress-percentage"
        >
          <!-- Progress bar -->
          <q-circular-progress
            rounded
            class="q-my-md q-mx-auto"
            :value="card.progress"
            :size="circleSize"
            :thickness="0.08"
            :color="isDark(card) ? 'white' : 'blue-grey-6'"
            :track-color="isDark(card) ? 'blue-grey-4' : 'blue-grey-2'"
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
        <!-- Prizes list -->
        <q-list dense class="q-mb-sm">
          <q-item
            v-for="(prize, index) in card.prizes"
            :key="'prize' + index"
            class="min-h-36 flex items-center justify-center"
            style="padding: 0"
            data-cy="card-progress-prizes"
          >
            <q-icon
              :name="prize.icon"
              size="24px"
              color="white"
              data-cy="card-progress-prizes-icon"
            />&nbsp;
            <div class="flex items-baseline">
              <span
                class="text-weight-bold"
                :class="{ 'text-h5': isDark(card) }"
                data-cy="card-progress-prize-placement"
                >{{ prize.placement }}</span
              >.&nbsp;
              <span data-cy="card-progress-prize-label">{{ prize.label }}</span
              >&nbsp;
            </div>
          </q-item>
        </q-list>
      </div>

      <q-separator
        :color="isDark(card) ? 'blue-grey-7' : 'blue-grey-1'"
        data-cy="card-progress-separator"
      />

      <!-- Section share -->
      <q-list dense class="q-mt-md">
        <!-- Share button -->
        <q-item
          clickable
          :to="card.url"
          class="justify-center items-center text-uppercase text-weight-bold q-py-sm"
          :class="isDark(card) ? 'text-white' : 'text-grey-10'"
          :style="{ 'border-radius': borderRadius }"
          data-cy="card-progress-share"
        >
          <!-- Icon -->
          <q-icon
            name="share"
            size="18px"
            :color="isDark(card) ? 'white' : 'grey-10'"
            class="q-mr-xs"
            data-cy="card-progress-share-icon"
          />
          <!-- Label -->
          <span
            class="leading-1"
            :class="isDark(card) ? 'text-white' : 'text-grey-10'"
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
