<script lang="ts">
/**
 * DetailsItem Component
 *
 * @description * Use this component to render a details row in PersonalDetails
 * section of the profile page.
 *
 * @props
 * - `description` (string, required): Description of the item.
 * - `editable` (boolean, default: false): Whether the value is editable.
 * - `emptyLabel` (string, required): Label used when value is empty.
 * - `dialogTitle` (string, required): Title of the edit dialog.
 * - `label` (string, required): Label of the item.
 * - `value` (string, required): Value of the item.
 *
 * @events
 * - `update:value`: Emitted when value is updated
 *
 * @slots
 * - `form`: For rendering update form in the dialog.
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
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    emptyLabel: {
      type: String,
      required: true,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['update:value'],
  setup() {
    const isDialogOpen = ref<boolean>(false);

    return {
      isDialogOpen,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-md" data-cy="details-item">
    <div :class="[editable ? 'col-4 col-md-3 col-lg-2' : 'col-4 col-md-4']">
      <div data-cy="details-item-label">{{ label }}</div>
    </div>
    <div :class="[editable ? 'col-8 col-md-6 col-lg-8' : 'col-8 col-md-8']">
      <div data-cy="details-item-value">{{ value }}</div>
      <div data-cy="details-item-description">{{ description }}</div>
    </div>
    <div v-if="editable" class="col-12 col-md-3 col-lg-2 flex justify-end">
      <q-btn
        v-if="editable"
        rounded
        unelevated
        outline
        color="primary"
        class="q-ml-auto"
        :label="$t('global.buttonEdit')"
        data-cy="details-item-edit"
        @click.prevent="isDialogOpen = true"
      />
    </div>
    <dialog-default v-model="isDialogOpen" data-cy="dialog-edit">
      <template #title>
        {{ dialogTitle }}
      </template>
      <template #content>
        <slot name="form" />
      </template>
    </dialog-default>
  </div>
</template>
