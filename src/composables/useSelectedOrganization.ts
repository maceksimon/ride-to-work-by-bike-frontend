import { computed } from 'vue';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Organization } from '../components/types/Organization';
import type { FormSelectTableOption } from 'src/components/types/Form';

export const useSelectedOrganization = (organizations: Organization[]) => {
  // store
  const store = useRegisterChallengeStore();

  const organizationId = computed<number | null>({
    get: (): number | null =>
      store.getOrganizationId ? store.getOrganizationId : null,
    set: (value: number | null) => store.setOrganizationId(value),
  });

  /**
   * Computes the organization options for the select table.
   * @returns {FormSelectTableOption[]} - The organization options.
   */
  const organizationOptions = computed<FormSelectTableOption[]>(() => {
    return organizations.map((organization: Organization) => ({
      label: organization.title,
      value: organization.id,
    }));
  });

  const subsidiaryId = computed<number | null>({
    get: (): number | null => store.getSubsidiaryId,
    set: (value: number | null) => store.setSubsidiaryId(value),
  });

  return {
    organizationId,
    organizationOptions,
    subsidiaryId,
  };
};
