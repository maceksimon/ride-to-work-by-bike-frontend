<script lang="ts">
/**
 * FormFieldListMerch Component
 *
 * The `FormFieldListMerch`
 *
 * @description * Use this component to render a list of t-shirts.
 *
 * Note: This component is commonly used in `FormRegisterChallenge`.
 *
 * @props
 * - `formValue` (FormMerchFields, required): The object representing form state.
 *   It should be of type `FormMerchFields`.
 *
 * @events
 * - `update:formValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Component to display dialog.
 * - `FormCardMerch`: Component to render a merch card (option).
 * - `FormFieldPhone`: Component to render phone input.
 * - `FormFieldRadioRequired`: Component to render radio buttons.
 * - `SliderMerch`: Component to render images in a slider.
 *
 * @example
 * <form-field-list-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=7003%3A32273&mode=dev)
 */

// libraries
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';
import { QCard, QForm } from 'quasar';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormCardMerch from '../form/FormCardMerch.vue';
import FormFieldPhone from '../global/FormFieldPhone.vue';
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import SliderMerch from './SliderMerch.vue';

// composables
import { useApiGetMerchandise } from '../../composables/useApiGetMerchandise';

// enums
import { Gender } from '../types/Profile';

// types
import type { FormCardMerchType, FormOption } from '../types/Form';
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormFieldListMerch',
  components: {
    DialogDefault,
    FormCardMerch,
    FormFieldPhone,
    FormFieldRadioRequired,
    SliderMerch,
  },
  setup() {
    // show merch checkbox
    const isNotMerch = ref<boolean>(false);

    // template ref
    const formMerchRef = ref<typeof QForm | null>(null);

    // selected options
    const selectedGender = ref<string>(Gender.female);
    const selectedOption = ref<FormCardMerchType | null>(null);
    const selectedSize = ref<string>('');
    const phone = ref<string>('');
    const trackDelivery = ref<boolean>(false);
    const newsletter = ref<boolean>(false);

    // merch tabs
    const tabsMerchRef = ref<typeof QCard | null>(null);

    // get merchandise data
    const logger = inject('vuejs3-logger') as Logger | null;
    const { merchandiseCards, merchandiseById, loadMerchandise, isLoading } =
      useApiGetMerchandise(logger);

    // load merchandise on mount
    onMounted(() => {
      loadMerchandise();
    });

    // computed properties for gender-specific options
    const optionsFemale = computed((): FormCardMerchType[] => {
      return Object.values(merchandiseCards.value[Gender.female] || {});
    });

    const optionsMale = computed((): FormCardMerchType[] => {
      return Object.values(merchandiseCards.value[Gender.male] || {});
    });

    const optionsUnisex = computed((): FormCardMerchType[] => {
      return Object.values(merchandiseCards.value[Gender.unisex] || {});
    });

    // get current item's options
    const currentGenderOptions = computed((): FormOption[] => {
      return selectedOption.value?.genderOptions || [];
    });

    const currentSizeOptions = computed((): FormOption[] => {
      return selectedOption.value?.sizeOptions || [];
    });

    /**
     * When gender changes, find matching item with same name but different gender
     */
    const onGenderChange = (newGender: string) => {
      logger?.debug(`onGenderChange: <${newGender}>`);
      if (!selectedOption.value) return;

      // find item with same name in the new gender group
      const matchingItem = merchandiseById.value.find(
        (item) =>
          item.gender === newGender && item.size === selectedOption.value?.size,
      );
      logger?.debug(`matchingItem: <${JSON.stringify(matchingItem, null, 2)}>`);

      if (matchingItem) {
        selectedOption.value = matchingItem;
        selectedSize.value = matchingItem.sizeId;
      }
      logger?.debug(
        `selectedOption: <${JSON.stringify(selectedOption.value, null, 2)}>`,
      );
    };

    /**
     * When size changes, find matching item with same name and gender but different size
     */
    const onSizeChange = (newSizeId: string) => {
      logger?.debug(`onSizeChange: <${newSizeId}>`);
      if (!selectedOption.value) return;

      // find item with same name and gender but different size
      const matchingItem = merchandiseById.value.find(
        (item) => item.sizeId === newSizeId,
      );
      logger?.debug(`matchingItem: <${matchingItem}>`);

      if (matchingItem) {
        selectedOption.value = matchingItem;
        selectedSize.value = matchingItem.sizeId;
      }
      logger?.debug(
        `selectedOption: <${JSON.stringify(selectedOption.value, null, 2)}>`,
      );
    };

    // watch for gender changes
    watch(selectedGender, onGenderChange);

    // watch for size changes
    watch(selectedSize, onSizeChange);

    /**
     * Checks if given option is selected.
     * Used to display "selected" version of the card button.
     * @param option FormCardMerchType
     */
    const isSelected = (option: FormCardMerchType): boolean => {
      return selectedOption.value?.value === option.sizeId;
    };

    // dialog
    const isOpen = ref<boolean>(false);

    /**
     * Handles the card "select" button click.
     * Opens the dialog with more details.
     * @param option FormCardMerchType
     */
    const onOptionSelect = (option: FormCardMerchType): void => {
      selectedOption.value = option;
      selectedGender.value = option.gender;
      selectedSize.value = option.sizeId;
      isOpen.value = true;
    };

    /**
     * Submits form within the dialog.
     * Validates the entered details and closes the dialog.
     */
    const onSubmit = async (): Promise<void> => {
      // validate form
      if (!formMerchRef.value) return;
      const isFormMerchValid: boolean = await formMerchRef.value.validate();
      if (isFormMerchValid) {
        // close dialog
        isOpen.value = false;
      } else {
        formMerchRef.value.$el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    /**
     * Scroll to merch tabs if you uncheck
     * "I don't want merch" checkbox widget
     */
    const onCheckboxUpdate = function (val: boolean): void {
      if (!val) {
        nextTick(() => {
          tabsMerchRef.value?.$el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    };

    return {
      formMerchRef,
      Gender,
      isNotMerch,
      isOpen,
      newsletter,
      optionsFemale,
      optionsMale,
      optionsUnisex,
      phone,
      selectedOption,
      selectedSize,
      selectedGender,
      currentGenderOptions,
      currentSizeOptions,
      trackDelivery,
      onOptionSelect,
      onSubmit,
      isSelected,
      tabsMerchRef,
      onCheckboxUpdate,
      isLoading,
      merchandiseCards,
      merchandiseById,
    };
  },
});
</script>

<template>
  <!-- Checkbox: No merch -->
  <q-item tag="label" v-ripple data-cy="no-merch">
    <q-item-section avatar top>
      <q-checkbox
        dense
        v-model="isNotMerch"
        :val="true"
        color="primary"
        @update:model-value="onCheckboxUpdate"
      />
    </q-item-section>
    <q-item-section>
      <!-- Checkbox title -->
      <q-item-label class="text-grey-10" data-cy="no-merch-label">{{
        $t('form.merch.labelNoMerch')
      }}</q-item-label>
      <!-- Checkbox hint -->
      <q-item-label class="text-grey-8" caption data-cy="no-merch-hint">
        {{ $t('form.merch.hintNoMerch') }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <!-- Tabs: Merch -->
  <q-card
    ref="tabsMerchRef"
    v-show="!isNotMerch"
    flat
    class="q-mt-lg"
    style="max-width: 1024px"
    data-cy="list-merch"
  >
    <!-- Tab buttons -->
    <q-tabs
      v-model="selectedGender"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      data-cy="list-merch-tabs"
    >
      <!-- Button: Female -->
      <q-tab
        :name="Gender.female"
        :label="$t('global.female')"
        data-cy="list-merch-tab-female"
      />
      <!-- Button: Male -->
      <q-tab
        :name="Gender.male"
        :label="$t('global.male')"
        data-cy="list-merch-tab-male"
      />
      <!-- Button: Unisex -->
      <q-tab
        :name="Gender.unisex"
        :label="$t('global.unisex')"
        data-cy="list-merch-tab-unisex"
      />
    </q-tabs>

    <q-separator />

    <!-- Tab panels -->
    <q-tab-panels v-model="selectedGender" animated>
      <!-- Tab panel: Female -->
      <q-tab-panel :name="Gender.female" class="q-pa-none">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <!-- Card: Merch (includes dialog) -->
          <FormCardMerch
            v-for="option in optionsFemale"
            :option="option"
            :key="`${option.value}-${Gender.female}`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-female"
            @select-option="onOptionSelect(option)"
          />
        </div>
      </q-tab-panel>

      <!-- Tab panel: Male -->
      <q-tab-panel :name="Gender.male">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <!-- Card: Merch (includes dialog) -->
          <FormCardMerch
            v-for="option in optionsMale"
            :option="option"
            :key="`${option.value}-${Gender.male}`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-male"
            @select-option="onOptionSelect(option)"
          />
        </div>
      </q-tab-panel>

      <!-- Tab panel: Unisex -->
      <q-tab-panel :name="Gender.unisex">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <!-- Card: Merch (includes dialog) -->
          <FormCardMerch
            v-for="option in optionsUnisex"
            :option="option"
            :key="`${option.value}-${Gender.unisex}`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-unisex"
            @select-option="onOptionSelect(option)"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Input: Merch size (card) - duplicated in dialog -->
    <div v-if="selectedOption" class="q-pt-sm">
      <span
        class="text-caption text-weight-medium text-grey-10"
        v-if="selectedGender === Gender.female"
        >{{ $t('form.merch.labelSizeFemale') }}</span
      >
      <span
        class="text-caption text-weight-medium text-grey-10"
        v-else-if="selectedGender === Gender.male"
        >{{ $t('form.merch.labelSizeMale') }}</span
      >
      <form-field-radio-required
        inline
        v-model="selectedSize"
        :options="selectedOption.sizes"
        class="q-mt-sm"
        data-cy="form-field-merch-size"
      />
    </div>

    <!-- Input: Phone number -->
    <form-field-phone
      v-model="phone"
      :hint="$t('form.merch.hintPhone')"
      :required="trackDelivery"
      data-cy="form-merch-phone-input"
    />
    <!-- Input: Track delivery checkbox -->
    <q-checkbox
      dense
      v-model="trackDelivery"
      color="primary"
      :false-value="false"
      :label="$t('form.merch.labelTrackDelivery')"
      :true-value="true"
      class="text-grey-10 q-mt-lg"
      data-cy="form-merch-tracking-input"
    />
    <!-- Input: News checkbox -->
    <q-checkbox
      dense
      v-model="newsletter"
      color="primary"
      :false-value="false"
      :label="$t('form.merch.labelNewsletter')"
      :true-value="true"
      class="text-grey-10 q-mt-md"
      data-cy="form-terms-input"
    />

    <!-- Dialog -->
    <dialog-default v-model="isOpen" data-cy="dialog-merch">
      <template #title>
        <!-- Merch Title -->
        <span v-if="selectedOption">{{ selectedOption.dialogTitle }}</span>
      </template>
      <template #content>
        <div v-if="selectedOption">
          <!-- Merch Image Slider -->
          <slider-merch :items="selectedOption.dialogImages" />
          <!-- Merch Description -->
          <div v-html="selectedOption.dialogDescription"></div>
          <q-form ref="formMerchRef">
            <!-- Input: Merch gender -->
            <div v-if="currentGenderOptions.length" class="q-pt-sm">
              <span class="text-caption text-weight-medium text-grey-10">{{
                $t('form.merch.labelVariant')
              }}</span>
              <form-field-radio-required
                inline
                v-model="selectedGender"
                :options="currentGenderOptions"
                class="q-mt-sm"
                data-cy="form-field-merch-gender"
              />
            </div>
            <!-- Input: Merch size (dialog) - duplicated in card -->
            <div class="q-pt-sm">
              <span
                class="text-caption text-weight-medium text-grey-10"
                v-if="selectedGender === Gender.female"
                >{{ $t('form.merch.labelSizeFemale') }}</span
              >
              <span
                class="text-caption text-weight-medium text-grey-10"
                v-else-if="selectedGender === Gender.male"
                >{{ $t('form.merch.labelSizeMale') }}</span
              >
              <form-field-radio-required
                inline
                v-model="selectedSize"
                :options="currentSizeOptions"
                class="q-mt-sm"
                data-cy="form-field-merch-size"
              />
            </div>
            <!-- TODO: Add size legend -->
            <div class="q-mt-lg flex justify-end">
              <q-btn
                rounded
                unelevated
                color="primary"
                :label="$t('navigation.select')"
                text-color="white"
                @click="onSubmit"
                data-cy="button-submit-merch"
              />
            </div>
          </q-form>
        </div>
      </template>
    </dialog-default>
  </q-card>
</template>
