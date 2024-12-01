<script lang="ts">
/**
 * FormFieldCompanyAddress Component
 *
 * The `FormFieldCompanyAddress`
 *
 * @description * Use this component to render address selection field.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `modelValue` (number|null): the number representing address.
 *
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Component to render a dialog window.
 *
 * @example
 * <form-field-company-address />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6485%3A29568&mode=dev)
 */

// libraries
import { QForm } from 'quasar';
import { computed, defineComponent, inject, ref, watch } from 'vue';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';
import FormAddSubsidiary from 'src/components/form/FormAddSubsidiary.vue';

// composables
import { useApiGetSubsidiaries } from 'src/composables/useApiGetSubsidiaries';
import { useValidation } from 'src/composables/useValidation';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { FormCompanyAddressFields } from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';

export default defineComponent({
  name: 'FormFieldCompanyAddress',
  components: {
    FormAddSubsidiary,
    DialogDefault,
  },
  props: {
    modelValue: {
      type: Number as () => number | null,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formRef = ref<typeof QForm | null>(null);
    const logger = inject('vuejs3-logger') as Logger | null;

    const address = computed<number | null>({
      get: () => props.modelValue,
      set: (value: number | null) => emit('update:modelValue', value),
    });

    const addressNew = ref<FormCompanyAddressFields>({
      street: '',
      houseNumber: '',
      city: '',
      zip: '',
      cityChallenge: null,
      department: '',
    });

    const { subsidiaries, isLoading, loadSubsidiaries } =
      useApiGetSubsidiaries(logger);

    const store = useRegisterChallengeStore();
    watch(
      () => store.getOrganizationId,
      (newValue) => {
        logger?.debug(
          `Resgister challenge stote organization ID updated to <${newValue}>`,
        );
        address.value = null;
        if (newValue) {
          loadSubsidiaries(newValue);
        }
      },
      { immediate: true },
    );

    const options = computed(() =>
      subsidiaries.value?.map((subsidiary) => ({
        label: getAddressString(subsidiary.address),
        value: subsidiary.id,
      })),
    );

    const { isFilled } = useValidation();
    const { isDialogOpen, onClose } = useDialog();

    const onSubmit = async (): Promise<void> => {
      // TODO: Add address via API
      isDialogOpen.value = false;
    };

    /**
     * Get a formatted address string from the provided address object.
     * @param {FormCompanyAddressFields | undefined} address - The address object.
     * @returns {string} - Formatted string representation of the address or
     * empty string.
     */
    const getAddressString = (
      address: FormCompanyAddressFields | undefined,
    ): string => {
      if (!address) return '';

      const parts = [
        address.street,
        address.houseNumber,
        address.city,
        address.zip,
        address.cityChallenge,
        address.department,
      ].filter(Boolean);

      return parts.join(', ');
    };

    /**
     * Provides dialog behaviour
     * @returns {isDialogOpen, onClose}
     * - `isDialogOpen` (boolean): Whether the dialog is open.
     * - `onClose` (function): Runs when the dialog is closed.
     */
    function useDialog() {
      const isDialogOpen = ref<boolean>(false);

      const onClose = (): void => {
        if (formRef.value) {
          formRef.value.reset();
          logger?.info('Close add company modal dialog and reset form.');
        }
        isDialogOpen.value = false;
      };

      return {
        isDialogOpen,
        onClose,
      };
    }

    return {
      address,
      addressNew,
      formRef,
      options,
      isDialogOpen,
      isFilled,
      isLoading,
      onClose,
      onSubmit,
    };
  },
});
</script>

<template>
  <div data-cy="form-company-address">
    <div class="row q-mt-sm q-col-gutter-sm">
      <label
        for="form-company-address"
        class="col-12 text-caption text-bold text-grey-10"
        data-cy="form-company-address-label"
      >
        {{ $t('form.company.labelAddress') }}
      </label>
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          dense
          outlined
          emit-value
          map-options
          id="form-company-address"
          v-model="address"
          :hint="$t('form.company.hintAddress')"
          :options="options"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('form.labelAddress'),
              }),
          ]"
          data-cy="form-company-address-input"
        >
          <!-- Item: No option -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t('form.messageNoResult') }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-12 col-sm-auto flex items-start justify-end q-pl-md"
        style="margin-top: 2px"
        data-cy="col-button"
      >
        <!-- Button: Add company -->
        <q-btn
          flat
          rounded
          icon="mdi-plus"
          color="primary"
          @click.prevent="isDialogOpen = true"
          data-cy="button-add-address"
        >
          <!-- Label -->
          <span class="inline-block q-pl-xs">
            {{ $t('form.company.buttonAddAddress') }}
          </span>
        </q-btn>
      </div>
    </div>
  </div>
  <!-- Dialog: Add address -->
  <dialog-default v-model="isDialogOpen" data-cy="dialog-add-address">
    <template #title>
      {{ $t('form.company.titleAddAddress') }}
    </template>
    <template #content>
      <q-form ref="formRef">
        <p data-cy="add-subsidiary-text">
          {{ $t('form.company.textSubsidiaryAddress') }}
        </p>
        <form-add-subsidiary v-model="addressNew" />
      </q-form>
      <!-- Action buttons -->
      <div class="flex justify-end q-mt-sm">
        <div class="flex gap-8">
          <q-btn
            rounded
            unelevated
            outline
            color="primary"
            data-cy="dialog-button-cancel"
            @click="onClose"
          >
            {{ $t('navigation.discard') }}
          </q-btn>
          <q-btn
            rounded
            unelevated
            color="primary"
            data-cy="dialog-button-submit"
            @click="onSubmit"
          >
            {{ $t('form.company.buttonAddSubsidiary') }}
          </q-btn>
        </div>
      </div>
    </template>
  </dialog-default>
</template>
