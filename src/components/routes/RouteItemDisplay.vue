<script lang="ts">
/**
 * RouteItemDisplay Component
 *
 * @description * Use this component to render an item in a list only for
 * display.
 *
 * Note: This component is commonly used in `RouteListDisplay`.
 *
 * @props
 * - `route` (RouteItem, required): The object representing the route.
 *   It should be of type `RouteItem`.
 *
 * @example
 * <route-item-display :route="route" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import type { RouteItem } from '../types/Route';

// composables
import { useRoutes } from 'src/composables/useRoutes';

export default defineComponent({
  name: 'RouteItemDisplay',
  props: {
    route: {
      type: Object as () => RouteItem,
      required: true,
    },
  },
  setup() {
    const { getRouteIcon } = useRoutes();

    return {
      getRouteIcon,
    };
  },
});
</script>

<template>
  <div class="row" data-cy="route-item-display">
    <div class="col-12 col-sm-2 no-wrap" data-cy="column-direction">
      <!-- Column: Direction -->
      <div
        class="flex gap-8 text-body1 text-weight-bold text-grey-10 q-pa-md"
        data-cy="label-direction"
      >
        <!-- From work -->
        <span v-if="route.direction === 'fromWork'">
          <q-icon
            name="arrow_back"
            color="grey-10"
            size="18px"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionFromWork') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === 'toWork'">
          <q-icon
            name="arrow_forward"
            size="18px"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionToWork') }}
        </span>
      </div>
    </div>
    <div class="col-12 col-sm-10" data-cy="column-distance">
      <!-- Column: Distance -->
      <div class="flex items-center justify-between gap-8 q-pa-md">
        <!-- Transport type -->
        <div v-if="route.transport" class="flex no-wrap items-center gap-8">
          <!-- Icon -->
          <q-avatar size="32px" color="secondary" data-cy="avatar-transport">
            <q-icon
              color="primary"
              :name="getRouteIcon(route.transport)"
              size="18px"
              data-cy="icon-transport"
            />
          </q-avatar>
          <!-- Label -->
          <span data-cy="description-transport">
            {{ $t(`routes.transport.${route.transport}`) }}
          </span>
        </div>
        <!-- Distance -->
        <div v-if="route.distance" data-cy="label-distance">
          {{ route.distance }} {{ $t('global.routeLengthUnit') }}
        </div>
      </div>
    </div>
  </div>
</template>
