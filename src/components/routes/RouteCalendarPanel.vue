<script lang="ts">
/**
 * RouteCalendarPanel Component
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
 * - `RouteInputTransportType`: Component to render transport type selector.
 *
 * @example
 * <route-calendar-panel v-model="isOpen" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=Uzwf1ZVoIaYMizTE-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'RouteCalendarPanel',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    routes: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // determines if dialog window is open
    const isOpen = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => {
        emit('update:modelValue', value);
      },
    });

    const countRoutes = computed(() => props.routes.length);

    const isDisabledSubmit = computed(() => countRoutes.value === 0);

    const minWidth = '65vw';

    return {
      countRoutes,
      isOpen,
      isDisabledSubmit,
      minWidth,
    };
  },
});
</script>

<template>
  <q-dialog square persistent v-model="isOpen" data-cy="route-calendar-panel">
    <q-card
      class="relative-position full-width overflow-visible bg-white"
      :style="{ minWidth: minWidth }"
    >
      <!-- Section: Card header -->
      <q-card-section class="q-pt-none" data-cy="dialog-header">
        <!-- Title -->
        <h3 v-if="$slots.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
          {{
            $tc(
              'routes.titleBottomPanel',
              { countRoutes },
              { count: countRoutes },
            )
          }}
        </h3>
      </q-card-section>
      <q-card-section>
        <div class="row" data-cy="dialog-body">
          <div class="col-auto">
            <!-- <route-input-transport-type v-model="transportType"> -->
          </div>
          <div class="col">
            <!-- route input select -->
          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              round
              color="primary"
              :disabled="isDisabledSubmit"
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
