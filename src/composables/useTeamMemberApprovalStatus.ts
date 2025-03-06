// composables
import { i18n } from 'src/boot/i18n';

// enums
import { TeamMemberStatus } from '../components/enums/TeamMember';

// types
import type { ExtendedMemberResults } from 'src/components/types/Results';

export const useTeamMemberApprovalStatus = () => {
  const getStatusLabel = (member: ExtendedMemberResults): string => {
    switch (member.approved_for_team) {
      case TeamMemberStatus.approved:
        return i18n.global.t('teamMembersList.approved');
      case TeamMemberStatus.undecided:
        return i18n.global.t('teamMembersList.undecided');
      case TeamMemberStatus.denied:
        return i18n.global.t('teamMembersList.denied');
    }
  };

  const getStatusColor = (member: ExtendedMemberResults): string => {
    switch (member.approved_for_team) {
      case TeamMemberStatus.approved:
        return 'positive';
      case TeamMemberStatus.undecided:
        return 'warning';
      case TeamMemberStatus.denied:
        return 'negative';
    }
  };

  const getStatusIcon = (member: ExtendedMemberResults): string => {
    switch (member.approved_for_team) {
      case TeamMemberStatus.approved:
        return 'check';
      case TeamMemberStatus.undecided:
        return 'help';
      case TeamMemberStatus.denied:
        return 'close';
    }
  };

  return { getStatusLabel, getStatusColor, getStatusIcon };
};
