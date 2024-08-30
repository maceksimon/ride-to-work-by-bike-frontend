<script lang="ts">
/**
 * FormSelectOrganization Component
 *
 * @description * Use this component to render a widget for selecting an
 * organization and branch address.
 *
 * Used in `RegisterChallengePage`.
 *
 * @components
 * - `FormFieldSelectTable`: Component to render a table of organizations.
 * - `FormFieldCompanyAddress`: Component to render a form for company address.
 *
 * @example
 * <form-select-organization />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6485-29122&t=WSuLWOqmq7XPPNnt-1)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// components
import FormFieldSelectTable from '../form/FormFieldSelectTable.vue';
import FormFieldCompanyAddress from '../form/FormFieldCompanyAddress.vue';

// fixtures
import formOrganizationOptions from '../../../test/cypress/fixtures/formOrganizationOptions.json';

// types
import type {
  FormCompanyAddressFields,
  FormSelectTableOption,
} from '../../components/types/Form';
import { Organization } from '../types/Organization';

export default defineComponent({
  name: 'FormSelectOrganization',
  components: {
    FormFieldSelectTable,
    FormFieldCompanyAddress,
  },
  setup() {
    const businessId = ref<string>('');
    const companyAddress = ref<FormCompanyAddressFields | null>(null);

    const onUpdateAddress = (val: FormCompanyAddressFields) => {
      companyAddress.value = val;
    };

    const companyOptions: Organization[] =
      formOrganizationOptions as Organization[];

    const selectTableOptions = computed<FormSelectTableOption[]>(() => {
      return companyOptions.map((organization: Organization) => ({
        label: organization.title,
        value: organization.id,
      }));
    });

    const addressOptions = computed<FormSelectTableOption[]>(() => {
      if (!businessId.value) return [];

      const selectedCompany = companyOptions.find(
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
      addressOptions,
      businessId,
      companyAddress,
      companyOptions,
      selectTableOptions,
      onUpdateAddress,
    };
  },
});
</script>

<template>
  <div>
    <form-field-select-table
      variant="company"
      v-model="businessId"
      :options="selectTableOptions"
      :label="$t('form.company.labelCompany')"
      :label-button="$t('register.challenge.buttonAddCompany')"
      :label-button-dialog="$t('form.company.buttonAddCompany')"
      :title-dialog="$t('form.company.titleAddCompany')"
      data-cy="form-select-table-company"
    />
    <form-field-company-address
      :options="addressOptions"
      @update:form-value="onUpdateAddress"
    />
  </div>
</template>
