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
  setup() {
    const avatarSize = '32px';
    const iconSize = '18px';
    const tooltipDelay = 300;

    return {
      avatarSize,
      iconSize,
      tooltipDelay,
    };
  },
});
</script>

<template>
  <div>
    <!-- Toolbar: Top -->
    <div
      class="flex justify-center absolute-top q-pa-sm"
      :style="{ zIndex: 1, pointerEvents: 'none' }"
      data-cy="toolbar-top"
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
          data-cy="add-route-button"
        >
          <!-- Tooltip -->
          <q-tooltip :delay="tooltipDelay" class="text-body2">
            <span v-if="!drawEnabled">{{
              $t('routes.tooltipDrawEnable')
            }}</span>
            <span v-if="drawEnabled">{{
              $t('routes.tooltipDrawDisable')
            }}</span>
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            :color="drawEnabled ? 'primary' : 'grey-3'"
            data-cy="add-route-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-pencil-plus"
              :color="drawEnabled ? 'white' : 'primary'"
              :size="iconSize"
              data-cy="add-route-icon"
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
          data-cy="delete-route-button"
        >
          <!-- Tooltip -->
          <q-tooltip :delay="tooltipDelay" class="text-body2">
            <span v-if="!deleteEnabled">{{
              $t('routes.tooltipDeleteEnable')
            }}</span>
            <span v-if="deleteEnabled">{{
              $t('routes.tooltipDeleteDisable')
            }}</span>
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            :color="deleteEnabled ? 'primary' : 'grey-3'"
            data-cy="delete-route-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-pencil-remove"
              :color="deleteEnabled ? 'white' : 'primary'"
              :size="iconSize"
              data-cy="delete-route-icon"
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
          data-cy="undo-button"
        >
          <!-- Tooltip -->
          <q-tooltip :delay="tooltipDelay" class="text-body2">
            {{ $t('routes.tooltipUndo') }}
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            color="grey-3"
            data-cy="undo-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-undo"
              color="primary"
              :size="iconSize"
              data-cy="undo-icon"
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
          data-cy="save-route-button"
        >
          <!-- Tooltip -->
          <q-tooltip :delay="tooltipDelay" class="text-body2">
            {{ $t('routes.tooltipSave') }}
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            color="grey-3"
            data-cy="save-route-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-check"
              color="primary"
              :size="iconSize"
              data-cy="save-route-icon"
            />
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </div>
    <!-- Toolbar: Bottom -->
    <div
      class="flex justify-start absolute-bottom q-pa-sm"
      :style="{ zIndex: 1, pointerEvents: 'none' }"
      data-cy="toolbar-bottom"
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
        data-cy="current-position-button"
      >
        <q-avatar
          :size="avatarSize"
          class="q-pa-none q-ma-none"
          color="white"
          data-cy="current-position-avatar"
        >
          <!-- Icon -->
          <q-icon
            name="sym_s_my_location"
            color="primary"
            :size="iconSize"
            data-cy="current-position-icon"
          />
        </q-avatar>
      </q-btn>
    </div>
  </div>
</template>
