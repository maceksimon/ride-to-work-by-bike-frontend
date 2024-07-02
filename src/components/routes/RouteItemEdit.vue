<script lang="ts">
/**
 * RouteItemEdit Component
 *
 * @description * Use this component to render an item in a list with the
 * option to edit data.
 *
 * Note: This component is commonly used in `RouteListEdit`.
 *
 * @props
 * - `route` (RouteItem, required): The object representing the route.
 *   It should be of type `RouteItem`
 * - `displayLabel` (boolean, optional): Whether to display direction label.`
 *
 * @example
 * <route-item-edit :route="route" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { computed, defineComponent, ref, watch } from 'vue';
import { i18n } from 'src/boot/i18n';

// components
import RouteInputTransportType from './RouteInputTransportType.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { FormOption } from '../types/Form';
import type { RouteItem, RouteInputType, TransportType } from '../types/Route';

export default defineComponent({
  name: 'RouteItemEdit',
  components: {
    RouteInputTransportType,
  },
  props: {
    route: {
      type: Object as () => RouteItem,
      required: true,
    },
    displayLabel: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:route'],
  setup(props, { emit }) {
    const { borderRadiusCard: borderRadius, colorGray: borderColor } =
      rideToWorkByBikeConfig;

    const routeInitial: RouteItem = { ...props.route };

    const action = ref<RouteInputType>(
      props.route?.inputType || 'input-number',
    );
    const distance = ref<number>(props.route?.distance || 0);

    const optionsAction: FormOption[] = [
      {
        label: i18n.global.t('routes.actionInputDistance'),
        value: 'input-number',
      },
      {
        label: i18n.global.t('routes.actionTraceMap'),
        value: 'input-map',
      },
    ];

    const transport = ref<TransportType | null>(props.route.transport || null);
    // show distance input if transport is bike, walk or bus
    const isShownDistance = computed((): boolean => {
      return (
        transport.value === 'bike' ||
        transport.value === 'walk' ||
        transport.value === 'bus'
      );
    });

    // watcher for changes compared to the initial state (dirty)
    watch(
      [action, distance, transport],
      ([actionNew, distanceNew, transportNew]) => {
        // if settings are the same as initial, mark dirty as false
        if (
          actionNew === (routeInitial?.inputType || 'input-number') &&
          Number(distanceNew) === Number(routeInitial.distance) &&
          transportNew === routeInitial?.transport
        ) {
          emit('update:route', false);
        }
        // if settings are different from initial, mark dirty as true
        else {
          emit('update:route', true);
        }
      },
    );

    const iconSize = '18px';

    return {
      action,
      borderRadius,
      borderColor,
      distance,
      iconSize,
      isShownDistance,
      optionsAction,
      transport,
    };
  },
});
</script>

<template>
  <div
    class="text-grey-10"
    :style="{
      'border-radius': borderRadius,
      border: `1px solid ${borderColor}`,
    }"
    data-cy="route-item-edit"
  >
    <div class="q-pa-md" data-cy="section-direction">
      <!-- Section: Direction -->
      <div
        class="flex gap-8 text-subtitle2 text-weight-bold text-grey-10"
        data-cy="label-direction"
      >
        <!-- From work -->
        <span v-if="route.direction === 'fromWork'">
          <q-icon
            name="arrow_back"
            :size="iconSize"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionFromWork') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === 'toWork'">
          <q-icon
            name="arrow_forward"
            :size="iconSize"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionToWork') }}
        </span>
      </div>
    </div>
    <q-separator class="q-mx-md" />
    <div class="q-pa-md" data-cy="section-transport-distance">
      <div>
        <!-- Section: Transport type -->
        <route-input-transport-type
          horizontal
          v-model="transport"
          class="q-mt-sm"
          data-cy="section-transport"
        />
        <!-- Section: Distance -->
        <div
          class="q-mt-lg"
          v-show="isShownDistance"
          data-cy="section-distance"
        >
          <!-- Label -->
          <div
            class="text-caption text-weight-bold text-grey-10"
            data-cy="label-distance"
          >
            {{ $t('routes.labelDistance') }}
          </div>
          <div class="q-mt-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-auto">
                <!-- Select: Action -->
                <q-select
                  dense
                  outlined
                  emit-value
                  map-options
                  v-model="action"
                  :id="`route-item-action-${route.id}`"
                  :options="optionsAction"
                  data-cy="select-action"
                />
              </div>
              <div
                v-if="action === 'input-number'"
                class="col-auto items-center"
              >
                <!-- Input: Distance -->
                <q-input
                  dense
                  outlined
                  type="number"
                  v-model="distance"
                  :id="`route-item-distance-${route.id}`"
                  :name="`route-item-distance-${route.id}`"
                  min="0"
                  max="999"
                  data-cy="input-distance"
                >
                  <template v-slot:append>
                    <span
                      class="text-subtitle2 text-weight-regular text-grey-10"
                      data-cy="units-distance"
                    >
                      {{ $t('global.routeLengthUnit') }}
                    </span>
                  </template>
                </q-input>
              </div>
              <div
                v-else-if="action === 'input-map'"
                class="col-auto items-center"
              >
                <!-- Button: Trace map -->
                <q-btn
                  flat
                  rounded
                  color="primary"
                  size="16px"
                  data-cy="button-trace-map"
                >
                  <!-- Icon -->
                  <q-icon
                    name="svguse:icons.svg#pencil"
                    size="24px"
                    class="q-mr-sm"
                  />
                  <!-- Label -->
                  <span>{{ $t('routes.buttonTraceMap') }}</span>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
