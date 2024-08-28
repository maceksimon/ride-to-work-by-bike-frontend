<script lang="ts">
/**
 * AddressDisplay Component
 *
 * @description * Use this component to display an address.
 * Provides conditional logic for displaying address fields.
 *
 * Used in: `ProfileDetails`
 *
 * @props
 * - `address` (FormCompanyAddressFields, required): The object representing address fields.
 *   It should be of type `FormCompanyAddressFields`.
 *
 * @example
 * <address-display :address="address" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=ksrfZGnblbCWndpG-1)
 */

// libraries
import { defineComponent, computed } from 'vue';

// types
import type { FormCompanyAddressFields } from '../types/Form';

export default defineComponent({
  name: 'AddressDisplay',
  props: {
    address: {
      type: Object as () => FormCompanyAddressFields,
      required: true,
    },
  },
  setup(props) {
    const { address } = props;

    const hasDepartment = computed((): boolean => !!address.department);
    const hasStreet = computed((): boolean => !!address.street);
    const hasHouseNumber = computed((): boolean => !!address.houseNumber);
    const hasZip = computed((): boolean => !!address.zip);
    const hasCity = computed((): boolean => !!address.city);
    const hasCityChallenge = computed((): boolean => !!address.cityChallenge);

    return {
      hasDepartment,
      hasStreet,
      hasHouseNumber,
      hasZip,
      hasCity,
      hasCityChallenge,
    };
  },
});
</script>

<template>
  <div data-cy="address-display">
    <div v-if="hasDepartment" data-cy="address-display-department">
      {{ address.department }}
    </div>
    <div
      v-if="hasStreet || hasHouseNumber"
      data-cy="address-display-street-house-number"
    >
      <template v-if="hasStreet"> {{ address.street }}, </template>
      <template v-if="hasHouseNumber"> {{ address.houseNumber }}, </template>
    </div>
    <div
      v-if="hasZip || hasCity || hasCityChallenge"
      data-cy="address-display-zip-city-challenge"
    >
      <template v-if="hasZip"> {{ address.zip }}, </template>
      <template v-if="hasCity">
        {{ address.city }}
      </template>
      <template v-if="hasCity && hasCityChallenge"> - </template>
      <template v-if="hasCityChallenge">
        {{ address.cityChallenge }}
      </template>
    </div>
  </div>
</template>
