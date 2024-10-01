<script lang="ts">
/**
 * PageHeading Component
 *
 * @description Use this component to render a heading for a page with an optional secondary element.
 *
 * @props
 * - `horizontal` (Boolean): If true, applies a horizontal layout with flex properties.
 *
 * @slots
 * - `default`: For the page title (optional).
 * - `secondary`: For secondary content or UI elements (optional).
 *
 * @example
 * <page-heading horizontal>
 *   <template #default>
 *     Page Title
 *   </template>
 *   <template #secondary>
 *     Secondary content
 *   </template>
 * </page-heading>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=IZOUj0U34mMeiIrt-1)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageHeading',
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<template>
  <div
    v-if="$slots.default || $slots.secondary"
    data-cy="page-heading"
    class="q-mb-xl"
    :class="{
      'col-12 flex flex-wrap items-center justify-between gap-16': horizontal,
    }"
  >
    <!-- Title -->
    <h1
      v-if="$slots.default"
      class="text-h4 text-weight-bold text-black q-my-none"
      data-cy="page-heading-title"
    >
      <slot />
    </h1>

    <!-- Secondary content -->
    <div
      v-if="$slots.secondary"
      class="text-subtitle2 text-weight-regular text-grey-10"
      :class="{ 'q-mt-lg': !horizontal }"
      data-cy="page-heading-secondary"
    >
      <slot name="secondary" />
    </div>
  </div>
</template>
