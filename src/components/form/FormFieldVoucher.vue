<script lang="ts">
/**
 * FormFieldVoucher Component
 *
 * @description * Use this component to render a Voucher widget.
 * It handles voucher submission and validation and emits
 * the data about the voucher.
 *
 * @events
 * - `update:voucher`: Emitted after voucher is successfully applied.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required text field.
 *
 * @example
 * <form-field-voucher />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6410-2305&t=gB7ERmDZorpD4TdE-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

export default defineComponent({
  name: 'FormFieldVoucher',
  components: {
    FormFieldTextRequired,
  },
  emits: ['update:voucher'],
  setup(props, { emit }) {
    const code = ref('');

    /**
     * Submits voucher data to API
     * If voucher is valid it emits the data
     * @returns {void}
     */
    const onSubmitVoucher = (): void => {
      // TODO: Add API call and remove dummy data
      const voucher = {
        code: 'AB-CDEFGH',
        name: 'Sleva 50% (-195 Kč)',
        amount: 195,
      };

      if (voucher) {
        // reset input value
        code.value = '';
        // emit voucher data
        emit('update:voucher', voucher);
      }
    };

    return {
      code,
      onSubmitVoucher,
    };
  },
});
</script>

<template>
  <div class="row items-center q-col-gutter-md" data-cy="form-field-voucher">
    <div class="col">
      <!-- Input: Voucher -->
      <form-field-text-required
        v-model="code"
        name="voucher"
        :label="$t('form.labelVoucher')"
        data-cy="form-field-voucher-input"
      />
    </div>
    <div class="col-auto">
      <!-- Button: Submit -->
      <q-btn
        rounded
        unelevated
        color="primary"
        :label="$t('form.buttonVoucherSubmit')"
        @click="onSubmitVoucher"
        class="q-mt-sm"
        data-cy="form-field-voucher-submit"
      />
    </div>
  </div>
</template>
