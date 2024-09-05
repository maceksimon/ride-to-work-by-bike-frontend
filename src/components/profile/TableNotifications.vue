<script lang="ts">
/**
 * TableNotifications Component
 *
 * @description * Use this component to display notifications in a table.
 * Shows icon, notification title, date, state and action button.
 * After clicking on a notification, it is moved to the "read" state.
 * If the notification has a URL, it is opened.
 * Action button click marks the notification as read, but does not open URL.
 *
 * Used in `ProfileTabs`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <table-notifications />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105372&t=WcrxMvLONggUrjGt-1)
 */

// libraries
import { date } from 'quasar';
import { computed, defineComponent, reactive } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// enums
enum NotificationTableColumn {
  title = 'title',
  timestamp = 'timestamp',
  unread = 'unread',
  action = 'action',
}

// fixtures
import tableNotificationsFixture from '../../../test/cypress/fixtures/tableNotifications.json';

// types
import type { TableColumn } from '../types/Table';
import type { Notification } from '../types/Notifications';

export default defineComponent({
  name: 'TableNotifications',
  setup() {
    const columns: TableColumn[] = [
      {
        name: NotificationTableColumn.title,
        align: 'left',
        label: i18n.global.t('notifications.labelTitle'),
        field: 'verb',
        format: (val: string | number | null): string => `${val}`,
        sortable: false,
        required: true,
      },
      {
        name: NotificationTableColumn.timestamp,
        align: 'left',
        label: i18n.global.t('notifications.labelDate'),
        field: 'timestamp',
        format: (val: number | string | null): string =>
          val ? date.formatDate(new Date(String(val)), 'D. MMM. YYYY') : '',
        sortable: true,
        required: true,
      },
      {
        name: NotificationTableColumn.unread,
        align: 'left',
        label: i18n.global.t('notifications.labelState'),
        field: 'unread',
        format: (val: number | string | null): string =>
          val
            ? i18n.global.t('notifications.labelUnread')
            : i18n.global.t('notifications.labelRead'),
        sortable: true,
        required: true,
      },
      {
        name: NotificationTableColumn.action,
        align: 'right',
        label: i18n.global.t('notifications.labelAction'),
        field: 'action',
        sortable: false,
        required: false,
      },
    ];

    const rows = reactive<Notification[]>(tableNotificationsFixture);

    const onNotificationClick = (row: Notification): void => {
      markAsRead(row);
      if (row.data.url) {
        window.location.href = row.data.url;
      }
    };

    const markAsRead = (row: Notification): void => {
      row.unread = false;
    };

    const markAllAsRead = (): void => {
      rows.forEach((row) => {
        markAsRead(row);
      });
    };

    const unreadCount = computed(() => {
      return rows.filter((row) => row.unread).length;
    });

    return {
      columns,
      rows,
      markAsRead,
      markAllAsRead,
      NotificationTableColumn,
      unreadCount,
      onNotificationClick,
    };
  },
});
</script>

<template>
  <div data-cy="table-notifications">
    <div class="flex justify-end q-mb-lg">
      <q-btn
        unelevated
        rounded
        outline
        color="primary"
        :disabled="unreadCount === 0"
        data-cy="button-mark-all-as-read"
        @click.prevent="markAllAsRead"
      >
        <q-icon name="check" size="18px" class="q-mr-sm" />
        {{ $t('notifications.labelMarkAllAsRead') }}
      </q-btn>
    </div>

    <!-- Table -->
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      :row-key="NotificationTableColumn.title"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          class="cursor-pointer"
          data-cy="notification-row"
          @click="onNotificationClick(props.row)"
        >
          <q-td
            :key="NotificationTableColumn.title"
            :props="props"
            class="text-grey-10"
            data-cy="notification-title"
          >
            <q-icon
              :name="props.row.data.icon"
              size="18px"
              color="primary"
              class="q-mr-sm"
              data-cy="notification-icon"
            />
            <component
              :is="props.row.data.url ? 'a' : 'span'"
              :href="props.row.data.url"
              :class="props.row.unread ? 'text-weight-bold' : ''"
              target="_blank"
              data-cy="notification-verbal"
              @click.prevent
              >{{ props.row.verb }}</component
            >
          </q-td>
          <q-td
            :key="NotificationTableColumn.timestamp"
            :props="props"
            data-cy="notification-timestamp"
          >
            <template v-for="col in props.cols" :key="col.field">
              <span v-if="col.field === NotificationTableColumn.timestamp">
                {{ col.value }}
              </span>
            </template>
          </q-td>
          <q-td
            :key="NotificationTableColumn.unread"
            :props="props"
            data-cy="notification-state"
          >
            <template v-for="col in props.cols" :key="col.field">
              <q-badge
                v-if="col.field === NotificationTableColumn.unread"
                :color="props.row.unread ? 'orange' : 'green'"
              >
                {{ col.value }}
              </q-badge>
            </template>
          </q-td>
          <q-td
            :key="NotificationTableColumn.action"
            :props="props"
            data-cy="notification-action"
          >
            <q-btn
              round
              unelevated
              size="xs"
              :outline="!props.row.unread"
              :disabled="!props.row.unread"
              color="primary"
              :icon="
                props.row.unread
                  ? 'mdi-email-check-outline'
                  : 'mdi-email-open-outline'
              "
              @click.stop="markAsRead(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
