<script lang="ts">
/**
 * FormSelectPaymentType Component
 *
 * @description * Use this component to render selection of payment types.
 *
 * Used in `RegisterChallengePayment` component.
 *
 * @props
 * - `modelValue` (string, required): Id of selected payment type.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-select-payment-type v-model="selectedPaymentType" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6417-29456&t=aWz8K1nuGhyMwN01-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'FormSelectPaymentType',
  setup() {
    const selectedPaymentType = ref('');

    const options = [
      { label: 'Komerční banka', value: 'komercni-banka' },
      { label: 'mBank', value: 'm-bank' },
      { label: 'Fio banka', value: 'fio-banka' },
      { label: 'Moneta', value: 'moneta' },
      { label: 'Raiffeisen BANK', value: 'raiffeisen-bank' },
    ];

    const optionsFastCard = [
      { label: 'Platební karta Mastercard či VISA', value: 'card' },
    ];

    const optionsOther = [
      { label: 'Apple Pay', value: 'apple-pay' },
      { label: 'Google Pay', value: 'google-pay' },
      { label: 'Běžný bankovní převod', value: 'transfer' },
    ];

    return {
      selectedPaymentType,
      options,
      optionsFastCard,
      optionsOther,
    };
  },
});
</script>

<template>
  <div data-cy="form-select-payment-type">
    <h3
      class="text-h5 text-weight-bold"
      data-cy="form-select-payment-type-title"
    >
      {{ $t('register.challenge.titlePaymentType') }}
    </h3>
    <h4
      class="text-caption text-weight-bold q-mt-md"
      data-cy="fast-transfer-title"
    >
      {{ $t('register.challenge.titleFastTransfer') }}
    </h4>
    <div class="q-mt-md">
      <q-option-group
        v-model="selectedPaymentType"
        type="radio"
        :options="options"
      >
        <template v-slot:label="opt">
          <span data-cy="form-select-payment-type-option-label">{{
            opt.label
          }}</span>
        </template>
      </q-option-group>
    </div>
    <h4 class="text-caption text-weight-bold q-mt-lg" data-cy="fast-card-title">
      {{ $t('register.challenge.titleFastCard') }}
    </h4>
    <div class="q-mt-md">
      <q-option-group
        v-model="selectedPaymentType"
        type="radio"
        :options="optionsFastCard"
      >
      </q-option-group>
    </div>
    <h4
      class="text-caption text-weight-bold q-mt-lg"
      data-cy="other-payments-title"
    >
      {{ $t('register.challenge.titleOtherPayments') }}
    </h4>
    <div class="q-mt-md">
      <q-option-group
        v-model="selectedPaymentType"
        type="radio"
        :options="optionsOther"
      >
      </q-option-group>
    </div>

    <div class="q-mt-lg text-grey-8">
      <p data-cy="payment-info">
        {{ $t('register.challenge.textPaymentInfo') }}
      </p>
      <p data-cy="payment-provider">
        {{ $t('register.challenge.textPaymentProvider') }}
      </p>
    </div>
  </div>
</template>
