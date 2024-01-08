<script lang="ts">
/**
 * FormFieldPhone Component
 *
 * The `FormFieldPhone` displays phone input.
 *
 * @description * Use this component to render phone input in forms.
 *
 * Note: This component is commonly used in `FormRegistrationCoordinator`.
 *
 * @props
 * - `value` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-phone />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6385%3A28510&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldPhone',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    testing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const phone = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled, isPhone } = useValidation();

    return {
      phone,
      isFilled,
      isPhone,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm-6" data-cy="form-phone">
    <!-- Label -->
    <label for="form-phone" class="text-caption text-bold">
      {{ $t('form.labelPhone') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="phone"
      lazy-rules
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelPhone'),
          }),
        (val) => isPhone(val) || $t('form.messagePhoneInvalid'),
      ]"
      class="q-mt-sm"
      id="form-phone"
      name="phone"
      data-cy="form-phone-input"
    />
  </div>
</template>