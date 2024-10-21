// libraries
import { defineStore } from 'pinia';

// enums
import { PhaseType } from '../components/types/Challenge';

// fixtures
import thisCampaignFixture from '../../test/cypress/fixtures/thisCampaign.json';

// types
import type { Logger } from '../components/types/Logger';
import type { Phase } from '../components/types/Challenge';

const phaseSet = thisCampaignFixture.results[0].phase_set as Phase[] | null;

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    isChallengeActive: true,
    /**
     * Phase set for the current campaign
     * Phase object with id `registration` marks the ability to register.
     * Phase object with id `competition` marks the duration of the challenge.
     * Phase object with id `entry_enabled` marks the ability to log routes.
     * Phase object with id `payment` marks the ability to pay.
     * Phase object with id `invoices` marks the ability to see invoices.
     */
    phaseSet: phaseSet ? phaseSet : [],
  }),

  getters: {
    /**
     * Gets active challenge status
     * Status is based on phase_set array variable.
     * @returns {boolean}
     */
    getIsChallengeActive: (store): boolean => {
      const competitionPhase = store.phaseSet.find(
        (phase: Phase) => phase.phase_type === PhaseType.competition,
      );
      if (competitionPhase) {
        const startDate: number = new Date(
          competitionPhase.date_from,
        ).getTime();
        const endDate: number = new Date(competitionPhase.date_to).getTime();
        const now: number = new Date().getTime();
        return now >= startDate && now <= endDate;
      }
      return false;
    },
  },

  actions: {},

  persist: {
    pick: ['phaseSet', 'isChallengeActive'],
  },
});
