<script lang="ts">
/**
 * TableInvoices Component
 *
 * @description * Use this component to display a table with invoice information.
 * Shown on the invoices management page.
 *
 * @example
 * <table-invoices />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105324&t=bpoq22gURhREo0rw-1)
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, onMounted, ref } from 'vue';

// composables
import { useTableInvoices } from '../../composables/useTable';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

import { InvoicesTableColumns } from '../../components/types/Table';

// fixtures
// TODO: Create and import tableInvoices fixture
import tableInvoices from '../../../test/cypress/fixtures/tableInvoices.json';

export default defineComponent({
  name: 'TableInvoices',

  setup() {
    const tableRef = ref<QTable | null>(null);
    // sort by issueDate initially
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('issueDate');
      }
    });

    const { columns, visibleColumns, getFileIcon, getFileLabel } =
      useTableInvoices();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      columns,
      InvoicesTableColumns,
      tableInvoices,
      tableRef,
      visibleColumns,
      getFileIcon,
      getFileLabel,
    };
  },
});
</script>

<template>
  <div class="q-pa-md" data-cy="table-invoices">
    <div>
      <!-- Title -->
      <h3
        class="text-body1 text-bold text-black q-my-none"
        data-cy="table-invoices-title"
      >
        {{ $t('table.titleInvoices') }}
      </h3>
    </div>
    <div class="q-my-lg">
      <!-- Table -->
      <q-table
        ref="tableRef"
        flat
        bordered
        binary-state-sort
        :rows="tableInvoices"
        :columns="columns"
        :visible-columns="visibleColumns"
        :row-key="InvoicesTableColumns.orderNumber"
        :style="{ borderRadius }"
        data-cy="table-invoices-table"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="text-grey-10"
            data-cy="table-invoices-row"
          >
            <!-- Issue Date -->
            <q-td
              :key="InvoicesTableColumns.issueDate"
              :props="props"
              data-cy="table-invoices-issue-date"
            >
              <!-- Loop over data to get formatted content -->
              <template v-for="col in props.cols" :key="col.field">
                <span v-if="col.field === InvoicesTableColumns.issueDate">
                  {{ col.value }}
                </span>
              </template>
            </q-td>
            <!-- Order Number -->
            <q-td
              :key="InvoicesTableColumns.orderNumber"
              :props="props"
              data-cy="table-invoices-order-number"
            >
              {{ props.row.orderNumber }}
            </q-td>
            <!-- Files -->
            <q-td
              :key="InvoicesTableColumns.files"
              :props="props"
              data-cy="table-invoices-files"
            >
              <!-- TODO: Implement file download/preview functionality -->
              <div class="flex flex-wrap gap-4">
                <!-- Button: Invoice preview -->
                <q-btn
                  dense
                  flat
                  no-caps
                  rounded
                  v-for="file in props.row.files"
                  :key="file.id"
                  :href="file.url"
                >
                  <!-- Icon -->
                  <q-icon
                    :name="getFileIcon(file.id)"
                    size="18px"
                    color="primary"
                    class="q-mr-xs"
                    data-cy="table-invoices-file-icon"
                  />
                  <!-- Label -->
                  <span data-cy="table-invoices-file-label">
                    {{ getFileLabel(file.id) }}
                  </span>
                </q-btn>
              </div>
            </q-td>
            <!-- Variable Symbol -->
            <q-td
              :key="InvoicesTableColumns.variableSymbol"
              :props="props"
              data-cy="table-invoices-variable-symbol"
            >
              {{ props.row.variableSymbol }}
            </q-td>
            <!-- Payment Count -->
            <q-td
              :key="InvoicesTableColumns.paymentCount"
              :props="props"
              data-cy="table-invoices-payment-count"
            >
              {{ props.row.paymentCount }}
            </q-td>
            <!-- Amount -->
            <q-td
              :key="InvoicesTableColumns.amount"
              :props="props"
              data-cy="table-invoices-amount"
            >
              {{ props.row.amount }}
            </q-td>
            <!-- Confirmation Date -->
            <q-td
              :key="InvoicesTableColumns.confirmationDate"
              :props="props"
              data-cy="table-invoices-confirmation-date"
            >
              <!-- Loop over data to get formatted content -->
              <template v-for="col in props.cols" :key="col.field">
                <span
                  v-if="
                    col.field === InvoicesTableColumns.confirmationDate &&
                    col.value
                  "
                >
                  {{ col.value }}
                </span>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
