import FormSelectOrganization from 'components/form/FormSelectOrganization.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormFieldCompanyAddress = 'form-company-address';
const selectorFormFieldSelectTable = 'form-select-table-company';
const selectorFormSelectOrganization = 'form-select-organization';

describe('<FormSelectOrganization>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders the main component', () => {
    cy.dataCy(selectorFormSelectOrganization).should('be.visible');
  });

  it('renders the FormFieldSelectTable component', () => {
    cy.dataCy(selectorFormFieldSelectTable).should('be.visible');
  });

  it('renders the FormFieldCompanyAddress component', () => {
    cy.dataCy(selectorFormFieldCompanyAddress).should('be.visible');
  });
}
