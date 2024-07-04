<script lang="ts">
/**
 * RouteListPanel Component
 *
 * @description * Use this component to log routes log routes in the calendar.
 * Upon calendar click, it displays a dismissable dialog panel.
 * Panel contains inputs for specifying the entered route.
 * Upon confirmation, it logs the entered route.
 * It is used in combination with `RoutesCalendar` component.
 *
 * @props
 * - `modelValue` (boolean, required): The "isOpen" state of the dialog.
 *   It should be of type `boolean`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `update:route`: Emitted when route is updated.
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <route-list-panel v-model="isOpen" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=Uzwf1ZVoIaYMizTE-1)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RouteListPanel',
  props: {},
  setup() {},
});
</script>

<template>
  <div></div>
</template>
