import { createPinia, setActivePinia } from 'pinia';
import FormCreateInvoice from 'components/form/FormCreateInvoice.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

describe('<FormCreateInvoice>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelBusinessId',
        'labelTaxId',
        'labelConfirmBillingDetails',
        'labelDonorEntryFee',
        'labelOrderNote',
        'labelOrderNumber',
        'textDonorEntryFee',
        'titleAdditionalInformation',
        'titleDonorEntryFee',
        'titleOrganizationBillingDetails',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormCreateInvoice, {});
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormCreateInvoice, {});
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('tableAttendanceTestData.json').then((organizationData) => {
      // Create invoice data that matches organization user profile IDs
      const testInvoiceData = [
        {
          payments_to_invoice: [
            {
              id: 1,
              amount: 390,
              userprofile_id: 50001, // Match Jan Novák from organization data
              payment_status: 1005,
              pay_type: 'fc',
              pay_category: 'entry_fee',
            },
            {
              id: 2,
              amount: 390,
              userprofile_id: 50002, // Match Petra Svobodová from organization data
              payment_status: 1005,
              pay_type: 'fc',
              pay_category: 'entry_fee',
            },
          ],
          invoices: [],
        },
      ];

      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: organizationData.storeData,
          invoices: testInvoiceData,
        });
      });

      // component
      cy.dataCy('form-create-invoice').should('be.visible');
      // title
      cy.dataCy('form-create-invoice-title')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleOrganizationBillingDetails'));
      // organization details
      const organization = organizationData.storeData[0];
      cy.dataCy('form-create-invoice-organization-details')
        .should('be.visible')
        .and('contain', organization.name)
        .and('contain', organization.street)
        .and('contain', organization.street_number)
        .and('contain', organization.psc)
        .and('contain', organization.city);
      cy.dataCy('form-create-invoice-organization-id')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelBusinessId'))
        .and('contain', organization.ico);
      cy.dataCy('form-create-invoice-organization-vat-id')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelTaxId'))
        .and('contain', organization.dic);

      // confirm billing details
      cy.dataCy('form-create-invoice-confirm-billing-details')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelConfirmBillingDetails'));
      // edit billing details
      cy.dataCy('form-create-invoice-edit-billing-details')
        .should('be.visible')
        .and('contain', i18n.global.t('form.textEditBillingDetails'))
        .and('contain', i18n.global.t('form.linkEditBillingDetails'));
      // participants
      cy.dataCy('form-create-invoice-team').should('be.visible');
      // additional information
      cy.dataCy('form-create-invoice-additional-information')
        .find('h3')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleAdditionalInformation'));
      // order number
      cy.dataCy('form-create-invoice-order-number')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelOrderNumber'));
      // order note
      cy.dataCy('form-create-invoice-note')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelOrderNote'));
      // entry fee title
      cy.dataCy('form-create-invoice-donor-entry-fee')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleDonorEntryFee'));
      // entry fee text
      cy.dataCy('form-create-invoice-donor-entry-fee-text')
        .should('be.visible')
        .then(($element) => {
          const text = $element.text();
          cy.stripHtmlTags(i18n.global.t('form.textDonorEntryFee')).then(
            (content) => {
              expect(text).to.equal(content);
            },
          );
        });
      // entry fee toggle
      cy.dataCy('form-create-invoice-donor-entry-fee-toggle')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelDonorEntryFee'));
    });
  });
}
