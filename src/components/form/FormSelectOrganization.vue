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
import { defineComponent, ref } from 'vue';

// components
import FormFieldSelectTable from '../form/FormFieldSelectTable.vue';
import FormFieldCompanyAddress from '../form/FormFieldCompanyAddress.vue';

// types
import type {
  FormCompanyAddressFields,
  FormSelectTableOption,
} from '../../components/types/Form';

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

    const companyOptions: FormSelectTableOption[] = [
      {
        label: 'Very long company name spanning 3 lines on mobile',
        value: 'company-1',
      },
      {
        label: 'Company 2',
        value: 'company-2',
      },
    ];

    return {
      businessId,
      companyAddress,
      companyOptions,
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
      :options="companyOptions"
      :label="$t('form.company.labelCompany')"
      :label-button="$t('register.challenge.buttonAddCompany')"
      :label-button-dialog="$t('form.company.buttonAddCompany')"
      :title-dialog="$t('form.company.titleAddCompany')"
      data-cy="form-select-table-company"
    />
    <form-field-company-address @update:form-value="onUpdateAddress" />
  </div>
</template>
