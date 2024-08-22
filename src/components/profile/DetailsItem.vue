<script lang="ts">
/**
 * DetailsItem Component
 *
 * @description * Use this component to render a details row in ProfileDetails
 * section of the profile page.
 * You can render label by passing the `label` prop, or use the `label` slot.
 * You can render values by passing the `value`, and `description` prop, or use
 * the `value` slot to render custom content.
 * You can override the default empty label with `emptyLabel` prop.
 * You can override the default edit button using the `button` slot.
 * If you want to make the value editable, pass the `editable` prop.
 * Use the `form` slot to render the update form in the dialog.
 *
 * @props
 * - `description` (string, false): Description of the item.
 * - `dialogTitle` (string, required): Title of the edit dialog.
 * - `editable` (boolean, default: false): Whether the value is editable.
 * - `emptyLabel` (string, required): Label used when value is empty.
 * - `label` (string, required): Label of the item.
 * - `value` (string, required): Value of the item.
 *
 * @events
 * - `update:value`: Emitted when value is updated
 *
 * @slots
 * - `button`: For rendering custom edit button content.
 * - `form`: For rendering update form in the dialog.
 * - `label`: For rendering custom label.
 * - `value`: For rendering custom value.
 *
 * @components
 * - `DialogDefault`: Component to render a modal dialog.
 *
 * @example
 * <details-item :label="label" :value="value" :description="description" :editable="true" @update:value="updateValue">
 *   <template #form>
 *     <form-update />
 *    </template>
 * </details-item>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=hSsXuLBLqyeTB216-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';

export default defineComponent({
  name: 'DetailsItem',
  components: {
    DialogDefault,
  },
  props: {
    description: {
      type: String,
    },
    dialogTitle: {
      type: String,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    emptyLabel: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
  },
  emits: ['update:value'],
  setup() {
    // styles
    const maxWidthLabel = '140px';

    const isDialogOpen = ref<boolean>(false);

    return {
      isDialogOpen,
      maxWidthLabel,
    };
  },
});
</script>

<template>
  <div
    class="row q-col-gutter-md items-start text-grey-10"
    data-cy="details-item"
  >
    <!-- Section: Label -->
    <div class="col" :style="{ maxWidth: maxWidthLabel }">
      <!-- Slot: Label (takes precedence over label prop) -->
      <template v-if="$slots.label">
        <div data-cy="details-item-label">
          <slot name="label" />
        </div>
      </template>
      <!-- Label -->
      <template v-else>
        <div data-cy="details-item-label">
          {{ label }}
        </div>
      </template>
    </div>
    <!-- Section: Value -->
    <div class="col">
      <!-- Slot: Value (takes precedence over value prop) -->
      <template v-if="$slots.value">
        <div class="text-weight-bold" data-cy="details-item-value">
          <slot name="value" />
        </div>
      </template>
      <!-- Value + Description -->
      <template v-else>
        <!-- Value -->
        <div v-if="value" class="text-weight-bold" data-cy="details-item-value">
          {{ value }}
        </div>
        <!-- Empty value -->
        <div
          v-else
          class="text-grey-7 text-italic"
          data-cy="details-item-empty"
        >
          {{ emptyLabel ? emptyLabel : $t('profile.labelNoValue') }}
        </div>
        <!-- Description -->
        <div
          v-if="description"
          class="text-caption text-grey-7"
          data-cy="details-item-description"
        >
          {{ description }}
        </div>
      </template>
    </div>
    <!-- Button: Edit -->
    <div
      v-if="editable"
      class="col-12 col-sm-auto flex justify-end"
      data-cy="details-section-edit"
    >
      <q-btn
        v-if="editable"
        rounded
        unelevated
        outline
        color="primary"
        class="q-ml-auto"
        data-cy="details-item-edit"
        @click.prevent="isDialogOpen = true"
      >
        <!-- Slot: Button (option to override default) -->
        <template v-if="$slots.button">
          <slot name="button" />
        </template>
        <!-- Default: Edit -->
        <template v-else>
          <q-icon name="edit" size="18px" class="q-mr-sm" />
          {{ $t('navigation.edit') }}
        </template>
      </q-btn>
    </div>
    <!-- Dialog: Edit -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-edit">
      <!-- Title -->
      <template #title>
        {{ dialogTitle }}
      </template>
      <!-- Content (passes "form" slot into DialogDefault "content" slot) -->
      <template #content>
        <slot name="form" :close="() => (isDialogOpen = false)" />
      </template>
    </dialog-default>
  </div>
</template>
