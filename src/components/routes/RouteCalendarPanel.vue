<script lang="ts">
/**
 * RouteCalendarPanel Component
 *
 * @description * Use this component to log routes in the calendar.
 * Upon calendar click, it displays a dismissable dialog panel.
 * Interaction with page is allowed outside the dialog.
 * Panel contains inputs for specifying the entered route.
 * Upon confirmation, it logs the entered route.
 * It is used in combination with `RoutesCalendar` component.
 *
 * @props
 * - `modelValue` (boolean, required): The "isOpen" state of the dialog.
 * - `routes` (RouteItem[], required): The list of routes to log.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `update:route`: Emitted when route is updated.
 *
 * @components
 * - `RouteInputDistance`: Component to render distance input.
 * - `RouteInputTransportType`: Component to render transport type selector.
 *
 * @example
 * <route-calendar-panel v-model="isOpen" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=Uzwf1ZVoIaYMizTE-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import RouteInputDistance from './RouteInputDistance.vue';
import RouteInputTransportType from './RouteInputTransportType.vue';

// composables
import { useLogRoutes } from '../../composables/useLogRoutes';

// types
import type { RouteItem, RouteInputType } from '../types/Route';
import type { RouteInitialData } from '../../composables/useLogRoutes';

export default defineComponent({
  name: 'RouteCalendarPanel',
  components: {
    RouteInputDistance,
    RouteInputTransportType,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    routes: {
      type: Array as () => RouteItem[],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // styles
    const minWidth = '65vw';

    const isOpen = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => {
        emit('update:modelValue', value);
      },
    });

    const routesCount = computed((): number => props.routes.length);

    // if one selected route, load its values as initial
    const routeInitial: RouteInitialData | null =
      props.routes.length === 1
        ? {
            action: 'input-number' as RouteInputType,
            distance: props.routes[0].distance,
            transportType: props.routes[0].transport,
          }
        : null;
    // TODO: finalize behaviour for multiple routes

    // route logging data with initial values
    const { action, distance, transportType, isShownDistance } =
      useLogRoutes(routeInitial);

    const isDisabledSave = computed((): boolean => {
      const noRoutes = routesCount.value === 0;
      const noDistance = isShownDistance.value && distance.value === 0;
      return noRoutes || noDistance;
    });

    /**
     * Triggered when panel save button is clicked.
     * Sends API request to update selected routes with panel data.
     * If unsuccessful, it shows error message.
     * If successful, closes panel.
     */
    const onSave = (): void => {
      // TODO: send API request
      isOpen.value = false;
    };

    return {
      action,
      distance,
      routesCount,
      isOpen,
      isDisabledSave,
      isShownDistance,
      minWidth,
      transportType,
      onSave,
    };
  },
});
</script>

<template>
  <q-dialog
    seamless
    square
    persistent
    v-model="isOpen"
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    data-cy="route-calendar-panel"
  >
    <q-card
      class="relative-position full-width overflow-visible bg-white"
      :style="{ minWidth: minWidth }"
    >
      <!-- Section: Card header -->
      <q-card-section class="q-px-lg q-pt-sm q-pb-none" data-cy="dialog-header">
        <!-- Title -->
        <h3 v-if="$slots.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
          {{
            $tc('routes.titleBottomPanel', routesCount, { count: routesCount })
          }}
        </h3>
      </q-card-section>
      <q-card-section class="q-pa-lg">
        <div class="row q-col-gutter-lg items-start" data-cy="dialog-body">
          <!-- Input: Transport type -->
          <div class="col-12 col-sm-auto">
            <route-input-transport-type v-model="transportType" />
          </div>
          <!-- Input: Distance (or link to map) -->
          <div class="col-12 col-sm">
            <route-input-distance
              v-show="isShownDistance"
              v-model="distance"
              :modelAction="action"
              @update:modelAction="action = $event"
              data-cy="section-distance"
              class="q-mt-none"
            />
          </div>
          <!-- Button: Save -->
          <div class="col-12 col-sm-auto flex self-end justify-end">
            <q-btn
              unelevated
              round
              color="primary"
              :disabled="isDisabledSave"
              @click="onSave"
              data-cy="dialog-confirm-button"
            >
              <q-icon name="check" color="white" size="24px" />
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <!-- Button: Close dialog -->
      <q-card-actions class="inline-block absolute-top-right q-pa-sm">
        <q-btn
          v-close-popup
          round
          unelevated
          color="white"
          text-color="primary"
          icon="close"
          data-cy="dialog-close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
