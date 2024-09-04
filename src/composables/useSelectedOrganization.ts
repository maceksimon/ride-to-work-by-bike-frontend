import { computed } from 'vue';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Organization } from '../components/types/Organization';
import type {
  FormCompanyAddressFields,
  FormSelectTableOption,
} from 'src/components/types/Form';

export const useSelectedOrganization = (organizations: Organization[]) => {
  // store
  const store = useRegisterChallengeStore();

  const organizationId = computed({
    get: (): string => store.getOrganizationId,
    set: (value: string) => store.setFormOrganizationId(value),
  });

  const addressId = computed({
    get: (): string => store.getAddressId,
    set: (value: string) => store.setFormAddressId(value),
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

  /**
   * Computes the address options for the address select
   * based on the selected business id.
   * @returns {FormSelectTableOption[]} - The address options or empty array.
   */
  const addressOptions = computed<FormSelectTableOption[]>(() => {
    if (!organizationId.value) return [];

    const selectedCompany = organizations.find(
      (company) => company.id === organizationId.value,
    );
    if (!selectedCompany) return [];

    return selectedCompany.divisions.map((division) => ({
      label: getAddressString(division.address),
      value: division.id,
    }));
  });

  /**
   * Get a formatted address string from the provided address object.
   * @param {FormCompanyAddressFields | undefined} address - The address object.
   * @returns {string} - Formatted string representation of the address or
   * empty string.
   */
  function getAddressString(
    address: FormCompanyAddressFields | undefined,
  ): string {
    if (!address) return '';

    const parts = [
      address.street,
      address.houseNumber,
      address.city,
      address.zip,
      address.cityChallenge,
      address.department,
    ].filter(Boolean);

    return parts.join(', ');
  }

  return {
    addressId,
    addressOptions,
    organizationId,
    organizationOptions,
  };
};
