<script lang="ts">
/**
 * CountdownChallenge Component
 *
 * The `CountdownChallenge` displays a countdown to the end of the challenge.
 *
 * @description * Use this component to display countdown when the challenge
 * is about to end.
 *
 * Note: This component is commonly used on Homepage.
 *
 * @props
 * - `dateEnd` (String, required): Date when challenge ends.
 *   It should be a string represenation of date object.
 *
 * @example
 * <countdown-challenge />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22987&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent } from 'vue';

// composables
import { useCountdown } from '../../composables/useCountdown';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CountdownChallenge',
  props: {
    dateEnd: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { countdown } = useCountdown(computed(() => props.dateEnd));

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const secondary = getPaletteColor('secondary');
    const secondaryOpacity = changeAlpha(
      secondary,
      rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      countdown,
      secondaryOpacity,
    };
  },
});
</script>

<template>
  <div
    class="q-pa-lg text-grey-10"
    :style="{
      backgroundColor: secondaryOpacity,
      borderRadius,
    }"
    data-cy="countdown-challenge"
  >
    <h2
      class="q-my-md text-center text-h6 text-bold"
      data-cy="countdown-challenge-title"
    >
      {{ $t('index.countdownChallenge.title', countdown.days) }}
      <span data-cy="countdown-days">{{ countdown.days }}</span>
      {{ $t('time.day', countdown.days) }}
      <span data-cy="countdown-hours">{{ countdown.hours }}</span>
      {{ $t('time.hourShort') }}
      <span data-cy="countdown-minutes">{{ countdown.minutes }}</span>
      {{ $t('time.minuteShort') }}
      <span data-cy="countdown-seconds">{{ countdown.seconds }}</span>
      {{ $t('time.secondShort') }}
    </h2>
  </div>
</template>
