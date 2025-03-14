<script lang="ts">
/**
 * FormFieldTextRequired Component
 *
 * The `FormFieldTextRequired` displays text required input.
 *
 * @description * Use this component to render text required input in forms.
 *
 * Note: This component is commonly used in `FormRegisterCoordinator`, `FormRegisterChallenge`, `RegisterChallengePayment`.
 *
 * @props
 * - `modelValue` (string, required): The object representing user input.
 * - `bgColor` (string, default: 'transparent'): The background color of the
 * - `name` (string, required): The name used for id and test selectors.
 * - `label` (string, required): The translation key for the label.
 * - `labelShort` (string): The translation key for the short label.
 * - `autocomplete` (string): The autocomplete attribute.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-text-required v-model="value" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103756&mode=dev)
 */

// libraries
import { defineComponent, computed, defineExpose, ref } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

import type { QInput } from 'quasar';

export default defineComponent({
  name: 'FormFieldTextRequired',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    labelShort: {
      type: String,
    },
    autocomplete: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputRef = ref<typeof QInput | null>(null);
    const inputValue = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    defineExpose({
      inputRef,
    });

    return {
      inputValue,
      isFilled,
      inputRef,
    };
  },
});
</script>

<template>
  <div :data-cy="`form-${name}`">
    <!-- Label -->
    <label :for="`form-${name}`" class="text-grey-10 text-caption text-bold">
      {{ $t(label) }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="inputValue"
      lazy-rules
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: labelShort ? $t(labelShort) : $t(label),
          }),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      :id="`form-${name}`"
      :name="name"
      :autocomplete="autocomplete"
      :data-cy="`form-${name}-input`"
      ref="inputRef"
    />
  </div>
</template>
