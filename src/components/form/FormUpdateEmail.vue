<script lang="ts">
/**
 * FormUpdateEmail Component
 *
 * @description * Use this component to render a form for updating email.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (string, required): Email value.
 * - `onClose` (function, required): Function to close the dialog.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @example
 * <form-update-email :value="email" @update:value="onUpdateEmail">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=07BEuitYbnwTVn44-1)
 */

// libraries
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'FormUpdateEmail',
  props: {
    value: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:value', 'close'],
  setup(props, { emit }) {
    const inputValue = ref<string>('');

    onMounted(() => {
      inputValue.value = props.value;
    });

    const closeDialog = (): void => {
      props.onClose();
    };

    const onUpdateEmail = (): void => {
      emit('update:value', inputValue.value);
      props.onClose();
    };

    return {
      inputValue,
      closeDialog,
      onUpdateEmail,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateEmail" data-cy="form-update-email">
    <!-- Label -->
    <label
      for="form-email"
      class="text-grey-10 text-caption text-bold"
      data-cy="form-label"
    >
      {{ $t('form.labelEmailOptional') }}
    </label>
  </q-form>
</template>
