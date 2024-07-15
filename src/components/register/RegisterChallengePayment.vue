<script lang="ts">
/**
 * RegisterChallengePayment Component
 *
 * @description * Use this component to render a payment widget for the
 * registration process.
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormFieldRadioRequired`: Component to render radio buttons.
 *
 * @example
 * <register-challenge-payment />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6485-30201&t=5JpU0wrURbmXLMCm-1)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent, ref } from 'vue';

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'RegisterChallengePayment',
  setup() {
    const { getPaletteColor, lighten } = colors;
    const primaryColor = getPaletteColor('primary');
    const primaryLightColor = lighten(primaryColor, 90);

    const optionsPaymentType: FormOption[] = [
      {
        label: 'Zaplatím startovné',
        value: 'individual',
      },
      {
        label: 'Uplatním voucher',
        value: 'voucher',
      },
      {
        label: 'Platí za mě firma',
        value: 'company',
      },
      {
        label: 'Platí za mě škola',
        value: 'school',
      },
    ];

    const selectedPaymentType = ref<string>('');

    return {
      optionsPaymentType,
      primaryLightColor,
      selectedPaymentType,
    };
  },
});
</script>

<template>
  <div data-cy="register-challenge-payment">
    <!-- Text: Challenge organizer -->
    <div
      v-html="$t('register.challenge.textPaymentOrganizer')"
      data-cy="text-payment-organizer"
    />
    <!-- Banner: Payment minimum -->
    <q-banner
      class="q-pa-md text-primary"
      :style="{ backgroundColor: primaryLightColor }"
      data-cy="banner-payment-minimum"
    >
      <div v-html="$t('register.challenge.textPaymentMinimum')" />
    </q-banner>
    <!-- Input: Payment type -->
    <div class="q-pt-sm">
      <label
        for="paymentType"
        class="text-caption text-weight-medium text-grey-10"
      >
        {{ $t('register.challenge.labelPaymentType') }}
      </label>
      <form-field-radio-required
        inline
        id="paymentType"
        v-model="selectedPaymentType"
        :options="optionsPaymentType"
        class="q-mt-sm"
        data-cy="form-field-payment-type"
      />
    </div>
  </div>
</template>
