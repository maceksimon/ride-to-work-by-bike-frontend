import { computed, ref } from 'vue';

// types
import type { Organization } from 'src/components/types/Organization';
import type {
  FormCompanyAddressFields,
  FormSelectTableOption,
} from 'src/components/types/Form';

export const useSelectOrganization = (organizations: Organization[]) => {
  const businessId = ref<string>('');
  const addressId = ref<string | null>(null);

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
   * @returns {FormSelectTableOption[]} - The address options.
   */
  const addressOptions = computed<FormSelectTableOption[]>(() => {
    if (!businessId.value) return [];

    const selectedCompany = organizations.find(
      (company) => company.id === businessId.value,
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
   * @returns {string} - A formatted string representation of the address.
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
    businessId,
    organizationOptions,
  };
};
