<script lang="ts">
/**
 * PageHeading Component
 *
 * @description Use this component to render a heading for a page.
 *
 * @slots
 * - `title`: For the page title (optional).
 * - `perex`: For the page perex (optional).
 *
 * @example
 * <page-heading>
 *   <template #title>
 *     Page Title
 *   </template>
 *   <template #perex>
 *     Page perex
 *   </template>
 * </page-heading>
 *
 * @see [Figma Design](...)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageHeading',
});
</script>

<template>
  <div
    v-if="$slots.default || $slots.perex"
    data-cy="page-heading"
    class="q-mt-lg q-mb-xl"
  >
    <h1
      v-if="$slots.default"
      class="text-h4 text-weight-bold text-black q-my-none"
      data-cy="page-heading-title"
    >
      <slot />
    </h1>
    <div
      v-if="$slots.perex"
      class="q-mt-lg text-subtitle2 text-weight-regular text-grey-10"
      data-cy="page-heading-perex"
    >
      <slot name="perex" />
    </div>
  </div>
</template>
