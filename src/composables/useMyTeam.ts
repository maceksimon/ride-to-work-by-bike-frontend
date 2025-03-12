import { computed } from 'vue';
import { useRegisterChallengeStore } from '../stores/registerChallenge';
import { useChallengeStore } from '../stores/challenge';

export function useMyTeam() {
  const registerChallengeStore = useRegisterChallengeStore();
  const challengeStore = useChallengeStore();

  // compute remaining slots in team
  const remainingSlots = computed((): number => {
    const maxTeamMembers = challengeStore.getMaxTeamMembers || 0;
    const myTeam = registerChallengeStore.getMyTeam;
    if (!myTeam) return maxTeamMembers;
    return maxTeamMembers - myTeam.member_count;
  });

  return {
    remainingSlots,
  };
}
