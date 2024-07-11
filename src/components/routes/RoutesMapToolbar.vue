<script lang="ts">
/**
 * RoutesMapToolbar Component
 *
 * @description * Use this component to render a toolbar for a RoutesMap.
 *
 * @props
 * - `drawEnabled` (boolean, required): Enabled state for draw tool.
 * - `deleteEnabled` (boolean, required): Enabled state for delete tool.
 *
 * @events
 * - `update:draw-enabled`: Emitted when draw tool is toggled.
 * - `update:delete-enabled`: Emitted when delete tool is toggled.
 * - `undo`: Emitted when undo button is clicked.
 * - `save`: Emitted when save button is clicked.
 * - `current-position`: Emitted when current position button is clicked.
 *
 * @example
 * <routes-map-toolbar />
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RoutesMapToolbar',
  emits: [
    'update:draw-enabled',
    'update:delete-enabled',
    'undo',
    'save:route',
    'current-position',
  ],
  props: {
    drawEnabled: {
      type: Boolean,
      default: false,
    },
    deleteEnabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<template>
  <!-- Toolbar: Top -->
  <div
    class="flex justify-center absolute-top q-pa-sm"
    :style="{ zIndex: 1, pointerEvents: 'none' }"
  >
    <q-toolbar
      class="col-auto gap-8 q-pa-sm"
      :style="{
        borderRadius: '9999px',
        backgroundColor: 'white',
        pointerEvents: 'auto',
      }"
    >
      <!-- Button: Enable draw (draw route) -->
      <q-btn
        dense
        round
        unelevated
        class="q-pa-none q-ma-none"
        color="transparent"
        text-color="primary"
        @click.prevent="$emit('update:draw-enabled', !drawEnabled)"
      >
        <q-avatar
          size="32px"
          class="q-pa-none q-ma-none"
          :color="drawEnabled ? 'primary' : 'grey-3'"
        >
          <!-- Icon -->
          <q-icon
            name="mdi-pencil-plus"
            :color="drawEnabled ? 'white' : 'primary'"
            size="18px"
            data-cy="icon-add-route"
          />
        </q-avatar>
      </q-btn>
      <!-- Button: Enable delete (delete point/vertex) -->
      <q-btn
        v-show="drawEnabled"
        dense
        round
        unelevated
        class="q-pa-none q-ma-none"
        color="transparent"
        text-color="primary"
        @click.prevent="$emit('update:delete-enabled', !deleteEnabled)"
      >
        <q-avatar
          size="32px"
          class="q-pa-none q-ma-none"
          :color="deleteEnabled ? 'primary' : 'grey-3'"
        >
          <!-- Icon -->
          <q-icon
            name="mdi-pencil-remove"
            :color="deleteEnabled ? 'white' : 'primary'"
            size="18px"
            data-cy="icon-remove-point"
          />
        </q-avatar>
      </q-btn>
      <!-- Button: Undo -->
      <q-btn
        v-show="drawEnabled"
        dense
        round
        unelevated
        class="q-pa-none q-ma-none"
        color="transparent"
        text-color="primary"
        @click.prevent="$emit('undo')"
      >
        <q-avatar size="32px" class="q-pa-none q-ma-none" color="grey-3">
          <!-- Icon -->
          <q-icon
            name="mdi-undo"
            color="primary"
            size="18px"
            data-cy="icon-undo"
          />
        </q-avatar>
      </q-btn>
      <!-- Button: Save route -->
      <q-btn
        v-show="drawEnabled"
        dense
        round
        unelevated
        class="q-pa-none q-ma-none"
        color="transparent"
        text-color="primary"
        @click.prevent="$emit('save:route')"
      >
        <q-avatar size="32px" class="q-pa-none q-ma-none" color="grey-3">
          <!-- Icon -->
          <q-icon
            name="mdi-check"
            color="primary"
            size="18px"
            data-cy="icon-save-route"
          />
        </q-avatar>
      </q-btn>
    </q-toolbar>
  </div>
  <!-- Toolbar: Bottom -->
  <div
    class="flex justify-start absolute-bottom q-pa-sm"
    :style="{ zIndex: 1, pointerEvents: 'none' }"
  >
    <!-- Button: Center on current location -->
    <q-btn
      dense
      round
      unelevated
      class="q-pa-none q-ma-none"
      color="transparent"
      text-color="primary"
      :style="{
        pointerEvents: 'auto',
      }"
      @click.prevent="$emit('current-position')"
    >
      <q-avatar size="32px" class="q-pa-none q-ma-none" color="white">
        <!-- Icon -->
        <q-icon
          name="sym_s_my_location"
          color="primary"
          size="18px"
          data-cy="icon-add-route"
        />
      </q-avatar>
    </q-btn>
  </div>
</template>
