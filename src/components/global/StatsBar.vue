<script lang="ts">
/**
 * StatsBar Component
 *
 * @description * Use this component to display stats.
 *
 * Used in `ListCardProgress`, `SliderProgress`.
 *
 * @props
 * - `stats` (StatsBarType, required): The object representing stats.
 *   It should be of type `StatsBarType`.
 *
 * @example
 * <stats-bar :stats="stats" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7102-35017&t=6Ajku8OtoqJWZx1Q-1)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { StatisticsId } from '../types/Statistics';

// types
import type { ItemStatistics } from '../types/Statistics';

export default defineComponent({
  name: 'StatsBar',
  props: {
    stats: {
      type: Array as () => ItemStatistics[],
      required: true,
    },
  },
  setup() {
    const { borderRadiusCard } = rideToWorkByBikeConfig;

    return {
      borderRadiusCard,
      StatisticsId,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm flex justify-end" data-cy="stats-bar">
    <q-list
      class="flex flex-wrap items-center justify-sm-end q-pa-sm bg-grey-2"
      :style="{ borderRadius: borderRadiusCard }"
      data-cy="stats-bar-list"
    >
      <q-item
        dense
        v-for="item in stats"
        :key="item.icon"
        data-cy="stats-bar-item"
        class="text-grey-10 q-p-none flex items-center"
      >
        <!-- Icon -->
        <q-icon
          :name="item.icon"
          color="primary"
          size="18px"
          class="q-mr-sm"
          data-cy="stats-bar-item-icon"
        />
        <!-- Value -->
        <strong class="text-weight-bold" data-cy="stats-bar-item-value">{{
          item.value
        }}</strong>
        <!-- Label -->
        <span
          v-if="
            item.id === StatisticsId.co2 || item.id === StatisticsId.distance
          "
          data-cy="stats-bar-item-label-unit"
        >
          <template v-if="item.id === StatisticsId.co2"
            >&nbsp;<span v-html="$t('global.carbonDioxideWeightUnit')"
          /></template>
          <template v-if="item.id === StatisticsId.distance"
            >&nbsp;{{ $t('global.routeLengthUnit') }}</template
          >
        </span>
        <span v-if="item.label" data-cy="stats-bar-item-label">
          <span>&nbsp;{{ item.label }}</span>
        </span>
      </q-item>
    </q-list>
  </div>
</template>
