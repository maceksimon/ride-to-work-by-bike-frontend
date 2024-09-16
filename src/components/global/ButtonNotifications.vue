<script lang="ts">
/**
 * ButtonNotifications Component
 *
 * @description * Use this component to render a notification button with
 * a dialog popup, containing a list of unread notifications.
 *
 * Used in `DrawerHeader` component.
 *
 * @slots
 * - `button`: For rendering a custom button
 *   exposed methods:
 *     - `openDialog`
 *
 * @components
 * - `DialogDefault`: Component to render a dialog with notifications.
 *
 * @example
 * <button-notifications>
 *  <template #button>
 *    <q-btn>
 *      <q-icon name="notifications" />
 *    </q-btn>
 *  </template>
 * </button-notifications>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=3cf3dt8cy6quEPfT-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';

export default defineComponent({
  name: 'ButtonNotifications',
  components: {
    DialogDefault,
  },
  setup() {
    const isDialogOpen = ref(false);
    const hasNotifications = ref(true);

    const openDialog = (): void => {
      isDialogOpen.value = true;
    };

    return {
      hasNotifications,
      isDialogOpen,
      openDialog,
    };
  },
});
</script>

<template>
  <div>
    <slot name="button" :open-dialog="openDialog">
      <!-- Default slot button -->
      <q-btn
        unelevated
        round
        color="primary"
        size="8px"
        @click.prevent="openDialog"
        data-cy="button-help"
      >
        <q-icon
          name="svguse:/icons/custom.svg#bell"
          size="18px"
          color="white"
          data-cy="icon-help"
        />
      </q-btn>
    </slot>
    <dialog-default
      no-padding
      v-model="isDialogOpen"
      min-width="0"
      data-cy="dialog-help"
    >
      <template #title> </template>
      <template #content> </template>
    </dialog-default>
  </div>
</template>
