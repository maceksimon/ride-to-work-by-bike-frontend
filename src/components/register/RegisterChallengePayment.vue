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
 * - `FormFieldSliderNumber`: Component to render number input with slider.
 *
 * @example
 * <register-challenge-payment />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6485-30201&t=5JpU0wrURbmXLMCm-1)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent, ref, watch } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// components
import FormFieldRadioRequired from 'components/form/FormFieldRadioRequired.vue';
import FormFieldSliderNumber from 'components/form/FormFieldSliderNumber.vue';

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'RegisterChallengePayment',
  components: {
    FormFieldRadioRequired,
    FormFieldSliderNumber,
  },
  setup() {
    const { getPaletteColor, lighten } = colors;
    const primaryColor = getPaletteColor('primary');
    const primaryLightColor = lighten(primaryColor, 90);

    const optionsPaymentAmount: FormOption[] = [
      {
        label: '390 Kč',
        value: '390',
      },
      {
        label: '500 Kč',
        value: '500',
      },
      {
        label: '700 Kč',
        value: '700',
      },
      {
        label: 'Vlastní',
        value: 'custom',
      },
    ];

    const optionsPaymentSubject: FormOption[] = [
      {
        label: i18n.global.t(
          'register.challenge.labelPaymentSubjectIndividual',
        ),
        value: 'individual',
      },
      {
        label: i18n.global.t('register.challenge.labelPaymentSubjectVoucher'),
        value: 'voucher',
      },
      {
        label: i18n.global.t('register.challenge.labelPaymentSubjectCompany'),
        value: 'company',
      },
      {
        label: i18n.global.t('register.challenge.labelPaymentSubjectSchool'),
        value: 'school',
      },
    ];

    const selectedPaymentAmount = ref<string>('');
    const selectedPaymentAmountCustom = ref<number>(390);
    const selectedPaymentSubject = ref<string>('');

    /**
     * Returns the payment amount based on the selected payment amount
     * or the custom value.
     */
    const paymentAmount = computed((): number => {
      if (selectedPaymentAmount.value === 'custom') {
        return selectedPaymentAmountCustom.value;
      }
      return parseInt(selectedPaymentAmount.value);
    });

    watch(selectedPaymentAmount, (newValue) => {
      if (newValue !== 'custom') {
        selectedPaymentAmountCustom.value = parseInt(
          selectedPaymentAmount.value,
        );
      }
    });

    return {
      optionsPaymentAmount,
      optionsPaymentSubject,
      paymentAmount,
      primaryLightColor,
      selectedPaymentAmount,
      selectedPaymentAmountCustom,
      selectedPaymentSubject,
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
      class="q-my-lg q-pa-md text-primary"
      :style="{ backgroundColor: primaryLightColor }"
      data-cy="banner-payment-minimum"
    >
      <div v-html="$t('register.challenge.textPaymentMinimum')" />
    </q-banner>
    <!-- Input: Payment subject -->
    <div class="q-my-lg">
      <label
        for="paymentType"
        class="text-caption text-weight-bold text-grey-10"
        data-cy="form-field-payment-subject-label"
      >
        {{ $t('register.challenge.labelPaymentSubject') }}
      </label>
      <form-field-radio-required
        inline
        id="paymentType"
        v-model="selectedPaymentSubject"
        :options="optionsPaymentSubject"
        class="q-mt-sm text-grey-10"
        data-cy="form-field-payment-subject"
      />
    </div>
    <!-- Input: Payment amount -->
    <div class="q-my-md">
      <label
        for="paymentAmount"
        class="text-caption text-weight-bold text-grey-10"
        data-cy="form-field-payment-amount-label"
      >
        {{ $t('register.challenge.labelPaymentAmount') }}
      </label>
      <form-field-radio-required
        inline
        id="paymentAmount"
        v-model="selectedPaymentAmount"
        :options="optionsPaymentAmount"
        class="q-mt-sm"
        data-cy="form-field-payment-amount"
      />
    </div>
    <!-- Input: Custom amount -->
    <div v-if="selectedPaymentAmount === 'custom'">
      <form-field-slider-number
        v-model="selectedPaymentAmountCustom"
        :min="390"
        :max="2000"
        class="text-grey-10"
        data-cy="form-field-payment-amount-custom"
      />
    </div>
  </div>
</template>
