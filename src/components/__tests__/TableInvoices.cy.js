import { colors } from 'quasar';
import TableInvoices from 'components/coordinator/TableInvoices.vue';
import { i18n } from '../../boot/i18n';
import tableInvoices from '../../../test/cypress/fixtures/tableInvoices.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useTableInvoices } from '../../composables/useTable';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const classSelectorTableSortable = 'th.sortable';
const selectorTableInvoices = 'table-invoices';
const selectorTableTitle = 'table-invoices-title';
const selectorTable = 'table-invoices-table';
const selectorTableRow = 'table-invoices-row';
const selectorTableIssueDate = 'table-invoices-issue-date';
const selectorTableOrderNumber = 'table-invoices-order-number';
const selectorTableFiles = 'table-invoices-files';
const selectorTableFileIcon = 'table-invoices-file-icon';
const selectorTableFileLabel = 'table-invoices-file-label';
const selectorTableVariableSymbol = 'table-invoices-variable-symbol';
const selectorTablePaymentCount = 'table-invoices-payment-count';
const selectorTableAmount = 'table-invoices-amount';
const selectorTableConfirmationDate = 'table-invoices-confirmation-date';

/**
 * Sort order
 * To test sorting, predefine sets of correctly sorted data.
 */
const dataByIssueDateAsc = [
  tableInvoices[0], // January
  tableInvoices[1], // June
  tableInvoices[2], // October
];

const dataByIssueDateDesc = [
  tableInvoices[2], // October
  tableInvoices[1], // June
  tableInvoices[0], // January
];

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const iconSize = 18;
const marginXs = 4;
const { getFileLabel } = useTableInvoices();

describe('<TableInvoices>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleInvoices',
        'labelIssueDate',
        'labelOrderNumber',
        'labelFiles',
        // 'labelVariableSymbol', // string is identical in all languages
        'labelPaymentCount',
        'labelAmountIncludingVat',
        'labelConfirmationDate',
        'labelNotConfirmed',
      ],
      'table',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('tableInvoices').then((rows) => {
        cy.wrap(rows).as('rows');
        cy.mount(TableInvoices, {
          props: {},
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('tableInvoices').then((rows) => {
        cy.wrap(rows).as('rows');
        cy.mount(TableInvoices, {
          props: {},
        });
        cy.viewport('iphone-6');
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorTableInvoices).should('be.visible');
  });

  it('renders title', () => {
    cy.dataCy(selectorTableTitle)
      .should('be.visible')
      .and('contain', i18n.global.t('table.titleInvoices'));
  });

  it('renders table with correct styling', () => {
    // table
    cy.dataCy(selectorTable)
      .should('be.visible')
      .and('have.css', 'border-radius', borderRadius);
    // table row
    cy.dataCy(selectorTableRow).should('be.visible').and('have.color', grey10);
    // table cells
    [
      selectorTableIssueDate,
      selectorTableOrderNumber,
      selectorTableFiles,
      selectorTableVariableSymbol,
      selectorTablePaymentCount,
      selectorTableAmount,
      selectorTableConfirmationDate,
    ].forEach((selector) => {
      cy.dataCy(selector).should('be.visible');
    });
  });

  it('displays correct data in table', () => {
    cy.get('@rows').then((rows) => {
      // default sorting by issueDate ascending
      cy.dataCy(selectorTableRow)
        .should('have.length', rows.length)
        .each((tableRow, index) => {
          cy.wrap(tableRow).within(() => {
            // order number
            cy.dataCy(selectorTableOrderNumber).should(
              'contain',
              rows[index].orderNumber,
            );
            // files
            cy.dataCy(selectorTableFiles).within(() => {
              // buttons
              cy.get('.q-btn').should('have.length', rows[index].files.length);
              // loop over files
              rows[index].files.forEach((file, fileIndex) => {
                cy.get('.q-btn')
                  .eq(fileIndex)
                  .should('have.attr', 'href', file.url)
                  .within(() => {
                    // icon
                    cy.dataCy(selectorTableFileIcon)
                      .should('be.visible')
                      .and('have.color', primary)
                      .and('have.css', 'margin-right', `${marginXs}px`);
                    cy.dataCy(selectorTableFileIcon)
                      .invoke('width')
                      .should('eq', iconSize);
                    cy.dataCy(selectorTableFileIcon)
                      .invoke('height')
                      .should('eq', iconSize);
                    // label
                    const label = getFileLabel(rows[index].files[fileIndex].id);
                    cy.dataCy(selectorTableFileLabel).should('contain', label);
                  });
              });
            });
            // variable symbol
            cy.dataCy(selectorTableVariableSymbol).should(
              'contain',
              rows[index].variableSymbol,
            );
            // payment count
            cy.dataCy(selectorTablePaymentCount).should(
              'contain',
              rows[index].paymentCount,
            );
            // amount
            cy.dataCy(selectorTableAmount).should(
              'contain',
              rows[index].amount,
            );
          });
        });
    });
  });

  it('sorts correctly by issueDate', () => {
    cy.get('@rows').then((rows) => {
      // default sorting by issueDate ascending
      cy.dataCy(selectorTableRow)
        .should('have.length', rows.length)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should(
            'contain',
            dataByIssueDateAsc[index].orderNumber,
          );
        });
      // sorting by issueDate descending
      cy.dataCy(selectorTableInvoices)
        .find(classSelectorTableSortable)
        .first()
        .click();
      // check if data is sorted correctly
      cy.dataCy(selectorTableRow)
        .should('have.length', rows.length)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should(
            'contain',
            dataByIssueDateDesc[index].orderNumber,
          );
        });
    });
  });

  it('formats dates correctly', () => {
    cy.get('@rows').then((rows) => {
      cy.dataCy(selectorTableRow).each((tableRow, index) => {
        cy.wrap(tableRow).within(() => {
          cy.wrap(
            i18n.global.d(new Date(rows[index].issueDate), 'numeric'),
          ).then((value) => {
            cy.log(`Table row localized date time format is <${value}>.`);
          });
          // issue date
          cy.dataCy(selectorTableIssueDate).then(($td) => {
            cy.wrap($td[0]).should(
              'contain',
              i18n.global.d(new Date(rows[index].issueDate), 'numeric'),
            );
          });
          // confirmation date
          cy.dataCy(selectorTableConfirmationDate).then(($td) => {
            const date = rows[index].confirmationDate;
            const expectedText = date
              ? i18n.global.d(new Date(date), 'numeric')
              : i18n.global.t('table.labelNotConfirmed');
            expect($td.text().trim()).to.equal(expectedText);
          });
        });
      });
    });
  });
}
