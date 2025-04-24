// libraries
import { computed, onBeforeUnmount, ref } from 'vue';
import { date } from 'quasar';

// stores
import { useChallengeStore } from 'src/stores/challenge';

// types
import type { Ref } from 'vue';

/**
 * Computes competition phase states and dates
 * @returns {
 *  isBeforeCompetitionStart: Ref<boolean> - True if before competition starts
 *  isAfterCompetitionEnd: Ref<boolean> - True if after competition ends
 *  competitionStart: Ref<string> - The competition start date string
 *  competitionEnd: Ref<string> - The competition end date string
 * }
 */
export function useCompetitionPhase(): {
  isBeforeCompetitionStart: Ref<boolean>;
  isAfterCompetitionEnd: Ref<boolean>;
  competitionStart: Ref<string>;
  competitionEnd: Ref<string>;
} {
  const checkInterval = 5000;
  const challengeStore = useChallengeStore();
  const currentTime = ref<Date>(new Date());
  const isBeforeCompetitionStart = ref<boolean>(false);
  const isAfterCompetitionEnd = ref<boolean>(false);
  const timeInterval = ref<NodeJS.Timeout>();

  const competitionStart = computed<string>(
    (): string => challengeStore.getCompetitionStart,
  );

  const competitionEnd = computed<string>(
    (): string => challengeStore.getCompetitionEnd,
  );

  const updateTimeCheck = (): void => {
    currentTime.value = new Date();
    // update phase states based on current time
    if (
      !competitionStart.value ||
      !date.isValid(competitionStart.value) ||
      !competitionEnd.value ||
      !date.isValid(competitionEnd.value)
    ) {
      clearInterval(timeInterval.value);
      return;
    }
    const competitionStartDate = new Date(competitionStart.value);
    const competitionEndDate = new Date(competitionEnd.value);
    isBeforeCompetitionStart.value = currentTime.value < competitionStartDate;
    isAfterCompetitionEnd.value = currentTime.value > competitionEndDate;
    // clear interval if we're past competition end
    if (currentTime.value >= competitionEndDate) {
      clearInterval(timeInterval.value);
    }
  };

  // run immediately to set initial state
  updateTimeCheck();
  // set up interval
  timeInterval.value = setInterval(updateTimeCheck, checkInterval);
  onBeforeUnmount(() => {
    clearInterval(timeInterval.value);
  });

  return {
    isBeforeCompetitionStart,
    isAfterCompetitionEnd,
    competitionStart,
    competitionEnd,
  };
}
