<script lang="ts">
/**
 * LinearProgressNumbers Component
 *
 * @description * Use this component to render a linear progress bar with
 * labels for numbers.
 *
 * Used in: `CardProgressSlider`
 *
 * @props
 * - `value` (number, required): Value of the progress bar.
 * - `max` (number, required): Max point of the progress bar.
 * - `label` (string, required): Label of the progress bar.
 *
 * @example
 * <linear-progress-numbers :value="10" :max="100" :label="Days" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7102-35017&t=gDCwy7HgWG7zGSPV-1)
 */

// libraries
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'LinearProgressNumbers',
  props: {
    value: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const minWidth = 180;

    const timelineValue = computed((): number => {
      if (!props.value || !props.max) {
        return 0;
      }
      return props.value / props.max;
    });

    return {
      minWidth,
      timelineValue,
    };
  },
});
</script>

<template>
  <div
    class="text-white"
    :style="{ minWidth }"
    data-cy="linear-progress-numbers"
  >
    <!-- Timeline label -->
    <div class="text-subtitle2 text-weight-regular text-center">
      <span class="text-weight-bold" data-cy="linear-progress-numbers-numbers">
        {{ value }} / {{ max }} </span
      >&nbsp;<span data-cy="linear-progress-numbers-label">
        {{ label }}
      </span>
    </div>
    <!-- Timeline progress bar -->
    <q-linear-progress
      class="q-mt-xs"
      :value="timelineValue"
      color="secondary"
      track-color="secondary"
      size="8px"
      rounded
    />
  </div>
</template>
