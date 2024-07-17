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
 * - `FormFieldVoucher`: Component to render voucher widget.
 *
 * @example
 * <register-challenge-payment />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6485-30201&t=5JpU0wrURbmXLMCm-1)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent, reactive, ref, watch } from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { useFormatPrice } from '../../composables/useFormatPrice';

// components
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import FormFieldSliderNumber from '../form/FormFieldSliderNumber.vue';
import FormFieldVoucher from '../form/FormFieldVoucher.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { FormOption, FormPaymentVoucher } from '../types/Form';

export default defineComponent({
  name: 'RegisterChallengePayment',
  components: {
    FormFieldRadioRequired,
    FormFieldSliderNumber,
    FormFieldVoucher,
  },
  setup() {
    // constants
    const defaultPaymentAmountMax = Number(
      rideToWorkByBikeConfig.entryFeePaymentMax,
    );
    const defaultPaymentAmountMin = Number(
      rideToWorkByBikeConfig.entryFeePaymentMin,
    );

    const { getPaletteColor, lighten } = colors;
    const primaryColor = getPaletteColor('primary');
    const primaryLightColor = lighten(primaryColor, 90);

    const optionsPaymentSubject: FormOption[] = reactive([
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
    ]);

    const { formatPriceCurrency } = useFormatPrice();
    const defaultPaymentOption = {
      label: formatPriceCurrency(defaultPaymentAmountMin, 'CZK'),
      value: String(defaultPaymentAmountMin),
    };
    const optionsPaymentAmount: FormOption[] = reactive([
      defaultPaymentOption,
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
    ]);

    const selectedPaymentAmount = ref<string>(String(defaultPaymentAmountMin));
    const selectedPaymentAmountCustom = ref<number>(defaultPaymentAmountMin);
    const paymentAmountMax = ref<number>(defaultPaymentAmountMax);
    const paymentAmountMin = ref<number>(defaultPaymentAmountMin);
    const selectedPaymentSubject = ref<string>('individual');
    const isEntryFeeFree = ref<boolean>(false);

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

    /**
     * After selecting a payment amount from the given options,
     * set it as the default value for custom payment amount.
     */
    watch(selectedPaymentAmount, (newValue) => {
      if (newValue !== 'custom') {
        selectedPaymentAmountCustom.value = parseInt(
          selectedPaymentAmount.value,
        );
      }
    });

    /**
     * Handles voucher submission.
     * If there is a new price for entry fee, se it as the default value.
     * if entry fee is free, display voluntary contribution.
     */
    const onUpdateVoucher = (voucher: FormPaymentVoucher): void => {
      // amount = discounted price
      if (voucher.amount) {
        // discount the lowest price in the price options
        optionsPaymentAmount.shift();
        optionsPaymentAmount.unshift({
          label: formatPriceCurrency(voucher.amount, 'CZK'),
          value: String(voucher.amount),
        });
        // set min amount for custom amount
        paymentAmountMin.value = voucher.amount;
        // if default entry fee is selected, set it to discounted value
        if (selectedPaymentAmount.value === defaultPaymentOption.value) {
          selectedPaymentAmount.value = String(voucher.amount);
        }
      }
      // no amount = free entry
      else {
        isEntryFeeFree.value = true;
      }
    };

    const onRemoveVoucher = (): void => {
      isEntryFeeFree.value = false;
      optionsPaymentAmount.shift();
      optionsPaymentAmount.unshift(defaultPaymentOption);
      paymentAmountMin.value = defaultPaymentAmountMin;
    };

    return {
      isEntryFeeFree,
      optionsPaymentAmount,
      optionsPaymentSubject,
      paymentAmount,
      paymentAmountMax,
      paymentAmountMin,
      primaryLightColor,
      selectedPaymentAmount,
      selectedPaymentAmountCustom,
      selectedPaymentSubject,
      onRemoveVoucher,
      onUpdateVoucher,
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
    <div
      v-if="
        selectedPaymentSubject === 'individual' ||
        (selectedPaymentSubject === 'voucher' && !isEntryFeeFree)
      "
      class="q-my-md"
    >
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
    <!-- Input: Voucher -->
    <div v-if="selectedPaymentSubject === 'voucher'">
      <form-field-voucher
        @update:voucher="onUpdateVoucher"
        @remove:voucher="onRemoveVoucher"
      />
    </div>
    <!-- Input: Custom amount -->
    <div v-if="selectedPaymentAmount === 'custom'">
      <form-field-slider-number
        v-model="selectedPaymentAmountCustom"
        :min="paymentAmountMin"
        :max="paymentAmountMax"
        class="text-grey-10"
        data-cy="form-field-payment-amount-custom"
      />
    </div>
  </div>
</template>
