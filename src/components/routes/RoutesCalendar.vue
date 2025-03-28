<script lang="ts">
/**
 * RoutesCalendar Component
 *
 * @description * Use this component to render a calendar for logging routes.
 * This component is used on `RoutesPage` in `RouteTabs` component.
 *
 * Note: Calendar is NOT made responsive. We use list view to log routes on mobile.
 *
 * @components
 * - `CalendarNavigation`: Component to render navigation buttons.
 * - `CalendarItemDisplay`: Component to render calendar items.
 * - `RouteCalendarPanel`: Component to render dialog panel.
 *
 * @props
 * - `routes`: Array of routes to display in the calendar.
 *
 * @example
 * <routes-calendar />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104006&t=kwUDasKoJ1urpPut-1)
 */

// libraries
import { colors, date } from 'quasar';
import {
  addToDate,
  getDate,
  makeDate,
  nextDay,
  prevDay,
  parseTimestamp,
  QCalendarMonth,
  today,
} from '@quasar/quasar-ui-qcalendar';
import { defineComponent, computed, inject, ref, watch } from 'vue';
import { i18n } from '../../boot/i18n';

// components
import CalendarItemDisplay from './CalendarItemDisplay.vue';
import CalendarNavigation from './CalendarNavigation.vue';
import RouteCalendarPanel from './RouteCalendarPanel.vue';

// composables
import { useCalendarRoutes } from '../../composables/useCalendarRoutes';
import { useRoutes } from 'src/composables/useRoutes';

// enums
import { TransportDirection } from '../types/Route';
import { PhaseType } from '../types/Challenge';

// stores
import { useChallengeStore } from '../../stores/challenge';
import { useTripsStore } from 'src/stores/trips';

// types
import type { Timestamp } from '@quasar/quasar-ui-qcalendar';
import type { RouteDay, RouteItem } from '../types/Route';
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'RoutesCalendar',
  components: {
    CalendarItemDisplay,
    CalendarNavigation,
    RouteCalendarPanel,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const challengeStore = useChallengeStore();
    const calendar = ref<typeof QCalendarMonth | null>(null);
    const selectedDate = ref<string>(today());
    const locale = computed((): string => {
      return i18n.global.locale;
    });

    /**
     * Disable logging after a date
     * Calendar disables all dates after the returned date.
     * This is done based on two conditions:
     * 1. Future date (date is after today)
     * 2. Day is outside the `competition` phase date range
     * @returns {string | null} - Date in `YYYY-MM-DD` format
     */
    const disabledAfter = computed((): string | null => {
      const timestampToday = parseTimestamp(today());
      const timestampTomorrow = nextDay(timestampToday);
      const dateTomorrow = makeDate(timestampTomorrow);

      const competitionPhaseDateTo = challengeStore.getPhaseFromSet(
        PhaseType.competition,
      )?.date_to;
      if (!competitionPhaseDateTo) {
        return getDate(timestampTomorrow) || null;
      }
      const timestampCompetitionPhaseDateTo = parseTimestamp(
        competitionPhaseDateTo,
      );
      const dateCompetitionPhaseDateTo = makeDate(
        timestampCompetitionPhaseDateTo,
      );

      const isTomorrowBeforeCompetitionDateTo =
        date.getDateDiff(dateTomorrow, dateCompetitionPhaseDateTo, 'days') < 0;

      return isTomorrowBeforeCompetitionDateTo
        ? getDate(timestampTomorrow)
        : getDate(nextDay(timestampCompetitionPhaseDateTo));
    });

    /**
     * Disable logging before a date
     * Calendar disables all dates before the returned date.
     * This is done based on two conditions:
     * 1. Window of logging days before today
     * 2. Day is outside the `competition` phase date range
     * @returns {string | null} - Date in `YYYY-MM-DD` format
     */
    const disabledBefore = computed((): string | null => {
      const timestampToday = parseTimestamp(today());
      const timestampStartOfLoggingWindow = timestampToday
        ? addToDate(timestampToday, {
            day: -1 * challengeStore.getDaysActive,
          })
        : null;
      const dateStartOfLoggingWindow = makeDate(timestampStartOfLoggingWindow);

      const competitionPhaseDateFrom = challengeStore.getPhaseFromSet(
        PhaseType.competition,
      )?.date_from;
      if (!competitionPhaseDateFrom) {
        return getDate(timestampStartOfLoggingWindow) || null;
      }
      const timestampCompetitionPhaseDateFrom = parseTimestamp(
        competitionPhaseDateFrom,
      );
      const dateCompetitionPhaseDateFrom = makeDate(
        timestampCompetitionPhaseDateFrom,
      );

      const isStartOfLoggingWindowAfterCompetitionPhaseDateFrom =
        date.getDateDiff(
          dateStartOfLoggingWindow,
          dateCompetitionPhaseDateFrom,
          'days',
        ) > 0;

      return isStartOfLoggingWindowAfterCompetitionPhaseDateFrom
        ? getDate(timestampStartOfLoggingWindow)
        : getDate(prevDay(timestampCompetitionPhaseDateFrom));
    });

    const tripsStore = useTripsStore();
    const { createDaysArrayWithRoutes } = useRoutes();
    const routesByDay = computed(() => {
      // get route items from store
      const routeItems: RouteItem[] = tripsStore.getRouteItems;
      // get competition phase dates
      const competitionPhaseDateTo = challengeStore.getPhaseFromSet(
        PhaseType.competition,
      )?.date_to;
      const competitionPhaseDateFrom = challengeStore.getPhaseFromSet(
        PhaseType.competition,
      )?.date_from;
      // get dates
      const dateFrom = competitionPhaseDateFrom
        ? new Date(competitionPhaseDateFrom)
        : null;
      const dateTo = competitionPhaseDateTo
        ? new Date(competitionPhaseDateTo)
        : null;
      if (!dateFrom || !dateTo) {
        return [];
      }
      logger?.debug(
        `Create days array with routes <${JSON.stringify(routeItems, null, 2)}>.`,
      );
      // create days array with routes
      const daysWithRoutes = createDaysArrayWithRoutes(
        dateFrom,
        dateTo,
        routeItems,
      );
      logger?.debug(
        `Days with routes <${JSON.stringify(daysWithRoutes, null, 2)}>.`,
      );
      return daysWithRoutes;
    });

    // Define calendar CSS vars for calendar theme
    const { getPaletteColor } = colors;
    const theme = {
      '--calendar-active-date-color': getPaletteColor('primary'),
      '--calendar-current-color': getPaletteColor('primary'),
      '--calendar-border-current': `${getPaletteColor('primary')} 2px solid`,
    };

    // Compute month name and year for title
    const monthNameAndYear = computed((): string => {
      if (!selectedDate.value) {
        return '';
      }
      const date = new Date(selectedDate.value);
      const month = date.toLocaleString(locale.value, { month: 'long' });
      const year = date.toLocaleString(locale.value, { year: 'numeric' });
      return `${month} ${year}`;
    });

    // Calendar naviation functions
    function onToday(): void {
      calendar.value?.moveToToday();
    }
    function onPrev(): void {
      calendar.value?.prev();
    }
    function onNext(): void {
      calendar.value?.next();
    }

    // Get data
    const days = computed<RouteDay[]>(() => routesByDay.value);

    const {
      activeRoutes,
      activeRouteItems,
      isActiveRouteLogged,
      routesMap,
      getActiveIndex,
      isActive,
      isCalendarRouteLogged,
    } = useCalendarRoutes(days);

    /**
     * Handles click on route item within a day frame.
     * It triggers active state on that day.
     * It controls content of the route-logging dialog panel.
     * @param {Object} { timestamp: Timestamp; direction: TransportDirection }
     * @return {void}
     */
    function onClickItem({
      timestamp,
      direction,
    }: {
      timestamp: Timestamp;
      direction: TransportDirection;
    }): void {
      if (isActive({ timestamp, direction })) {
        activeRoutes.value.splice(getActiveIndex({ timestamp, direction }), 1);
      } else {
        if (
          isActiveRouteLogged.value ||
          isCalendarRouteLogged({ timestamp, direction })
        ) {
          // do not allow selecting multiple logged routes
          activeRoutes.value = [];
        }
        activeRoutes.value.push({ timestamp, direction });
      }
    }

    /**
     * Triggered when user saves active routes.
     * Clears active selection
     */
    function onSave(): void {
      activeRoutes.value = [];
    }

    /**
     * Control dialog open state based on selected routes count.
     */
    const isPanelOpen = ref<boolean>(false);
    watch(
      (): number => activeRoutes.value.length,
      (length): void => {
        if (length === 0) {
          isPanelOpen.value = false;
        } else {
          isPanelOpen.value = true;
        }
      },
    );

    return {
      activeRouteItems,
      calendar,
      disabledAfter,
      disabledBefore,
      isPanelOpen,
      isActiveRouteLogged,
      locale,
      monthNameAndYear,
      routesMap,
      selectedDate,
      theme,
      TransportDirection,
      isActive,
      onClickItem,
      onNext,
      onPrev,
      onSave,
      onToday,
    };
  },
});
</script>

<template>
  <div data-cy="routes-calendar" class="relative-position">
    <!-- Top bar -->
    <div class="row q-pb-sm q-my-lg items-center gap-8">
      <!-- Title -->
      <div
        class="col-12 col-sm-auto text-h5 text-capitalize text-weight-bold"
        data-cy="calendar-title"
      >
        {{ monthNameAndYear }}
      </div>
      <!-- Navigation buttons -->
      <calendar-navigation
        @next="onNext"
        @prev="onPrev"
        @today="onToday"
        class="col-12 col-sm"
      />
    </div>
    <!-- Calendar -->
    <div class="row justify-center q-mt-lg">
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        animated
        bordered
        hoverable
        no-active-date
        use-navigation
        short-weekday-label
        :disabled-before="disabledBefore"
        :disabled-after="disabledAfter"
        :locale="locale"
        :show-month-label="false"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        weekday-align="center"
        :style="theme"
        date-align="right"
        date-type="rounded"
        :day-min-height="100"
      >
        <template #day="{ scope: { timestamp, outside } }">
          <!-- TODO: make the empty slots display only on the challenge days -->
          <div v-if="!timestamp.future" class="q-my-sm" data-cy="calendar-day">
            <!-- Route to work -->
            <calendar-item-display
              :active="
                isActive({ timestamp, direction: TransportDirection.toWork })
              "
              :disabled="outside || timestamp.disabled"
              :direction="TransportDirection.toWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
              data-cy="calendar-item-display-to-work"
            />
            <!-- Route from work -->
            <calendar-item-display
              :active="
                isActive({ timestamp, direction: TransportDirection.fromWork })
              "
              :disabled="outside || timestamp.disabled"
              :direction="TransportDirection.fromWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
              data-cy="calendar-item-display-from-work"
            />
          </div>
        </template>
      </q-calendar-month>
    </div>
    <route-calendar-panel
      v-model="isPanelOpen"
      :routes="activeRouteItems"
      @save="onSave"
      data-cy="route-calendar-panel"
    />
  </div>
</template>
