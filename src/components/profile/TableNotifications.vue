<script lang="ts">
/**
 * TableNotifications Component
 *
 * @description * Use this component to display notifications in a table.
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
import { defineComponent } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// fixtures
import tableNotificationsFixture from '../../../test/cypress/fixtures/tableNotifications.json';

export default defineComponent({
  name: 'TableNotifications',
  setup() {
    const columns = [
      {
        name: 'title',
        required: true,
        label: i18n.global.t('notifications.labelTitle'),
        align: 'left',
        field: 'verb',
        format: (val) => `${val}`,
        sortable: false,
      },
      {
        name: 'timestamp',
        align: 'left',
        label: i18n.global.t('notifications.labelDate'),
        field: 'timestamp',
        format: (val: number | string | null): string =>
          val ? date.formatDate(new Date(String(val)), 'D. MMM. YYYY') : '',
        sortable: true,
      },
      {
        name: 'unread',
        align: 'left',
        label: i18n.global.t('notifications.labelState'),
        field: 'unread',
        format: (val: number | string | null): string =>
          val
            ? i18n.global.t('notifications.labelUnread')
            : i18n.global.t('notifications.labelRead'),
        sortable: true,
      },
      {
        name: 'action',
        label: i18n.global.t('notifications.labelAction'),
        field: 'action',
      },
    ];

    const rows: Notification[] = tableNotificationsFixture;

    return {
      columns,
      rows,
    };
  },
});
</script>

<template>
  <div data-cy="table-notifications">
    <div></div>

    <!-- Table -->
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="onRowClick(props.row)">
          <q-td key="title" :props="props">
            {{ props.row.verb }}
          </q-td>
          <q-td key="timestamp" :props="props">
            <template v-for="col in props.cols" :key="col.field">
              <span v-if="col.field === 'timestamp'">
                {{ col.value }}
              </span>
            </template>
          </q-td>
          <q-td key="unread" :props="props">
            <template v-for="col in props.cols" :key="col.field">
              <q-badge
                v-if="col.field === 'unread'"
                :color="props.row.unread ? 'orange' : 'green'"
              >
                {{ col.value }}
              </q-badge>
            </template>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              round
              size="sm"
              :outline="!props.row.unread"
              :disabled="!props.row.unread"
              color="primary"
              :icon="props.row.unread ? 'check' : 'close'"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
