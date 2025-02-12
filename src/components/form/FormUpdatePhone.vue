<script lang="ts">
/**
 * FormUpdatePhone Component
 *
 * @description * Use this component to render a form for updating phone number.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (string, required): Phone number value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @components
 * - `FormFieldPhone` - Component to render phone number field.
 *
 * @example
 * <form-update-phone :value="phone" :loading="isLoading" :on-close="close" @update:value="onUpdatePhone">
 *
 */

// libraries
import { defineComponent, onMounted, ref } from 'vue';

// components
import FormFieldPhone from '../global/FormFieldPhone.vue';

export default defineComponent({
  name: 'FormUpdatePhone',
  components: {
    FormFieldPhone,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
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

    const onUpdatePhone = (): void => {
      emit('update:value', inputValue.value);
      props.onClose();
    };

    return {
      inputValue,
      closeDialog,
      onUpdatePhone,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdatePhone" data-cy="form-update-phone">
    <!-- Input: Phone -->
    <form-field-phone
      v-model="inputValue"
      :required="false"
      data-cy="form-phone"
    />
    <div class="q-mt-xl flex justify-end gap-8">
      <!-- Button: Cancel -->
      <q-btn
        rounded
        unelevated
        outline
        color="primary"
        :label="$t('navigation.discardChanges')"
        @click.prevent="closeDialog"
        data-cy="form-button-cancel"
      />
      <!-- Button: Save -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="$t('navigation.save')"
        :loading="loading"
        data-cy="form-button-save"
      />
    </div>
  </q-form>
</template>
