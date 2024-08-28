import { computed } from 'vue';
import { Screen } from 'quasar';

const isMediumScreen = computed((): boolean => {
  return Screen.gt.xs;
});

const isLargeScreen = computed((): boolean => {
  return Screen.gt.md;
});

export function useCircleSize() {
  const circleSize = computed((): string => {
    let size = '128px';
    size = isMediumScreen.value ? '180px' : size;
    size = isLargeScreen.value ? '220px' : size;
    return size;
  });

  const trackWidth = computed((): number => {
    let size = 0.1;
    size = isLargeScreen.value ? 0.2 : size;
    return size;
  });

  return {
    circleSize,
    trackWidth,
  };
}
